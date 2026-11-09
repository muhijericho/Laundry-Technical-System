import { prisma } from '@/lib/prisma'
import { PMSTable } from '@/components/pms/pms-table'
import Link from 'next/link'
import { Plus } from 'lucide-react'

export default async function PMSPage() {
  // 1. Fetch from ServiceReport, ordering by 'date' (not scheduledDate)
  const serviceReports = await prisma.serviceReport.findMany({
    where: { type: 'PMS' },
    include: { steps: { orderBy: { order: 'asc' } } },
    orderBy: { date: 'desc' }, 
  })

  // Office entries were incorrectly classified as PMS; hide them here without deleting the reports.
  const pmsReports = serviceReports.filter((report) => report.shopName.trim().toLowerCase() !== 'office')

  // Map the data to match what PMSTable expects
  const records = pmsReports.map((r) => ({
    id: r.id,
    scheduledDate: r.date, // Map the 'date' field to 'scheduledDate' for the table
    shopName: r.shopName,
    address: r.address,
    concern: r.concern,
    technicians: r.technicians,
    contactName: r.contactName,
    status: 'completed',
    notes: r.steps.map((s: any) => s.text).join('\n'),
    clientId: r.clientId,
  }))

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Preventive Maintenance</h1>
          <p className="text-gray-600 mt-1">Schedule and track maintenance</p>
        </div>
        <Link
          href="/pms/new"
          className="inline-flex w-full items-center justify-center rounded-xl bg-blue-600 px-4 py-3 font-medium text-white shadow-sm transition hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 sm:w-auto sm:py-2"
        >
          <Plus className="h-5 w-5 mr-2" />
          Schedule PMS
        </Link>
      </div>

      {/* Added 'as any' temporarily to bypass strict TypeScript prop checking until we update the component types */}
      <PMSTable records={records as any} />
    </div>
  )
}