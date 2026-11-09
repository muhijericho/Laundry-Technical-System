import { prisma } from '@/lib/prisma'
import { RepairTable } from '@/components/repair/repair-table'
import Link from 'next/link'
import { Plus } from 'lucide-react'

export default async function RepairPage() {
  // 1. Fetch from ServiceReport instead of the empty Repair table
  const serviceReports = await prisma.serviceReport.findMany({
    where: { type: 'REPAIR' },
    include: { steps: { orderBy: { order: 'asc' } } },
    orderBy: { date: 'desc' },
  })

  // 2. Map the data to match what RepairTable expects
  const repairs = serviceReports.map((r) => ({
    id: String(r.id),
    clientId: String(r.clientId),
    createdAt: r.date,
    updatedAt: r.date,
    date: r.date,
    shopName: r.shopName,
    address: r.address,
    concern: r.concern,
    issueDescription: r.concern ?? r.steps[0]?.text ?? '',
    technician: r.technicians,
    cost: null,
    technicians: r.technicians,
    contactName: r.contactName,
    status: 'completed',
    machineModel: null,
    serialNumber: null,
    priority: 'medium',
    notes: r.steps.map((s) => s.text).join('\n'),
    steps: r.steps,
    machineType: 'Not specified',
    scheduledDate: r.date,
    completedDate: r.date,
    estimatedCost: null,
    actualCost: null,
  }))

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Repairs</h1>
          <p className="text-gray-600 mt-1">Track and manage machine repairs</p>
        </div>
        <Link
          href="/repair/new"
          className="inline-flex w-full items-center justify-center rounded-xl bg-blue-600 px-4 py-3 font-medium text-white shadow-sm transition hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 sm:w-auto sm:py-2"
        >
          <Plus className="h-5 w-5 mr-2" />
          New Repair
        </Link>
      </div>

      <RepairTable repairs={repairs} />
    </div>
  )
}