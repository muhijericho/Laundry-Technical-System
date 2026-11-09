import { prisma } from '@/lib/prisma'
import { PMSForm } from '@/components/pms/pms-form'

export default async function NewPMSPage() {
  const clients = await prisma.client.findMany({ orderBy: { name: 'asc' } })
  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Schedule PMS</h1>
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <PMSForm clients={clients} />
      </div>
    </div>
  )
}