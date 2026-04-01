'use client'
import ProtectedRoute from '@/components/ProtectedRoute'
import { useAuthStore } from '@/store/authStore'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function CashierLayout({ children }: { children: React.ReactNode }) {
  const pathname         = usePathname()
  const { user, logout } = useAuthStore()
  const isCashierOnly    = user?.role === 'cashier'

  const navItems = [
    {
      label: 'POS',
      href: '/pos',
      // Match /pos but NOT /pos/receipt or /pos/sales
      active: pathname === '/pos' || pathname === '/pos/checkout',
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15"/>
        </svg>
      ),
    },
    {
      label: 'Sales',
      href: '/pos/sales',
      active: pathname.startsWith('/pos/sales') || pathname.startsWith('/pos/receipt'),
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25z"/>
        </svg>
      ),
    },
    // Dashboard only visible to admin/manager who happen to visit the cashier layout
    ...(!isCashierOnly ? [{
      label: 'Dashboard',
      href: '/dashboard',
      active: false,
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z"/>
        </svg>
      ),
    }] : []),
  ]

  return (
    <ProtectedRoute>
      <div className="flex flex-col min-h-screen overflow-hidden bg-base">
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
            <span className="text-sm font-bold text-white hidden sm:block"
              style={{ fontFamily: 'var(--font-display)' }}>
              PayPoint POS
            </span>
          </div>

          {/* Nav links */}
          <nav className="flex items-center gap-1">
            {navItems.map(item => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-pos-md text-sm font-medium transition-pos"
                style={{
                  backgroundColor: item.active ? 'rgba(16,185,129,0.15)' : 'transparent',
                  color: item.active ? 'var(--color-accent)' : 'var(--color-sidebar-text)',
                }}
              >
                {item.icon}
                <span className="hidden sm:block">{item.label}</span>
              </Link>
            ))}
          </nav>

          {/* User + logout */}
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2">
              <div
                className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white"
                style={{ backgroundColor: 'var(--color-accent)' }}
              >
                {user?.name?.split(' ').map((n: string) => n[0]).join('') || 'U'}
              </div>
              <div className="hidden md:block">
                <p className="text-xs font-medium text-white leading-none">{user?.name}</p>
                <p className="text-xs capitalize mt-0.5" style={{ color: 'var(--color-sidebar-text)' }}>
                  {user?.role}
                </p>
              </div>
            </div>
            <button
              onClick={logout}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-pos-md text-xs font-medium transition-pos hover:bg-white/10"
              style={{ color: 'var(--color-sidebar-text)' }}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9"/>
              </svg>
              <span className="hidden sm:block">Logout</span>
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-hidden p-6">{children}</main>
      </div>
    </ProtectedRoute>
  )
}
