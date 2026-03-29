'use client'

import { useState } from 'react'
import ProtectedRoute from '@/components/ProtectedRoute'
import Navbar from '@/components/Navbar'
import { useAuthStore } from '@/store/authStore'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const cashierNav = [
  {
    label: 'POS',
    href: '/pos',
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15" />
      </svg>
    ),
  },
  {
    label: 'Dashboard',
    href: '/dashboard',
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
      </svg>
    ),
  },
]

export default function CashierLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const { user, logout } = useAuthStore()

  return (
    <ProtectedRoute>
      <div className="flex flex-col h-screen overflow-hidden bg-base">
        {/* Slim top nav for cashier */}
        <header
          className="h-14 flex items-center justify-between px-4 border-b border-base shrink-0"
          style={{ backgroundColor: 'var(--color-sidebar-bg)' }}
        >
          {/* Logo */}
          <div className="flex items-center gap-2.5">
            <div
              className="w-7 h-7 rounded-pos-sm flex items-center justify-center font-bold text-xs text-white shrink-0"
              style={{ backgroundColor: 'var(--color-accent)', fontFamily: 'var(--font-display)' }}
            >
              P
            </div>
            <span className="text-sm font-bold text-white hidden sm:block" style={{ fontFamily: 'var(--font-display)' }}>
              PayPoint POS
            </span>
          </div>

          {/* Nav links */}
          <nav className="flex items-center gap-1">
            {cashierNav.map(item => {
              const active = pathname.startsWith(item.href)
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-pos-md text-sm font-medium transition-pos"
                  style={{
                    backgroundColor: active ? 'rgba(16,185,129,0.15)' : 'transparent',
                    color: active ? 'var(--color-accent)' : 'var(--color-sidebar-text)',
                  }}
                >
                  {item.icon}
                  <span className="hidden sm:block">{item.label}</span>
                </Link>
              )
            })}
          </nav>

          {/* User + logout */}
          <div className="flex items-center gap-2">
            <span className="text-xs hidden md:block" style={{ color: 'var(--color-sidebar-text)' }}>
              {user?.name}
            </span>
            <button
              onClick={logout}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-pos-md text-xs font-medium transition-pos"
              style={{ color: 'var(--color-sidebar-text)' }}
              title="Logout"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
              </svg>
              <span className="hidden sm:block">Logout</span>
            </button>
          </div>
        </header>

        {/* Page — full bleed, no extra padding (POS screen manages its own layout) */}
        <main className="flex-1 overflow-hidden p-6">
          {children}
        </main>
      </div>
    </ProtectedRoute>
  )
}
