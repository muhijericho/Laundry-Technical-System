import { prisma } from '@/lib/prisma'
import { ClientTable } from '@/components/clients/client-table'
import { ClientFilters } from '@/components/clients/client-filters'
import { ImportClients } from '@/components/clients/import-clients'
import Link from 'next/link'
import { Plus } from 'lucide-react'
import { Suspense } from 'react'

type ClientsPageProps = {
  searchParams: { search?: string; pmsStatus?: string }
}

export default async function ClientsPage({ searchParams }: ClientsPageProps) {
  const search = searchParams.search || ''
  const pmsStatus = searchParams.pmsStatus || ''
  const [databaseClients, serviceReports] = await Promise.all([
    prisma.client.findMany({
      select: { id: true, name: true, address: true, city: true, contactPerson: true, pmsStatus: true },
      orderBy: { name: 'asc' },
    }),
    prisma.serviceReport.findMany({
      select: { id: true, shopName: true, address: true, type: true, date: true },
      orderBy: { date: 'desc' },
    }),
  ])

  // Some existing database entries are stored as service reports, not Client rows.
  const clientsByName = new Map<string, {
    id: string
    name: string
    address: string | null
    city?: string | null
    contactPerson?: string | null
    pmsStatus: string | null
    hasClientRecord: boolean
  }>()

  for (const client of databaseClients) {
    clientsByName.set(client.name.trim().toLowerCase(), { ...client, hasClientRecord: true })
  }

  for (const report of serviceReports) {
    const name = report.shopName.trim()
    if (!name) continue
    const key = name.toLowerCase()
    const existing = clientsByName.get(key)
    if (existing) {
      if (!existing.address && report.address) existing.address = report.address
      if (report.type === 'PMS' && (!existing.hasClientRecord || !existing.pmsStatus)) {
        existing.pmsStatus = 'done'
      }
      continue
    }
    clientsByName.set(key, {
      id: `report-${report.id}`,
      name,
      address: report.address,
      pmsStatus: report.type === 'PMS' ? 'done' : 'pending',
      hasClientRecord: false,
    })
  }

  const allClients = Array.from(clientsByName.values())
  const filteredClients = allClients.filter((client) => {
    const matchesSearch = !search || [client.name, client.address, client.city, client.contactPerson]
      .some((value) => value?.toLowerCase().includes(search.toLowerCase()))
    const matchesPmsStatus = !pmsStatus || client.pmsStatus === pmsStatus
    return matchesSearch && matchesPmsStatus
  }).sort((a, b) => a.name.localeCompare(b.name))
  const totalCount = filteredClients.length

  return (
    <div className="space-y-6">
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

      <Suspense fallback={<div className="h-10 bg-gray-100 rounded-lg animate-pulse" />}>
        <ClientFilters />
      </Suspense>

      <ClientTable clients={filteredClients} />
    </div>
  )
}
