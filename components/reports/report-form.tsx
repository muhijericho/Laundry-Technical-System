'use client'

import { useState } from 'react'
import { REPORT_TYPES, toDateInput, type ReportDTO } from '@/lib/reports'

type Props = {
  report?: ReportDTO | null
  techSuggestions: string[]
  onClose: () => void
  onSaved: () => void
}

const input = 'w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500'
const label = 'mb-1 block text-xs font-medium text-gray-600'

export function ReportForm({ report, techSuggestions, onClose, onSaved }: Props) {
  const [date, setDate] = useState(report ? toDateInput(report.date) : new Date().toISOString().slice(0, 10))
  const [shopName, setShopName] = useState(report?.shopName ?? '')
  const [address, setAddress] = useState(report?.address ?? '')
  const [concern, setConcern] = useState(report?.concern ?? '')
  const [type, setType] = useState(report?.type ?? 'REPAIR')
  const [technicians, setTechnicians] = useState(report?.technicians ?? '')
  const [contactName, setContactName] = useState(report?.contactName ?? '')
  const [steps, setSteps] = useState<string[]>(report?.steps.map((s) => s.text) ?? [''])
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const setStep = (i: number, v: string) => setSteps((s) => s.map((x, idx) => (idx === i ? v : x)))

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setError('')
    const res = await fetch(report ? `/api/reports/${report.id}` : '/api/reports', {
      method: report ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ date, shopName, address, concern, type, technicians, contactName, steps }),
    })
    setSaving(false)
    if (!res.ok) {
      setError((await res.json().catch(() => null))?.error ?? 'Something went wrong')
      return
    }
    onSaved()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/40 p-4">
      <form onSubmit={submit} className="my-8 w-full max-w-2xl rounded-lg bg-white p-6 shadow-xl">
        <h2 className="mb-4 text-lg font-semibold">{report ? 'Edit report' : 'New service report'}</h2>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className={label}>Date</label>
            <input type="date" className={input} value={date} onChange={(e) => setDate(e.target.value)} required />
          </div>
          <div>
            <label className={label}>Type</label>
            <select className={input} value={type} onChange={(e) => setType(e.target.value)}>
              {REPORT_TYPES.map((t) => (
                <option key={t.value} value={t.value}>{t.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className={label}>Laundry Shop</label>
            <input className={input} value={shopName} onChange={(e) => setShopName(e.target.value)} required />
          </div>
          <div>
            <label className={label}>Address</label>
            <input className={input} value={address} onChange={(e) => setAddress(e.target.value)} />
          </div>
          <div className="sm:col-span-2">
            <label className={label}>Concern</label>
            <input className={input} placeholder="e.g. Dryer 3 is not heating" value={concern} onChange={(e) => setConcern(e.target.value)} />
          </div>
        </div>

        <div className="mt-4">
          <label className={label}>Report (one line per step)</label>
          <div className="space-y-2">
            {steps.map((s, i) => (
              <div key={i} className="flex gap-2">
                <span className="w-5 pt-2 text-right text-xs text-gray-400">{i + 1}.</span>
                <input className={input} value={s} placeholder={i === 0 ? 'e.g. Checking the dryer' : ''} onChange={(e) => setStep(i, e.target.value)} />
                <button
                  type="button"
                  disabled={steps.length === 1}
                  onClick={() => setSteps((x) => x.filter((_, idx) => idx !== i))}
                  className="px-2 text-gray-400 hover:text-red-600 disabled:opacity-30"
                  aria-label="Remove line"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
          <button type="button" onClick={() => setSteps((x) => [...x, ''])} className="mt-2 text-sm font-medium text-blue-600 hover:underline">
            + Add line
          </button>
        </div>

        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className={label}>Technician(s)</label>
            <input className={input} list="tech-suggestions" placeholder="Jd, Jericho" value={technicians} onChange={(e) => setTechnicians(e.target.value)} />
            <datalist id="tech-suggestions">
              {techSuggestions.map((t) => <option key={t} value={t} />)}
            </datalist>
          </div>
          <div>
            <label className={label}>Owner / Staff name (signed)</label>
            <input className={input} value={contactName} onChange={(e) => setContactName(e.target.value)} />
          </div>
        </div>

        {error && <p className="mt-3 text-sm text-red-600">{error}</p>}

        <div className="mt-6 flex justify-end gap-2">
          <button type="button" onClick={onClose} className="rounded-md border px-4 py-2 text-sm hover:bg-gray-50">Cancel</button>
          <button type="submit" disabled={saving} className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50">
            {saving ? 'Saving…' : 'Save report'}
          </button>
        </div>
      </form>
    </div>
  )
}