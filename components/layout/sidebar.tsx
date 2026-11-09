'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  Wrench,
  Settings,
  Users,
  Calendar,
  FileText,
  Droplets,
} from 'lucide-react'
import { cn } from '@/lib/utils'

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Clients', href: '/clients', icon: Users },
  { name: 'Repairs', href: '/repair', icon: Wrench },
  { name: 'Setups', href: '/setup', icon: Settings },
  { name: 'PMS Schedule', href: '/pms', icon: Calendar },
  { name: 'Reports', href: '/reports', icon: FileText },
]

export function Sidebar({ mobileOpen, onClose }: { mobileOpen: boolean; onClose: () => void }) {
  const pathname = usePathname()

  return (
    <aside className={cn(
      'fixed inset-y-0 left-0 z-50 flex w-[min(18rem,85vw)] flex-col border-r border-slate-200 bg-white shadow-2xl transition-transform duration-200 ease-out lg:static lg:z-auto lg:h-dvh lg:w-64 lg:shrink-0 lg:translate-x-0 lg:shadow-[1px_0_0_rgba(15,23,42,0.02)]',
      mobileOpen ? 'translate-x-0' : '-translate-x-full'
    )}>
      <div className="flex h-16 shrink-0 items-center gap-3 border-b border-slate-100 px-5">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white shadow-sm shadow-blue-200">
          <Droplets className="h-6 w-6" />
        </span>
        <div>
          <span className="block text-base font-bold tracking-tight text-slate-900">LaundryPro</span>
          <span className="block text-[11px] font-medium uppercase tracking-[0.14em] text-slate-400">Management</span>
        </div>
      </div>

      <nav aria-label="Main navigation" className="flex-1 space-y-1 overflow-y-auto px-3 py-5">
        {navigation.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
          return (
            <Link
              key={item.name}
              href={item.href}
              onClick={onClose}
              aria-current={isActive ? 'page' : undefined}
              className={cn(
                'flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500',
                isActive
                  ? 'bg-blue-50 text-blue-700 shadow-sm shadow-blue-100/70'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              )}
            >
              <item.icon className="h-5 w-5 shrink-0" />
              {item.name}
            </Link>
          )
        })}
      </nav>

      <div className="border-t border-slate-100 p-4">
        <div className="rounded-xl bg-slate-50 p-3">
          <p className="text-xs font-semibold text-slate-700">LaundryPro workspace</p>
          <p className="mt-1 text-[11px] text-slate-500">Keep your daily operations organized.</p>
        </div>
      </div>
    </aside>
  )
}
