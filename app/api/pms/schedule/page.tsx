import { prisma } from '@/lib/prisma'
import { WeeklyCalendar } from '@/components/pms/weekly-calendar'

export default async function PMSSchedulePage() {
  const records = await prisma.pMSRecord.findMany({
    where: { scheduledDate: { gte: new Date() } },
    orderBy: { scheduledDate: 'asc' }
  })

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">PMS Calendar</h1>
      <WeeklyCalendar records={records} currentDate={new Date()} />
    </div>
  )
}