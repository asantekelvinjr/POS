'use client'
import { useState, useRef, useEffect } from 'react'
import { useNotificationStore, Notification, NotificationType } from '@/store/notificationStore'
import Link from 'next/link'

const typeIcon: Record<NotificationType, string> = {
  sale:         '💰',
  low_stock:    '⚠️',
  out_of_stock: '🚫',
  refund:       '↩️',
  new_customer: '👤',
  info:         'ℹ️',
}

const typeBg: Record<NotificationType, string> = {
  sale:         'var(--color-success-light)',
  low_stock:    'var(--color-highlight-light)',
  out_of_stock: 'var(--color-danger-light)',
  refund:       'var(--color-info-light)',
  new_customer: 'var(--color-accent-light)',
  info:         'var(--color-surface-3)',
}

const typeColor: Record<NotificationType, string> = {
  sale:         'var(--color-success)',
  low_stock:    'var(--color-highlight)',
  out_of_stock: 'var(--color-danger)',
  refund:       'var(--color-info)',
  new_customer: 'var(--color-accent)',
  info:         'var(--color-text-secondary)',
}

function timeAgo(ts: string): string {
  const diff = Date.now() - new Date(ts).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  return `${Math.floor(hrs / 24)}d ago`
}

export default function NotificationPanel() {
  const [open, setOpen] = useState(false)
  const panelRef        = useRef<HTMLDivElement>(null)
  const { notifications, markRead, markAllRead, clear } = useNotificationStore()
  const unread = notifications.filter(n => !n.read).length

  // Close on outside click
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) setOpen(false)
    }
    if (open) document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [open])

  function handleNotifClick(n: Notification) {
    markRead(n.id)
    setOpen(false)
  }

  return (
    <div className="relative" ref={panelRef}>
      {/* Bell button */}
      <button
        onClick={() => setOpen(!open)}
        className="w-9 h-9 rounded-pos-md flex items-center justify-center transition-pos relative"
        style={{ color: 'var(--color-text-secondary)', backgroundColor: open ? 'var(--color-surface-2)' : 'transparent' }}
        title="Notifications"
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0"/>
        </svg>
        {unread > 0 && (
          <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] rounded-full flex items-center justify-center text-white text-xs font-bold px-1"
            style={{ backgroundColor: 'var(--color-danger)', fontSize: '10px' }}>
            {unread > 9 ? '9+' : unread}
          </span>
        )}
      </button>

      {/* Panel */}
      {open && (
        <div
          className="absolute right-0 top-12 w-80 card-elevated z-50 overflow-hidden"
          style={{ boxShadow: 'var(--shadow-modal)' }}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-base">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-primary text-sm">Notifications</h3>
              {unread > 0 && (
                <span className="text-xs font-bold px-2 py-0.5 rounded-full"
                  style={{ backgroundColor: 'var(--color-danger-light)', color: 'var(--color-danger)' }}>
                  {unread} new
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              {unread > 0 && (
                <button onClick={markAllRead} className="text-xs text-accent hover:underline font-medium">
                  Mark all read
                </button>
              )}
              {notifications.length > 0 && (
                <button onClick={clear} className="text-xs text-muted hover:text-danger transition-pos">
                  Clear
                </button>
              )}
            </div>
          </div>

          {/* List */}
          <div className="max-h-96 overflow-y-auto divide-y divide-base">
            {notifications.length === 0 ? (
              <div className="px-4 py-8 text-center">
                <div className="text-3xl mb-2">🔔</div>
                <p className="text-sm font-medium text-secondary">No notifications yet</p>
                <p className="text-xs text-muted mt-1">Events like sales, low stock and new customers will appear here</p>
              </div>
            ) : (
              notifications.map(n => (
                <div
                  key={n.id}
                  onClick={() => handleNotifClick(n)}
                  className="flex items-start gap-3 px-4 py-3 cursor-pointer transition-pos hover:bg-surface-2"
                  style={{ backgroundColor: n.read ? undefined : 'color-mix(in srgb, var(--color-accent) 4%, transparent)' }}
                >
                  {/* Icon */}
                  <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-sm"
                    style={{ backgroundColor: typeBg[n.type] }}>
                    {typeIcon[n.type]}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-sm font-medium text-primary leading-snug">{n.title}</p>
                      {!n.read && (
                        <span className="w-2 h-2 rounded-full shrink-0 mt-1.5" style={{ backgroundColor: 'var(--color-accent)' }}/>
                      )}
                    </div>
                    <p className="text-xs text-secondary mt-0.5 leading-snug">{n.message}</p>
                    <p className="text-xs text-muted mt-1">{timeAgo(n.timestamp)}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  )
}
