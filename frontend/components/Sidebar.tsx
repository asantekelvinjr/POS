'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { useAuthStore } from '@/store/authStore'

const navItems = [
  {
    group: 'Main',
    items: [
      {
        label: 'Dashboard',
        href: '/dashboard',
        roles: ['admin', 'manager'],
        icon: (
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
          </svg>
        ),
      },
      {
        label: 'POS',
        href: '/pos',
        roles: ['admin', 'manager', 'cashier'],
        icon: (
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15" />
          </svg>
        ),
      },
    ],
  },
  {
    group: 'Inventory',
    items: [
      {
        label: 'Products',
        href: '/products',
        roles: ['admin', 'manager'],
        icon: (
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
          </svg>
        ),
      },
      {
        label: 'Inventory',
        href: '/inventory',
        roles: ['admin', 'manager'],
        icon: (
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 2.625c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125m16.5 5.625c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125" />
          </svg>
        ),
      },
    ],
  },
  {
    group: 'People',
    items: [
      {
        label: 'Customers',
        href: '/customers',
        roles: ['admin', 'manager'],
        icon: (
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
          </svg>
        ),
      },
      {
        label: 'Users',
        href: '/users',
        roles: ['admin'],
        icon: (
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
          </svg>
        ),
      },
    ],
  },
  {
    group: 'Insights',
    items: [
      {
        label: 'Reports',
        href: '/reports',
        roles: ['admin', 'manager'],
        icon: (
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
          </svg>
        ),
      },
    ],
  },
]

export default function Sidebar({ collapsed = false }: { collapsed?: boolean }) {
  const pathname = usePathname()
  const { user, logout } = useAuthStore()

  function isActive(href: string) {
    if (href === '/dashboard') return pathname === '/dashboard'
    return pathname.startsWith(href)
  }

  return (
    <aside
      className="h-full flex flex-col py-4 overflow-y-auto"
      style={{ backgroundColor: 'var(--color-sidebar-bg)', width: collapsed ? '64px' : '240px', transition: 'width 0.2s ease' }}
    >
      {/* Logo */}
      <div className={`px-4 mb-6 flex items-center gap-3 ${collapsed ? 'justify-center' : ''}`}>
        <div
          className="w-8 h-8 rounded-pos-md flex items-center justify-center font-bold text-sm shrink-0"
          style={{ backgroundColor: 'var(--color-accent)', color: 'white', fontFamily: 'var(--font-display)' }}
        >
          P
        </div>
        {!collapsed && (
          <span className="font-bold text-white text-sm" style={{ fontFamily: 'var(--font-display)' }}>
            PayPoint POS
          </span>
        )}
      </div>

      {/* Nav groups */}
      <nav className="flex-1 px-3 space-y-6">
        {navItems.map(group => {
          const visibleItems = group.items.filter(item =>
            !user || item.roles.includes(user.role)
          )
          if (visibleItems.length === 0) return null

          return (
            <div key={group.group}>
              {!collapsed && (
                <p className="px-2 mb-1 text-xs font-semibold uppercase tracking-widest" style={{ color: 'var(--color-sidebar-text)' }}>
                  {group.group}
                </p>
              )}
              <div className="space-y-0.5">
                {visibleItems.map(item => {
                  const active = isActive(item.href)
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`flex items-center gap-3 px-2 py-2.5 rounded-pos-md transition-pos ${collapsed ? 'justify-center' : ''}`}
                      style={{
                        backgroundColor: active ? 'rgba(16,185,129,0.15)' : 'transparent',
                        color: active ? 'var(--color-accent)' : 'var(--color-sidebar-text)',
                        borderLeft: active && !collapsed ? '2px solid var(--color-accent)' : '2px solid transparent',
                      }}
                      title={collapsed ? item.label : undefined}
                    >
                      <span className="shrink-0">{item.icon}</span>
                      {!collapsed && (
                        <span className="text-sm font-medium">{item.label}</span>
                      )}
                    </Link>
                  )
                })}
              </div>
            </div>
          )
        })}
      </nav>

      {/* User + logout */}
      <div className="px-3 mt-4 border-t pt-4" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
        <div className={`flex items-center gap-2.5 px-2 py-2 ${collapsed ? 'justify-center' : ''}`}>
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center font-semibold text-xs text-white shrink-0"
            style={{ backgroundColor: 'var(--color-accent)' }}
          >
            {user?.name?.split(' ').map((n: string) => n[0]).join('') || 'U'}
          </div>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-white truncate">{user?.name || 'Admin'}</p>
              <p className="text-xs capitalize" style={{ color: 'var(--color-sidebar-text)' }}>{user?.role || 'admin'}</p>
            </div>
          )}
          {!collapsed && (
            <button
              onClick={logout}
              className="text-muted hover:text-white transition-pos p-1"
              title="Logout"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
              </svg>
            </button>
          )}
        </div>
      </div>
    </aside>
  )
}
