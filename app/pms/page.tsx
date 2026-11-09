import { prisma } from '@/lib/prisma'
import { PMSTable } from '@/components/pms/pms-table'
import Link from 'next/link'
import { Plus } from 'lucide-react'

export default async function PMSPage() {
  const records = await prisma.pMSRecord.findMany({ 
    orderBy: { scheduledDate: 'desc' } 
  })

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Preventive Maintenance</h1>
          <p className="text-gray-600 mt-1">Schedule and track maintenance</p>
        </div>
        <Link
          href="/pms/new"
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <Plus className="h-5 w-5 mr-2" />
          Schedule PMS
        </Link>
      </div>

      <PMSTable records={records} />
    </div>
  )
}