import Link from 'next/link'
import { formatDate, getStatusColor } from '@/lib/utils'
import { Eye } from 'lucide-react'

// Define the shape of the mapped data coming from the API or Page
interface SetupRecord {
  id: number | string
  scheduledDate: Date | string
  shopName: string
  address: string | null
  technicians: string | null
  status: string
  machineType: string
}

export function SetupTable({ setups }: { setups: SetupRecord[] }) {
  if (!setups || setups.length === 0) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-8 text-center text-gray-500">
        No machine setups found.
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {/* CHANGED: "Machine" to "Shop Name" */}
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Shop Name</th>
            {/* CHANGED: "Location" to "Address" */}
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Address</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Technician</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {setups.map((setup) => (
            <tr key={setup.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {setup.shopName}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                {setup.address || '-'}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                {setup.technicians || '-'}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(setup.status)}`}>
                  {setup.status}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                {formatDate(setup.scheduledDate)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <Link href={`/setup/${setup.id}`} className="text-blue-600 hover:text-blue-900">
                  <Eye className="h-4 w-4 inline" />
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}