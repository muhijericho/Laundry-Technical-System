import { ClientForm } from '@/components/clients/client-form'

export default function NewClientPage() {
  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">New Client</h1>
        <p className="text-gray-600 mt-1">Add a new client to the system</p>
      </div>
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <ClientForm />
      </div>
    </div>
  )
}