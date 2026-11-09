export const REPORT_TYPES = [
  { value: 'REPAIR', label: 'Repair' },
  { value: 'PMS', label: 'PMS' },
  { value: 'INSTALLATION', label: 'Installation / Setup' },
  { value: 'TRAINING', label: 'Training / Seminar' },
  { value: 'LMS', label: 'LMS' },
  { value: 'OFFICE', label: 'Office work' },
] as const

export type ReportType = (typeof REPORT_TYPES)[number]['value']

export type ReportDTO = {
  id: number
  date: string
  shopName: string
  address: string | null
  concern: string | null
  type: string
  technicians: string | null
  contactName: string | null
  clientId: string | null
  steps: { id: number; order: number; text: string }[]
}

export type ReportInput = {
  date: Date
  shopName: string
  address: string | null
  concern: string | null
  type: ReportType
  technicians: string | null
  contactName: string | null
  steps: string[]
}

const clean = (v: unknown) => (typeof v === 'string' && v.trim() ? v.trim() : null)

export function parseReportInput(
  body: any
): { ok: true; data: ReportInput } | { ok: false; error: string } {
  if (!body || typeof body !== 'object') return { ok: false, error: 'Invalid body' }

  const dateStr = typeof body.date === 'string' ? body.date.slice(0, 10) : ''
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return { ok: false, error: 'Date is required (YYYY-MM-DD)' }
  const date = new Date(`${dateStr}T00:00:00.000Z`)
  if (Number.isNaN(date.getTime())) return { ok: false, error: 'Invalid date' }

  const shopName = clean(body.shopName)
  if (!shopName) return { ok: false, error: 'Laundry shop name is required' }

  const type = REPORT_TYPES.some((t) => t.value === body.type) ? (body.type as ReportType) : 'REPAIR'

  const steps = Array.isArray(body.steps)
    ? body.steps.map((s: unknown) => (typeof s === 'string' ? s.trim() : '')).filter(Boolean)
    : []
  if (steps.length === 0) return { ok: false, error: 'Add at least one report line' }

  return {
    ok: true,
    data: {
      date, shopName, type, steps,
      address: clean(body.address),
      concern: clean(body.concern),
      technicians: clean(body.technicians),
      contactName: clean(body.contactName),
    },
  }
}

export function fmtDate(iso: string | Date) {
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC',
  })
}

export const toDateInput = (iso: string | Date) => new Date(iso).toISOString().slice(0, 10)

export function detectType(shop: string, concern: string, steps: string[]): ReportType {
  const text = `${concern} ${steps.join(' ')}`.toLowerCase()
  if (/training|seminar/.test(text)) return 'TRAINING'
  if (/main office/i.test(shop)) return 'OFFICE'
  if (/\blms\b/.test(text)) return 'LMS'
  if (/\bpms\b/.test(text)) return 'PMS'
  if (/install|set\s?up/.test(text)) return 'INSTALLATION'
  return 'REPAIR'
}