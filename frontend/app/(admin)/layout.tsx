'use client'

import { useState } from 'react'
import Sidebar from '@/components/Sidebar'
import Navbar from '@/components/Navbar'
import ProtectedRoute from '@/components/ProtectedRoute'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [collapsed, setCollapsed] = useState(false)

  return (
    <ProtectedRoute allowedRoles={['admin', 'manager']}>
      <div className="flex h-screen overflow-hidden bg-base">

        {/* Mobile overlay */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 z-20 bg-black/50 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Sidebar — desktop always visible, mobile drawer */}
        <div
          className={`
            fixed lg:relative z-30 h-full transition-transform duration-200
            ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          `}
        >
          <Sidebar collapsed={collapsed} />
        </div>

        {/* Main content area */}
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          {/* Top navbar */}
          <Navbar onMenuToggle={() => setSidebarOpen(prev => !prev)} />

          {/* Collapse toggle — desktop only */}
          <div className="hidden lg:flex items-center px-4 py-1 border-b border-base bg-surface">
            <button
              onClick={() => setCollapsed(prev => !prev)}
              className="flex items-center gap-1.5 text-xs text-muted hover:text-secondary transition-pos"
            >
              <svg
                className={`w-3.5 h-3.5 transition-transform ${collapsed ? 'rotate-180' : ''}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
              </svg>
              {collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            </button>
          </div>

          {/* Page content */}
          <main className="flex-1 overflow-y-auto p-6">
            {children}
          </main>
        </div>
      </div>
    </ProtectedRoute>
  )
}
