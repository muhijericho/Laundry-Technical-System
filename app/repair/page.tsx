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
    id: r.id,
    date: r.date,
    shopName: r.shopName,
    address: r.address,
    concern: r.concern,
    issueDescription: r.concern ?? r.steps[0]?.text ?? '',
    technicians: r.technicians,
    contactName: r.contactName,
    status: 'completed',
    notes: r.steps.map((s) => s.text).join('\n'),
    steps: r.steps,
    clientId: r.clientId,
    machineType: 'Not specified',
    scheduledDate: r.date,
    completedDate: r.date,
    createdAt: r.date, // Fallback in case RepairTable sorts by this
  }))

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Repairs</h1>
          <p className="text-gray-600 mt-1">Track and manage machine repairs</p>
        </div>
        <Link
          href="/repair/new"
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <Plus className="h-5 w-5 mr-2" />
          New Repair
        </Link>
      </div>

      <RepairTable repairs={repairs} />
    </div>
  )
}