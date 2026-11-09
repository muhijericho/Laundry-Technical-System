import { cn } from '@/lib/utils'
import Link from 'next/link'

type ClientTableRow = {
  id: string
  name: string
  address: string | null
  pmsStatus: string | null
}

interface ClientTableProps {
  clients: ClientTableRow[]
}

export function ClientTable({ clients }: ClientTableProps) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Laundry Name
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Address
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              PMS Status
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {clients.map((client) => (
            <tr key={client.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-gray-900">{client.name}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-600">{client.address || '-'}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={cn(
                  'px-2 inline-flex text-xs leading-5 font-semibold rounded-full',
                  client.pmsStatus === 'done' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-yellow-100 text-yellow-800'
                )}>
                  {client.pmsStatus === 'done' ? 'Done' : 'Pending'}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      
      {clients.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No clients found matching your filters.</p>
          {/* Replaced onClick button with a Next.js Link */}
          <Link 
            href="/clients"
            className="mt-2 inline-block text-blue-600 hover:text-blue-800 text-sm font-medium"
          >
            Clear all filters
          </Link>
        </div>
      )}
    </div>
  )
}