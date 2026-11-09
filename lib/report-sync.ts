import { prisma } from '@/lib/prisma'
import type { ReportInput, ReportType } from '@/lib/reports'

export type ClientLite = { id: string; name: string }

const clean = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim()
const core = (s: string) =>
  clean(s).replace(/\b(laundry|laundromat|shop|hub|station|house|the|and)\b/g, ' ').replace(/\s+/g, ' ').trim()

/** Find the Client for a shop name. Only returns a result when the match is unambiguous. */
export function matchClient(clients: ClientLite[], shopName: string): string | null {
  const c = clean(shopName)
  if (!c) return null
  const exact = clients.filter((x) => clean(x.name) === c)
  if (exact.length === 1) return exact[0].id
  const k = core(shopName)
  if (k.length < 3) return null
  const same = clients.filter((x) => core(x.name) === k)
  return same.length === 1 ? same[0].id : null
}

export async function syncLinkedRecord(
  input: ReportInput,
  clientId: string | null,
  linkedId: string | null
): Promise<string | null> {
  if (!clientId) return null
  const notes = input.steps.join('\n')
  const common = {
    machineType: 'Not specified',
    technician: input.technicians,
    notes,
    status: 'completed',
    scheduledDate: input.date,
    completedDate: input.date,
  }

  if (input.type === 'REPAIR') {
    const data = { ...common, issueDescription: input.concern ?? input.steps[0] }
    if (linkedId) {
      const updated = await prisma.repair.update({ where: { id: linkedId }, data }).catch(() => null)
      if (updated) return updated.id
    }
    return (await prisma.repair.create({ data: { clientId, ...data } })).id
  }

  if (input.type === 'PMS') {
    await prisma.client.update({ where: { id: clientId }, data: { pmsStatus: 'done' } })
    if (linkedId) {
      const updated = await prisma.pMSRecord.update({ where: { id: linkedId }, data: common }).catch(() => null)
      if (updated) return updated.id
    }
    return (await prisma.pMSRecord.create({ data: { clientId, ...common } })).id
  }

  if (input.type === 'INSTALLATION') {
    if (linkedId) {
      const updated = await prisma.setup.update({ where: { id: linkedId }, data: common }).catch(() => null)
      if (updated) return updated.id
    }
    return (await prisma.setup.create({ data: { clientId, ...common } })).id
  }

  return null
}

export async function linkReport(reportId: number, clients: ClientLite[]): Promise<boolean> {
  const r = await prisma.serviceReport.findUnique({
    where: { id: reportId },
    include: { steps: { orderBy: { order: 'asc' as const } } },
  })
  if (!r) return false
  const clientId = matchClient(clients, r.shopName)
  if (!clientId) return false

  const linkedId = await syncLinkedRecord(
    {
      date: r.date,
      shopName: r.shopName,
      address: r.address,
      concern: r.concern,
      type: r.type as ReportType,
      technicians: r.technicians,
      contactName: r.contactName,
      steps: r.steps.map((s: { text: string }) => s.text), // Added type annotation
    },
    clientId,
    r.linkedId
  )
  await prisma.serviceReport.update({ where: { id: r.id }, data: { clientId, linkedId } })
  return true
}

/** Use the chosen client, or find one by shop name. */
export async function resolveClientId(clientId: string | null, shopName: string): Promise<string | null> {
  if (clientId) return clientId
  const clients = await prisma.client.findMany({ select: { id: true, name: true } })
  return matchClient(clients, shopName)
}

let running: Promise<void> | null = null

/**
 * Links every report that has no client yet (when a matching client exists).
 * Runs automatically whenever the reports list is loaded. Safe to call many times.
 */
export function autoLinkUnlinked(): Promise<void> {
  if (running) return running
  running = (async () => {
    const clients = await prisma.client.findMany({ select: { id: true, name: true } })
    if (clients.length === 0) return
    const pending = await prisma.serviceReport.findMany({
      where: { clientId: null },
      select: { id: true, shopName: true },
    })
    for (const r of pending) {
      if (matchClient(clients, r.shopName)) await linkReport(r.id, clients)
    }
  })()
    .catch((e) => console.error('auto-link failed', e))
    .finally(() => {
      running = null
    })
  return running
}