import { PMSRecord } from '@prisma/client'
import { format, startOfWeek, addDays, isSameDay } from 'date-fns'

export function WeeklyCalendar({ records, currentDate }: { records: PMSRecord[], currentDate: Date }) {
  const start = startOfWeek(currentDate, { weekStartsOn: 1 }) // Monday
  const days = Array.from({ length: 7 }, (_, i) => addDays(start, i))

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Weekly Schedule</h2>
      <div className="grid grid-cols-7 gap-2">
        {days.map((day) => {
          const dayRecords = records.filter(r => isSameDay(new Date(r.scheduledDate), day))
          const isToday = isSameDay(day, new Date())
          
          return (
            <div key={day.toISOString()} className={`border rounded-lg p-2 min-h-[120px] ${isToday ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`}>
              <div className="text-xs font-medium text-gray-500 mb-2">
                {format(day, 'EEE')} <span className="text-gray-900">{format(day, 'd')}</span>
              </div>
              <div className="space-y-1">
                {dayRecords.map(r => (
                  <div key={r.id} className="text-xs bg-blue-100 text-blue-800 rounded px-1 py-0.5 truncate">
                    {r.machineType}
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}