import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { parseReportInput } from '@/lib/reports'
import { autoLinkUnlinked, resolveClientId, syncLinkedRecord } from '@/lib/report-sync'

export const dynamic = 'force-dynamic'

function buildWhere(params: URLSearchParams) {
  const from = params.get('from')
  const to = params.get('to')
  const q = params.get('q')?.trim()
  const type = params.get('type')

  const where: any = {}
  if (from || to) {
    where.date = {}
    if (from) where.date.gte = new Date(`${from}T00:00:00.000Z`)
    if (to) where.date.lte = new Date(`${to}T00:00:00.000Z`)
  }
  if (type && type !== 'ALL') where.type = type
  if (q) {
    where.OR = [
      { shopName: { contains: q } },
      { address: { contains: q } },
      { concern: { contains: q } },
      { technicians: { contains: q } },
      { contactName: { contains: q } },
      { steps: { some: { text: { contains: q } } } },
    ]
  }
  return where
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  await autoLinkUnlinked() // connect any reports that aren't linked to a client yet
  const reports = await prisma.serviceReport.findMany({
    where: buildWhere(searchParams),
    include: { steps: { orderBy: { order: 'asc' } } },
    orderBy: [{ date: 'desc' }, { id: 'desc' }],
  })
  return NextResponse.json(reports)
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => null)
  const parsed = parseReportInput(body)
  if (!parsed.ok) return NextResponse.json({ error: parsed.error }, { status: 400 })
  const { steps, ...rest } = parsed.data
  const clientId = await resolveClientId(
    typeof body.clientId === 'string' && body.clientId ? body.clientId : null,
    parsed.data.shopName
  )

  const linkedId = await syncLinkedRecord(parsed.data, clientId, null)
  const created = await prisma.serviceReport.create({
    data: { ...rest, clientId, linkedId, steps: { create: steps.map((text, order) => ({ order, text })) } },
    include: { steps: { orderBy: { order: 'asc' } } },
  })
  return NextResponse.json(created, { status: 201 })
}