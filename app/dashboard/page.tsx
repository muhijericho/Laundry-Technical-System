import { prisma } from '@/lib/prisma'
import { StatsCard } from '@/components/dashboard/stats-card'
import { Users, Wrench, Settings, Calendar } from 'lucide-react'

export default async function DashboardPage() {
  // Fetch counts from the database
  const [clientCount, repairCount, setupCount, pmsCount] = await Promise.all([
    prisma.client.count(),
    prisma.repair.count({ where: { status: { in: ['pending', 'in_progress'] } } }),
    prisma.setup.count({ where: { status: { in: ['scheduled', 'in_progress'] } } }),
    prisma.pMSRecord.count({ where: { status: 'scheduled' } }),
  ])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1">Welcome to your laundry management system</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard title="Total Clients" value={clientCount} icon={Users} />
        <StatsCard title="Active Repairs" value={repairCount} icon={Wrench} />
        <StatsCard title="Pending Setups" value={setupCount} icon={Settings} />
        <StatsCard title="Scheduled PMS" value={pmsCount} icon={Calendar} />
      </div>
    </div>
  )
}