import { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

interface StatsCardProps {
  title: string
  value: string | number
  icon: LucideIcon
  trend?: string
  trendUp?: boolean
}

export function StatsCard({ title, value, icon: Icon, trend, trendUp }: StatsCardProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-md sm:p-5 lg:p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
          {trend && (
            <p className={cn(
              'text-sm mt-2',
              trendUp ? 'text-green-600' : 'text-red-600'
            )}>
              {trend}
            </p>
          )}
        </div>
        <div className="rounded-xl bg-blue-50 p-2.5 sm:p-3">
          <Icon className="h-5 w-5 text-blue-600 sm:h-6 sm:w-6" />
        </div>
      </div>
    </div>
  )
}