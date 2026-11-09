import { prisma } from '@/lib/prisma'
import { StatsCard } from '@/components/dashboard/stats-card'
import { Users, Wrench, Settings, Calendar, ClipboardList } from 'lucide-react'
import Link from 'next/link'

export default async function DashboardPage() {
  // Fetch counts and recent data from the unified serviceReport table
  const [clientCount, totalVisits, repairCount, setupCount, pmsCount, recentReports] = await Promise.all([
    prisma.client.count(),
    prisma.serviceReport.count(),
    prisma.serviceReport.count({ where: { type: 'REPAIR' } }),
    prisma.serviceReport.count({ where: { type: 'INSTALLATION' } }),
    prisma.serviceReport.count({ where: { type: 'PMS' } }),
    prisma.serviceReport.findMany({
      take: 5, // Get the 5 most recent reports
      orderBy: { date: 'desc' },
      select: {
        id: true,
        date: true,
        shopName: true,
        type: true,
        technicians: true,
      }
    }),
  ])

  return (
    <div className="space-y-5 sm:space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1">Welcome to your laundry management system</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-5 xl:grid-cols-5">
        <StatsCard title="Total Clients" value={clientCount} icon={Users} />
        <StatsCard title="Total Visits" value={totalVisits} icon={ClipboardList} />
        <StatsCard title="Repairs" value={repairCount} icon={Wrench} />
        <StatsCard title="Setups" value={setupCount} icon={Settings} />
        <StatsCard title="PMS" value={pmsCount} icon={Calendar} />
      </div>

      {/* Recent Activity Table */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-col gap-2 border-b border-slate-200 bg-slate-50 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <h2 className="text-lg font-semibold text-gray-900">Recent Reports</h2>
          <Link href="/reports" className="text-sm text-blue-600 hover:text-blue-800 font-medium">
            View all reports →
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-[680px] divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Shop Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Technician</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {recentReports.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-sm text-gray-500">
                    No reports found. Create your first report to see it here.
                  </td>
                </tr>
              ) : (
                recentReports.map((report) => (
                  <tr key={report.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(report.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {report.shopName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className={`px-2.5 py-0.5 text-xs font-semibold rounded-full ${
                        report.type === 'REPAIR' ? 'bg-orange-100 text-orange-800' :
                        report.type === 'INSTALLATION' ? 'bg-green-100 text-green-800' :
                        report.type === 'PMS' ? 'bg-blue-100 text-blue-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {report.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {report.technicians || 'Unassigned'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}