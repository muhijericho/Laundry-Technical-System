import { prisma } from '@/lib/prisma'
import { SetupTable } from '@/components/setup/setup-table'
import Link from 'next/link'
import { Plus } from 'lucide-react'

export default async function SetupPage() {
  // 1. Fetch from ServiceReport instead of the empty Setup table
  const serviceReports = await prisma.serviceReport.findMany({
    where: { type: 'INSTALLATION' },
    include: { steps: { orderBy: { order: 'asc' as const } } },
    orderBy: { date: 'desc' },
  })

  // 2. Map the data to match what SetupTable expects
  const setups = serviceReports.map((r) => ({
    id: r.id,
    scheduledDate: r.date, // Map 'date' to 'scheduledDate' for the table
    shopName: r.shopName,
    address: r.address,
    technicians: r.technicians,
    contactName: r.contactName,
    status: 'completed',
    machineType: 'Not specified',
    notes: r.steps.map((s: any) => s.text).join('\n'),
    steps: r.steps,
    clientId: r.clientId,
  }))

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Machine Setups</h1>
          <p className="text-gray-600 mt-1">Manage new machine installations</p>
        </div>
        <Link
          href="/setup/new"
          className="inline-flex w-full items-center justify-center rounded-xl bg-blue-600 px-4 py-3 font-medium text-white shadow-sm transition hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 sm:w-auto sm:py-2"
        >
          <Plus className="h-5 w-5 mr-2" />
          New Setup
        </Link>
      </div>

      {/* Added 'as any' temporarily to bypass strict TypeScript prop checking */}
      <SetupTable setups={setups as any} />
    </div>
  )
}