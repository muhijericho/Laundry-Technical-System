import { prisma } from '@/lib/prisma'
import { ClientTable } from '@/components/clients/client-table'
import { ClientFilters } from '@/components/clients/client-filters'
import { ImportClients } from '@/components/clients/import-clients'
import Link from 'next/link'
import { Plus } from 'lucide-react'
import { Suspense } from 'react'

export default async function ClientsPage({
  searchParams,
}: {
  searchParams: { search?: string; pmsStatus?: string }
}) {
  const search = searchParams.search || ''
  const pmsStatus = searchParams.pmsStatus || ''

  // Build dynamic Prisma where clause
  const where: any = {}
  
  if (search) {
    where.OR = [
      { name: { contains: search } }, // Removed mode: 'insensitive'
      { city: { contains: search } }, // Removed mode: 'insensitive'
      { contactPerson: { contains: search } }, // Removed mode: 'insensitive'
    ]
  }
  
  if (pmsStatus) {
    where.pmsStatus = pmsStatus
  }

  // Fetch filtered clients and total count
  const [clients, totalCount] = await Promise.all([
    prisma.client.findMany({
      where,
      orderBy: { name: 'asc' }
    }),
    prisma.client.count({ where })
  ])

  return (
    <div className="space-y-6">
      {/* Header with Count and Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Clients</h1>
          <p className="text-gray-600 mt-1">
            Showing <span className="font-semibold text-gray-900">{totalCount}</span> client{totalCount !== 1 ? 's' : ''}
          </p>
        </div>
        <div className="flex gap-3">
          <ImportClients />
          <Link
            href="/clients/new"
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="h-5 w-5 mr-2" />
            New Client
          </Link>
        </div>
      </div>

      {/* Filters */}
      <Suspense fallback={<div className="h-10 bg-gray-100 rounded-lg animate-pulse" />}>
        <ClientFilters />
      </Suspense>

      {/* Table */}
      <ClientTable clients={clients} />
    </div>
  )
}