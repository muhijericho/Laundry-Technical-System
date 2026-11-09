import { NextResponse } from 'next/server'
import type { Prisma } from '@prisma/client'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const q = searchParams.get('q')?.trim()

  const where: Prisma.ServiceReportWhereInput = { type: 'REPAIR' }
  if (q) {
    where.OR = [
      { shopName: { contains: q } },
      { address: { contains: q } },
      { concern: { contains: q } },
      { technicians: { contains: q } },
    ]
  }

  const reports = await prisma.serviceReport.findMany({
    where,
    include: { steps: { orderBy: { order: 'asc' as const } } }, // Added 'as const'
    orderBy: [{ date: 'desc' }, { id: 'desc' }],
  })

  // Map ServiceReport shape to what the Repairs page expects
  const repairs = reports.map((r) => ({
    id: r.id,
    date: r.date,
    shopName: r.shopName,
    address: r.address,
    concern: r.concern,
    technicians: r.technicians,
    contactName: r.contactName,
    status: 'completed' as const,
    issueDescription: r.concern ?? r.steps[0]?.text ?? '',
    steps: r.steps,
    clientId: r.clientId,
  }))

  return NextResponse.json(repairs)
}