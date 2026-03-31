'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import SalesChart from '@/components/reports/SalesChart'
import LowStockAlert from '@/components/inventory/LowStockAlert'
import { apiGet } from '@/lib/api'
import { useAuthStore } from '@/store/authStore'

interface DailySummary {
  total_revenue: number; total_transactions: number; total_items_sold: number
  cash_total: number; momo_total: number; card_total: number
}
interface RecentSale {
  id: number; transaction_code: string; customer_name: string | null
  total_amount: number; payment_method: string; status: string
  created_at: string; cashier_name: string
}
interface WeeklyDay { day: string; transactions: number; revenue: number }

export default function DashboardPage() {
  const { user }                      = useAuthStore()
  const [summary, setSummary]         = useState<DailySummary | null>(null)
  const [recentSales, setRecent]      = useState<RecentSale[]>([])
  const [weekly, setWeekly]           = useState<WeeklyDay[]>([])
  const [lowStockCount, setLowStock]  = useState(0)
  const [greeting, setGreeting]       = useState('Good morning')
  const [loading, setLoading]         = useState(true)

  useEffect(() => {
    const h = new Date().getHours()
    if (h >= 12 && h < 17) setGreeting('Good afternoon')
    else if (h >= 17) setGreeting('Good evening')
  }, [])

  useEffect(() => {
    async function load() {
      try {
        const [sumData, salesData, lowData, weekData] = await Promise.all([
          apiGet<DailySummary>('/sales/summary/daily'),
          apiGet<RecentSale[]>('/sales?limit=6'),
          apiGet<unknown[]>('/inventory/low-stock'),
          apiGet<WeeklyDay[]>('/reports/weekly'),
        ])
        setSummary(sumData)
        setRecent(salesData)
        setLowStock(lowData.length)
        setWeekly(weekData)
      } catch (e) {
        console.error('Dashboard load error:', e)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const fmt = (n: number) => `GHS ${Number(n || 0).toFixed(2)}`

  // Clickable stat cards — each links to the relevant detail page
  const stats = [
    {
      label: "Today's Revenue",
      value: loading ? '…' : fmt(summary?.total_revenue || 0),
      sub: `${summary?.total_transactions || 0} transactions`,
      href: '/reports/sales',
      color: 'var(--color-accent)',
      bg: 'var(--color-accent-light)',
      icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>,
    },
    {
      label: 'Cash Sales',
      value: loading ? '…' : fmt(summary?.cash_total || 0),
      sub: 'Physical currency today',
      href: '/reports',
      color: 'var(--color-success)',
      bg: 'var(--color-success-light)',
      icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75"/></svg>,
    },
    {
      label: 'Mobile Money',
      value: loading ? '…' : fmt(summary?.momo_total || 0),
      sub: 'MTN, Vodafone, AirtelTigo',
      href: '/reports',
      color: 'var(--color-info)',
      bg: 'var(--color-info-light)',
      icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 8.25h3v.375a2.625 2.625 0 11-3 0V9.75z"/></svg>,
    },
    {
      label: 'Low Stock Items',
      value: loading ? '…' : String(lowStockCount),
      sub: lowStockCount > 0 ? 'Needs restocking' : 'All levels healthy',
      href: '/inventory',
      color: lowStockCount > 0 ? 'var(--color-highlight)' : 'var(--color-success)',
      bg: lowStockCount > 0 ? 'var(--color-highlight-light)' : 'var(--color-success-light)',
      icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"/></svg>,
    },
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-primary" style={{ fontFamily: 'var(--font-display)' }}>
            {greeting}, {user?.name?.split(' ')[0] || 'Admin'} 👋
          </h1>
          <p className="text-secondary mt-1">
            {new Date().toLocaleDateString('en-GH', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
        <Link href="/pos" className="btn-accent inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold rounded-pos-md">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"/></svg>
          Open POS
        </Link>
      </div>

      {/* Clickable stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {stats.map(stat => (
          <Link key={stat.label} href={stat.href}
            className="card p-5 hover:shadow-elevated transition-pos cursor-pointer group">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-secondary font-medium">{stat.label}</p>
                <p className="mt-2 text-2xl font-bold text-primary">{stat.value}</p>
                <p className="mt-1.5 text-xs font-medium text-muted group-hover:text-secondary transition-pos">{stat.sub}</p>
              </div>
              <div className="p-2.5 rounded-pos-md" style={{ backgroundColor: stat.bg, color: stat.color }}>
                {stat.icon}
              </div>
            </div>
            <p className="mt-3 text-xs font-medium transition-pos" style={{ color: stat.color }}>
              View details →
            </p>
          </Link>
        ))}
      </div>

      {/* Main grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2"><SalesChart /></div>
        <div><LowStockAlert /></div>
      </div>

      {/* Weekly breakdown table */}
      <div className="card overflow-hidden">
        <div className="px-6 py-4 border-b border-base flex items-center justify-between">
          <h2 className="font-semibold text-primary">Daily Sales — This Week</h2>
          <Link href="/reports" className="text-sm text-accent hover:underline font-medium">Full reports →</Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-surface-2 text-left">
                {['Day', 'Transactions', 'Revenue', 'Avg Order'].map(h => (
                  <th key={h} className="px-6 py-3 text-xs font-semibold text-muted uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-base">
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i}>{Array.from({ length: 4 }).map((_, j) => (
                    <td key={j} className="px-6 py-4">
                      <div className="h-4 rounded animate-pulse" style={{ backgroundColor: 'var(--color-surface-3)', width: '60%' }}/>
                    </td>
                  ))}</tr>
                ))
              ) : weekly.length === 0 ? (
                <tr><td colSpan={4} className="px-6 py-10 text-center text-muted">No sales data yet this week</td></tr>
              ) : weekly.map((d, i) => {
                const avg = d.transactions > 0 ? Number(d.revenue) / d.transactions : 0
                const isToday = i === weekly.length - 1
                return (
                  <tr key={d.day} className="hover:bg-surface-2 transition-pos">
                    <td className="px-6 py-4">
                      <span className="font-medium" style={{ color: isToday ? 'var(--color-accent)' : 'var(--color-text-primary)' }}>
                        {new Date(d.day).toLocaleDateString('en-GH', { weekday: 'long', month: 'short', day: 'numeric' })}
                        {isToday && <span className="ml-2 text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: 'var(--color-accent-light)', color: 'var(--color-accent)' }}>Today</span>}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-secondary">{d.transactions}</td>
                    <td className="px-6 py-4 font-semibold text-primary">GHS {Number(d.revenue).toFixed(2)}</td>
                    <td className="px-6 py-4 text-secondary">GHS {avg.toFixed(2)}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recent transactions */}
      <div className="card overflow-hidden">
        <div className="px-6 py-4 border-b border-base flex items-center justify-between">
          <h2 className="font-semibold text-primary">Recent Transactions</h2>
          <Link href="/reports/sales" className="text-sm text-accent hover:underline font-medium">View all →</Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-surface-2 text-left">
                {['Transaction', 'Cashier', 'Customer', 'Total', 'Method', 'Time', 'Status'].map(h => (
                  <th key={h} className="px-6 py-3 text-xs font-semibold text-muted uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-base">
              {loading ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <tr key={i}>{Array.from({ length: 7 }).map((_, j) => (
                    <td key={j} className="px-6 py-4">
                      <div className="h-4 rounded animate-pulse" style={{ backgroundColor: 'var(--color-surface-3)', width: '70%' }}/>
                    </td>
                  ))}</tr>
                ))
              ) : recentSales.length === 0 ? (
                <tr><td colSpan={7} className="px-6 py-10 text-center text-muted">No sales yet today</td></tr>
              ) : recentSales.map(sale => (
                <tr key={sale.id} className="hover:bg-surface-2 transition-pos">
                  <td className="px-6 py-4 font-mono font-medium text-accent">{sale.transaction_code}</td>
                  <td className="px-6 py-4 text-secondary">{sale.cashier_name}</td>
                  <td className="px-6 py-4 text-primary">{sale.customer_name || 'Walk-in'}</td>
                  <td className="px-6 py-4 font-semibold text-primary">GHS {Number(sale.total_amount).toFixed(2)}</td>
                  <td className="px-6 py-4">
                    <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-info-light text-info capitalize">
                      {sale.payment_method}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-muted text-xs">
                    {new Date(sale.created_at).toLocaleTimeString('en-GH', { hour: '2-digit', minute: '2-digit' })}
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2.5 py-1 rounded-full text-xs font-medium"
                      style={{ backgroundColor: sale.status === 'completed' ? 'var(--color-success-light)' : 'var(--color-danger-light)', color: sale.status === 'completed' ? 'var(--color-success)' : 'var(--color-danger)' }}>
                      {sale.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
