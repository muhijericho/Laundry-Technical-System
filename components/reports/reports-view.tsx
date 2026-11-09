'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { REPORT_TYPES, fmtDate, type ReportDTO } from '@/lib/reports'
import { ClipboardList, Wrench, CalendarCheck, Settings, Download, Plus, Upload } from 'lucide-react'
import { ReportForm } from './report-form'

const badge: Record<string, string> = {
  REPAIR: 'bg-orange-100 text-orange-700',
  PMS: 'bg-blue-100 text-blue-700',
  INSTALLATION: 'bg-green-100 text-green-700',
  TRAINING: 'bg-purple-100 text-purple-700',
  LMS: 'bg-cyan-100 text-cyan-700',
  OFFICE: 'bg-gray-100 text-gray-700',
}

export function ReportsView() {
  const [reports, setReports] = useState<ReportDTO[]>([])
  const [loading, setLoading] = useState(true)
  const [from, setFrom] = useState('')
  const [to, setTo] = useState('')
  const [type, setType] = useState('ALL')
  const [q, setQ] = useState('')
  const [editing, setEditing] = useState<ReportDTO | null>(null)
  const [showForm, setShowForm] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)
  const [importing, setImporting] = useState(false)

  const query = useMemo(() => {
    const p = new URLSearchParams()
    if (from) p.set('from', from)
    if (to) p.set('to', to)
    if (type !== 'ALL') p.set('type', type)
    if (q.trim()) p.set('q', q.trim())
    return p.toString()
  }, [from, to, type, q])

  const load = useCallback(async () => {
    setLoading(true)
    const res = await fetch(`/api/reports?${query}`)
    setReports(res.ok ? await res.json() : [])
    setLoading(false)
  }, [query])

  useEffect(() => {
    const t = setTimeout(load, 250)
    return () => clearTimeout(t)
  }, [load])

  const techSuggestions = useMemo(
    () => [...new Set(reports.map((r) => r.technicians).filter(Boolean) as string[])],
    [reports]
  )

  async function remove(r: ReportDTO) {
    if (!confirm(`Delete the report for "${r.shopName}" on ${fmtDate(r.date)}?`)) return
    await fetch(`/api/reports/${r.id}`, { method: 'DELETE' })
    load()
  }

  async function onImport(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setImporting(true)
    const fd = new FormData()
    fd.append('file', file)
    const res = await fetch('/api/reports/import', { method: 'POST', body: fd })
    const data = await res.json().catch(() => null)
    setImporting(false)
    e.target.value = ''
    if (!res.ok) {
      alert(data?.error ?? 'Import failed')
      return
    }
    alert(`Imported ${data.imported} visits (${data.linked} linked to clients). Skipped ${data.skipped} already in the system.`)
    load()
  }

  const totals = useMemo(
    () => ({
      visits: reports.length,
      pms: reports.filter((r) => r.type === 'PMS').length,
      repairs: reports.filter((r) => r.type === 'REPAIR').length,
      installs: reports.filter((r) => r.type === 'INSTALLATION').length,
    }),
    [reports]
  )

  const field = 'rounded-md border border-gray-300 px-3 py-2 text-sm'
  const outlineBtn =
    'inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium hover:bg-gray-50 disabled:opacity-50'

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Reports</h1>
          <p className="mt-1 text-gray-600">Daily technician visit reports — export to Excel anytime</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <input ref={fileRef} type="file" accept=".xlsx" className="hidden" onChange={onImport} />
          <button onClick={() => fileRef.current?.click()} disabled={importing} className={outlineBtn}>
            <Upload className="h-4 w-4" /> {importing ? 'Importing…' : 'Import Excel'}
          </button>
          <a href={`/api/reports/export?${query}`} className={outlineBtn}>
            <Download className="h-4 w-4" /> Export Excel
          </a>
          <button
            onClick={() => { setEditing(null); setShowForm(true) }}
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            <Plus className="h-4 w-4" /> New report
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: 'Total Visits', value: totals.visits, Icon: ClipboardList },
          { label: 'PMS Done', value: totals.pms, Icon: CalendarCheck },
          { label: 'Repairs', value: totals.repairs, Icon: Wrench },
          { label: 'Installations', value: totals.installs, Icon: Settings },
        ].map(({ label, value, Icon }) => (
          <div key={label} className="flex items-center justify-between rounded-xl border bg-white p-6">
            <div>
              <div className="text-sm text-gray-700">{label}</div>
              <div className="mt-1 text-3xl font-bold">{value}</div>
            </div>
            <div className="rounded-lg bg-blue-50 p-3 text-blue-600">
              <Icon className="h-6 w-6" />
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap gap-2">
        <input type="date" className={field} value={from} onChange={(e) => setFrom(e.target.value)} aria-label="From" />
        <input type="date" className={field} value={to} onChange={(e) => setTo(e.target.value)} aria-label="To" />
        <select className={field} value={type} onChange={(e) => setType(e.target.value)}>
          <option value="ALL">All types</option>
          {REPORT_TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
        </select>
        <input
          className={`${field} min-w-[220px] flex-1`}
          placeholder="Search shop, address, concern, technician…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
      </div>

      <div className="overflow-x-auto rounded-xl border bg-white">
        <table className="w-full min-w-[960px] text-sm">
          <thead className="bg-gray-50 text-left text-xs uppercase text-gray-500">
            <tr>
              <th className="px-3 py-2">Date</th>
              <th className="px-3 py-2">Laundry Shop</th>
              <th className="px-3 py-2">Address</th>
              <th className="px-3 py-2">Concern</th>
              <th className="px-3 py-2">Report</th>
              <th className="px-3 py-2">Technician</th>
              <th className="px-3 py-2">Owner/Staff</th>
              <th className="px-3 py-2" />
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr><td colSpan={8} className="px-3 py-8 text-center text-gray-400">Loading…</td></tr>
            )}
            {!loading && reports.length === 0 && (
              <tr><td colSpan={8} className="px-3 py-8 text-center text-gray-400">No reports found.</td></tr>
            )}
            {!loading &&
              reports.map((r, i) => {
                const newDay = i === 0 || fmtDate(reports[i - 1].date) !== fmtDate(r.date)
                return (
                  <tr key={r.id} className={`align-top ${newDay ? 'border-t-2 border-gray-200' : 'border-t'}`}>
                    <td className="whitespace-nowrap px-3 py-2 font-medium">{newDay ? fmtDate(r.date) : ''}</td>
                    <td className="px-3 py-2">
                      <div className="font-medium">{r.shopName}</div>
                      <div className="mt-1 flex items-center gap-1.5">
                        <span className={`inline-block rounded px-1.5 py-0.5 text-[10px] font-medium ${badge[r.type] ?? badge.OFFICE}`}>
                          {REPORT_TYPES.find((t) => t.value === r.type)?.label ?? r.type}
                        </span>
                        {r.clientId && <span className="text-[10px] text-green-600">✓ linked</span>}
                      </div>
                    </td>
                    <td className="px-3 py-2">{r.address}</td>
                    <td className="px-3 py-2">{r.concern}</td>
                    <td className="px-3 py-2">
                      <ol className="list-decimal space-y-0.5 pl-4">
                        {r.steps.map((s) => <li key={s.id}>{s.text}</li>)}
                      </ol>
                    </td>
                    <td className="px-3 py-2">{r.technicians}</td>
                    <td className="px-3 py-2">{r.contactName}</td>
                    <td className="whitespace-nowrap px-3 py-2 text-right">
                      <button onClick={() => { setEditing(r); setShowForm(true) }} className="mr-2 text-blue-600 hover:underline">Edit</button>
                      <button onClick={() => remove(r)} className="text-red-600 hover:underline">Delete</button>
                    </td>
                  </tr>
                )
              })}
          </tbody>
        </table>
      </div>

      {showForm && (
        <ReportForm
          report={editing}
          techSuggestions={techSuggestions}
          onClose={() => setShowForm(false)}
          onSaved={() => { setShowForm(false); load() }}
        />
      )}
    </div>
  )
}