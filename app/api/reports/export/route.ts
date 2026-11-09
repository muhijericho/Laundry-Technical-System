import { prisma } from '@/lib/prisma'
import { buildReportsWorkbook } from '@/lib/reports-export'
import type { ReportDTO } from '@/lib/reports'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const from = searchParams.get('from')
  const to = searchParams.get('to')
  const type = searchParams.get('type')
  const q = searchParams.get('q')?.trim()

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

  const reports = await prisma.serviceReport.findMany({
    where,
    include: { steps: { orderBy: { order: 'asc' } } },
  })
  const buf = await buildReportsWorkbook(reports as unknown as ReportDTO[])

  return new Response(new Uint8Array(buf), {
    headers: {
      'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Disposition': `attachment; filename="Service_Reports_${from ?? 'all'}_${to ?? 'all'}.xlsx"`,
    },
  })
}