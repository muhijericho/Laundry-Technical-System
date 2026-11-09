import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Edit, ArrowLeft } from 'lucide-react'
import { formatDate } from '@/lib/utils'

export default async function ClientDetailPage({ params }: { params: { id: string } }) {
  const client = await prisma.client.findUnique({
    where: { id: params.id },
    include: {
      repairs: { orderBy: { createdAt: 'desc' }, take: 5 },
      setups: { orderBy: { createdAt: 'desc' }, take: 5 },
      pmsRecords: { orderBy: { createdAt: 'desc' }, take: 5 },
    }
  })

  if (!client) notFound()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link href="/clients" className="text-gray-600 hover:text-gray-900">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{client.name}</h1>
            <p className="text-gray-600 mt-1">Client since {formatDate(client.createdAt)}</p>
          </div>
        </div>
        <Link
          href={`/clients/${client.id}/edit`}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <Edit className="h-5 w-5 mr-2" />
          Edit
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h2>
          <div className="space-y-3">
            <div>
              <p className="text-sm text-gray-600">Email</p>
              <p className="text-gray-900">{client.email || 'Not provided'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Phone</p>
              <p className="text-gray-900">{client.phone || 'Not provided'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Address</p>
              <p className="text-gray-900">{client.address || 'Not provided'}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Notes</h2>
          <p className="text-gray-900">{client.notes || 'No notes'}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Repairs</h2>
          {client.repairs.length === 0 ? (
            <p className="text-gray-600">No repairs</p>
          ) : (
            <div className="space-y-3">
              {client.repairs.map(repair => (
                <div key={repair.id} className="border-l-2 border-blue-500 pl-3">
                  <p className="text-sm font-medium text-gray-900">{repair.machineType}</p>
                  <p className="text-xs text-gray-600">{repair.status}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Setups</h2>
          {client.setups.length === 0 ? (
            <p className="text-gray-600">No setups</p>
          ) : (
            <div className="space-y-3">
              {client.setups.map(setup => (
                <div key={setup.id} className="border-l-2 border-green-500 pl-3">
                  <p className="text-sm font-medium text-gray-900">{setup.machineType}</p>
                  <p className="text-xs text-gray-600">{setup.status}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent PMS</h2>
          {client.pmsRecords.length === 0 ? (
            <p className="text-gray-600">No PMS records</p>
          ) : (
            <div className="space-y-3">
              {client.pmsRecords.map(pms => (
                <div key={pms.id} className="border-l-2 border-purple-500 pl-3">
                  <p className="text-sm font-medium text-gray-900">{pms.machineType}</p>
                  <p className="text-xs text-gray-600">{pms.status}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}