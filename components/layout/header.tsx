'use client'

import { Bell, Menu, User } from 'lucide-react'

export function Header({ onMenuClick, menuOpen }: { onMenuClick: () => void; menuOpen: boolean }) {
  return (
    <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center justify-between border-b border-slate-200 bg-white/95 px-3 shadow-sm backdrop-blur sm:px-5 lg:px-8">
      <div className="flex min-w-0 items-center gap-3">
        <button
          type="button"
          aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
          aria-expanded={menuOpen}
          onClick={onMenuClick}
          className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-slate-600 transition hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 lg:hidden"
        >
          <Menu className="h-5 w-5" />
        </button>
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-slate-900 sm:text-base">Laundry Management</p>
          <p className="hidden text-xs text-slate-500 sm:block">Operations workspace</p>
        </div>
      </div>

      <div className="flex items-center gap-1 sm:gap-2">
        <button aria-label="Notifications" className="rounded-xl p-2.5 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900">
          <Bell className="h-5 w-5" />
        </button>
        <button aria-label="User profile" className="rounded-xl bg-blue-50 p-2.5 text-blue-700 transition hover:bg-blue-100">
          <User className="h-5 w-5" />
        </button>
      </div>
    </header>
  )
}