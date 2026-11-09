'use client'
import { useRouter } from 'next/navigation'
import { Setup, Client } from '@prisma/client'

export function SetupForm({ setup, clients }: { setup?: Setup, clients: Client[] }) {
  const router = useRouter()

  async function handleSubmit(formData: FormData) {
    const data = {
      clientId: formData.get('clientId') as string,
      machineType: formData.get('machineType') as string,
      location: formData.get('location') as string,
      status: formData.get('status') as string,
      scheduledDate: new Date(formData.get('scheduledDate') as string),
      technician: formData.get('technician') as string,
    }
    const url = setup ? `/api/setup/${setup.id}` : '/setup'
    await fetch(url, { method: setup ? 'PUT' : 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) })
    router.push('/setup')
    router.refresh()
  }

  return (
    <form action={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Client *</label>
          <select name="clientId" required defaultValue={setup?.clientId} className="w-full px-3 py-2 border border-gray-300 rounded-lg">
            <option value="">Select Client</option>
            {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Machine Type *</label>
          <input type="text" name="machineType" required defaultValue={setup?.machineType} className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
          <input type="text" name="location" defaultValue={setup?.location || ''} className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Scheduled Date *</label>
          <input type="date" name="scheduledDate" required defaultValue={setup?.scheduledDate ? new Date(setup.scheduledDate).toISOString().split('T')[0] : ''} className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
        </div>
      </div>
      <div className="flex justify-end space-x-3">
        <button type="button" onClick={() => router.back()} className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">Cancel</button>
        <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">{setup ? 'Update' : 'Create'} Setup</button>
      </div>
    </form>
  )
}