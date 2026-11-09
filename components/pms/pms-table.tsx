'use client'

import { fmtDate } from '@/lib/reports'

// Adjust this type based on what your table actually expects, 
// or keep it flexible with 'any' if the shape varies.
interface PMSRecord {
  id: number | string
  scheduledDate: Date | string
  shopName: string
  address: string | null
  concern: string | null
  technicians: string | null
  contactName: string | null
  status: string
  notes: string
  clientId: string | null
}

interface PMSTableProps {
  records: PMSRecord[]
}

export function PMSTable({ records }: PMSTableProps) {
  if (records.length === 0) {
    return (
      <div className="rounded-xl border bg-white p-8 text-center text-gray-500">
        No preventive maintenance records found.
      </div>
    )
  }

  return (
    <div className="overflow-x-auto rounded-xl border bg-white">
      <table className="w-full min-w-[800px] text-sm">
        <thead className="bg-gray-50 text-left text-xs uppercase text-gray-500">
          <tr>
            <th className="px-3 py-2">Date</th>
            {/* CHANGED: "Laundry Shop" to "Shop Name" */}
            <th className="px-3 py-2">Shop Name</th>
            <th className="px-3 py-2">Address</th>
            <th className="px-3 py-2">Technician</th>
            <th className="px-3 py-2">Status</th>
            <th className="px-3 py-2">Notes</th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {records.map((r) => (
            <tr key={r.id} className="align-top hover:bg-gray-50">
              <td className="whitespace-nowrap px-3 py-2 font-medium">
                {fmtDate(r.scheduledDate)}
              </td>
              <td className="px-3 py-2 font-medium">{r.shopName}</td>
              <td className="px-3 py-2 text-gray-600">{r.address || '—'}</td>
              <td className="px-3 py-2">{r.technicians || '—'}</td>
              <td className="px-3 py-2">
                <span className="inline-flex rounded-full bg-green-100 px-2 py-1 text-xs font-semibold text-green-700">
                  {r.status}
                </span>
              </td>
              <td className="px-3 py-2 max-w-xs truncate" title={r.notes}>
                {r.notes || '—'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}