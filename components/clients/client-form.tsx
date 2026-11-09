'use client'

import { useRouter } from 'next/navigation'
import { Client } from '@prisma/client'

interface ClientFormProps {
  client?: Client
}

export function ClientForm({ client }: ClientFormProps) {
  const router = useRouter()

  async function handleSubmit(formData: FormData) {
    const data = {
      name: formData.get('name') as string,
      city: formData.get('city') as string,
      address: formData.get('address') as string,
      contactPerson: formData.get('contactPerson') as string,
      contactNumber: formData.get('contactNumber') as string,
    }

    // Note: Changed '/clients' to '/api/clients' for the POST request to match standard API routes
    const url = client ? `/api/clients/${client.id}` : '/api/clients' 
    const method = client ? 'PUT' : 'POST'

    await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })

    router.push('/clients')
    router.refresh()
  }

  return (
    <form action={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Shop Name *
        </label>
        <input
          type="text"
          name="name"
          required
          defaultValue={client?.name}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          City
        </label>
        <input
          type="text"
          name="city"
          defaultValue={client?.city || ''}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Address
        </label>
        <textarea
          name="address"
          rows={3}
          defaultValue={client?.address || ''}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Contact Person
        </label>
        <input
          type="text"
          name="contactPerson"
          defaultValue={client?.contactPerson || ''}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Contact Number
        </label>
        <input
          type="tel"
          name="contactNumber"
          defaultValue={client?.contactNumber || ''}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={() => router.back()}
          className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          {client ? 'Update' : 'Create'} Client
        </button>
      </div>
    </form>
  )
}