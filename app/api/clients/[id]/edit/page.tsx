import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import { ClientForm } from '@/components/clients/client-form'

export default async function EditClientPage({ params }: { params: { id: string } }) {
  const client = await prisma.client.findUnique({
    where: { id: params.id }
  })

  if (!client) notFound()

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Edit Client</h1>
        <p className="text-gray-600 mt-1">Update client information</p>
      </div>
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <ClientForm client={client} />
      </div>
    </div>
  )
}