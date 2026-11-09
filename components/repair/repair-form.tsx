'use client'
import { useRouter } from 'next/navigation'
import { Repair, Client } from '@prisma/client'

export function RepairForm({ repair, clients }: { repair?: Repair, clients: Client[] }) {
  const router = useRouter()

  async function handleSubmit(formData: FormData) {
    const data = {
      clientId: formData.get('clientId') as string,
      machineType: formData.get('machineType') as string,
      machineModel: formData.get('machineModel') as string,
      issueDescription: formData.get('issueDescription') as string,
      status: formData.get('status') as string,
      priority: formData.get('priority') as string,
      scheduledDate: formData.get('scheduledDate') ? new Date(formData.get('scheduledDate') as string) : null,
      technician: formData.get('technician') as string,
      notes: formData.get('notes') as string,
    }

    const url = repair ? `/api/repair/${repair.id}` : '/repair'
    await fetch(url, { method: repair ? 'PUT' : 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) })
    router.push('/repair')
    router.refresh()
  }

  return (
    <form action={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Client *</label>
          <select name="clientId" required defaultValue={repair?.clientId} className="w-full px-3 py-2 border border-gray-300 rounded-lg">
            <option value="">Select Client</option>
            {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Machine Type *</label>
          <input type="text" name="machineType" required defaultValue={repair?.machineType} className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
          <select name="status" defaultValue={repair?.status || 'pending'} className="w-full px-3 py-2 border border-gray-300 rounded-lg">
            <option value="pending">Pending</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
          <select name="priority" defaultValue={repair?.priority || 'normal'} className="w-full px-3 py-2 border border-gray-300 rounded-lg">
            <option value="low">Low</option>
            <option value="normal">Normal</option>
            <option value="high">High</option>
            <option value="urgent">Urgent</option>
          </select>
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Issue Description *</label>
        <textarea name="issueDescription" required rows={3} defaultValue={repair?.issueDescription} className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
      </div>
      <div className="flex justify-end space-x-3">
        <button type="button" onClick={() => router.back()} className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">Cancel</button>
        <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">{repair ? 'Update' : 'Create'} Repair</button>
      </div>
    </form>
  )
}