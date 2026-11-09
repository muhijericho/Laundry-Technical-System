import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const q = searchParams.get('q')?.trim()

  const where: any = { type: 'PMS' }
  if (q) {
    where.OR = [
      { shopName: { contains: q } },
      { address: { contains: q } },
      { technicians: { contains: q } },
    ]
  }

  const reports = await prisma.serviceReport.findMany({
    where,
    include: { steps: { orderBy: { order: 'asc' as const } } }, // Added 'as const'
    orderBy: [{ date: 'desc' }, { id: 'desc' }],
  })

  const pmsRecords = reports.map((r) => ({
    id: r.id,
    date: r.date,
    shopName: r.shopName,
    address: r.address,
    technicians: r.technicians,
    contactName: r.contactName,
    status: 'completed' as const,
    machineType: 'Not specified',
    notes: r.steps.map((s: any) => s.text).join('\n'), // Explicitly typed 's' to fix implicit any error
    steps: r.steps,
    clientId: r.clientId,
  }))

  return NextResponse.json(pmsRecords)
}