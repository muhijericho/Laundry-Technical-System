import { prisma } from '@/lib/prisma'
import { SetupTable } from '@/components/setup/setup-table'
import Link from 'next/link'
import { Plus } from 'lucide-react'

export default async function SetupPage() {
  const setups = await prisma.setup.findMany({ 
    orderBy: { scheduledDate: 'desc' } 
  })

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Machine Setups</h1>
          <p className="text-gray-600 mt-1">Manage new machine installations</p>
        </div>
        <Link
          href="/setup/new"
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <Plus className="h-5 w-5 mr-2" />
          New Setup
        </Link>
      </div>

      <SetupTable setups={setups} />
    </div>
  )
}