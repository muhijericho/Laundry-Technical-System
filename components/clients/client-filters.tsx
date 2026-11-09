'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { Search } from 'lucide-react'

export function ClientFilters() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const handleFilterChange = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (value) {
      params.set(key, value)
    } else {
      params.delete(key)
    }
    // Navigate to the new URL with updated filters
    router.push(`/clients?${params.toString()}`)
  }

  return (
    <div className="flex flex-col sm:flex-row gap-4">
      {/* Search by City or Name */}
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
        <input
          type="text"
          placeholder="Search by city, province, or name..."
          defaultValue={searchParams.get('search') || ''}
          onChange={(e) => handleFilterChange('search', e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>
      
      {/* PMS Status Dropdown */}
      <select
        defaultValue={searchParams.get('pmsStatus') || ''}
        onChange={(e) => handleFilterChange('pmsStatus', e.target.value)}
        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white min-w-[180px]"
      >
        <option value="">All PMS Status</option>
        <option value="done">Done</option>
        <option value="pending">Pending</option>
      </select>
    </div>
  )
}