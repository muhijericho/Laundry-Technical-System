'use client'

import { useState } from 'react'
import type { ReactNode } from 'react'
import { Header } from '@/components/layout/header'
import { Sidebar } from '@/components/layout/sidebar'

export function AppShell({ children }: { children: ReactNode }) {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <div className="flex h-dvh w-full overflow-hidden bg-slate-50">
      <Sidebar mobileOpen={menuOpen} onClose={() => setMenuOpen(false)} />
      {menuOpen && (
        <button
          type="button"
          aria-label="Close navigation menu"
          className="fixed inset-0 z-40 bg-slate-950/40 backdrop-blur-[1px] lg:hidden"
          onClick={() => setMenuOpen(false)}
        />
      )}
      <div className="flex h-dvh min-w-0 flex-1 flex-col">
        <Header menuOpen={menuOpen} onMenuClick={() => setMenuOpen((open) => !open)} />
        <main className="min-w-0 flex-1 overflow-x-hidden overflow-y-auto px-4 py-5 sm:px-6 sm:py-7 xl:px-10">
          <div className="mx-auto w-full max-w-[1680px]">{children}</div>
        </main>
      </div>
    </div>
  )
}
