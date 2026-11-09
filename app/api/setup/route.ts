import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const q = searchParams.get('q')?.trim()

  // Filter specifically for INSTALLATION (Setup) reports
  const where: any = { type: 'INSTALLATION' }
  if (q) {
    where.OR = [
      { shopName: { contains: q } },
      { address: { contains: q } },
      { technicians: { contains: q } },
      { contactName: { contains: q } },
    ]
  }

  const reports = await prisma.serviceReport.findMany({
    where,
    include: { steps: { orderBy: { order: 'asc' as const } } },
    orderBy: [{ date: 'desc' }, { id: 'desc' }],
  })

  // Map ServiceReport shape to what the SetupTable expects
  const setups = reports.map((r) => ({
    id: r.id,
    scheduledDate: r.date, // Map 'date' to 'scheduledDate' for the table component
    shopName: r.shopName,
    address: r.address,
    technicians: r.technicians,
    contactName: r.contactName,
    status: 'completed' as const,
    machineType: 'Not specified',
    notes: r.steps.map((s: any) => s.text).join('\n'), // Explicitly typed to prevent implicit 'any' error
    steps: r.steps,
    clientId: r.clientId,
  }))

  return NextResponse.json(setups)
}