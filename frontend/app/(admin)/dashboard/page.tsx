'use client'

import { useEffect, useState } from 'react'
import SalesSummary from '@/components/reports/SalesSummary'
import SalesChart from '@/components/reports/SalesChart'
import LowStockAlert from '@/components/inventory/LowStockAlert'

const stats = [
  {
    label: 'Today\'s Revenue',
    value: 'GHS 4,820.50',
    change: '+12.4%',
    positive: true,
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    color: 'accent',
  },
  {
    label: 'Transactions',
    value: '83',
    change: '+5 today',
    positive: true,
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" />
      </svg>
    ),
    color: 'info',
  },
  {
    label: 'Products Sold',
    value: '342',
    change: '18 categories',
    positive: true,
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
      </svg>
    ),
    color: 'success',
  },
  {
    label: 'Low Stock Items',
    value: '7',
    change: 'Needs attention',
    positive: false,
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
      </svg>
    ),
    color: 'highlight',
  },
]

const recentSales = [
  { id: 'TXN-001', customer: 'Walk-in', items: 4, total: 'GHS 120.00', method: 'Cash', time: '2 min ago', status: 'completed' },
  { id: 'TXN-002', customer: 'Kwame Asante', items: 2, total: 'GHS 85.50', method: 'MTN MoMo', time: '15 min ago', status: 'completed' },
  { id: 'TXN-003', customer: 'Ama Boateng', items: 7, total: 'GHS 432.00', method: 'Card', time: '32 min ago', status: 'completed' },
  { id: 'TXN-004', customer: 'Walk-in', items: 1, total: 'GHS 35.00', method: 'Cash', time: '1 hr ago', status: 'completed' },
  { id: 'TXN-005', customer: 'Kofi Mensah', items: 3, total: 'GHS 210.75', method: 'Vodafone Cash', time: '2 hr ago', status: 'refunded' },
]

const colorMap: Record<string, string> = {
  accent: 'var(--color-accent)',
  info: 'var(--color-info)',
  success: 'var(--color-success)',
  highlight: 'var(--color-highlight)',
}

const bgMap: Record<string, string> = {
  accent: 'var(--color-accent-light)',
  info: 'var(--color-info-light)',
  success: 'var(--color-success-light)',
  highlight: 'var(--color-highlight-light)',
}

export default function DashboardPage() {
  const [greeting, setGreeting] = useState('Good morning')

  useEffect(() => {
    const h = new Date().getHours()
    if (h >= 12 && h < 17) setGreeting('Good afternoon')
    else if (h >= 17) setGreeting('Good evening')
  }, [])

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-primary" style={{ fontFamily: 'var(--font-display)' }}>
            {greeting}, Admin 👋
          </h1>
          <p className="text-secondary mt-1">
            {new Date().toLocaleDateString('en-GH', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
        <a
          href="/pos"
          className="btn-accent inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
          </svg>
          Open POS
        </a>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {stats.map(stat => (
          <div key={stat.label} className="card p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-secondary font-medium">{stat.label}</p>
                <p className="mt-2 text-2xl font-bold text-primary">{stat.value}</p>
                <p
                  className="mt-1.5 text-xs font-semibold"
                  style={{ color: stat.positive ? 'var(--color-success)' : 'var(--color-highlight)' }}
                >
                  {stat.change}
                </p>
              </div>
              <div
                className="p-2.5 rounded-pos-md"
                style={{ backgroundColor: bgMap[stat.color], color: colorMap[stat.color] }}
              >
                {stat.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Main grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Sales chart - takes 2 cols */}
        <div className="xl:col-span-2">
          <SalesChart />
        </div>

        {/* Low stock alert */}
        <div>
          <LowStockAlert />
        </div>
      </div>

      {/* Recent transactions */}
      <div className="card overflow-hidden">
        <div className="px-6 py-4 border-b border-base flex items-center justify-between">
          <h2 className="font-semibold text-primary">Recent Transactions</h2>
          <a href="/reports/sales" className="text-sm text-accent hover:underline font-medium">
            View all
          </a>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-surface-2 text-left">
                {['Transaction', 'Customer', 'Items', 'Total', 'Method', 'Time', 'Status'].map(h => (
                  <th key={h} className="px-6 py-3 text-xs font-semibold text-muted uppercase tracking-wider">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-base">
              {recentSales.map(sale => (
                <tr key={sale.id} className="hover:bg-surface-2 transition-pos">
                  <td className="px-6 py-4 font-mono font-medium text-accent">{sale.id}</td>
                  <td className="px-6 py-4 text-primary">{sale.customer}</td>
                  <td className="px-6 py-4 text-secondary">{sale.items}</td>
                  <td className="px-6 py-4 font-semibold text-primary">{sale.total}</td>
                  <td className="px-6 py-4">
                    <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-info-light text-info">
                      {sale.method}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-muted">{sale.time}</td>
                  <td className="px-6 py-4">
                    <span
                      className="px-2.5 py-1 rounded-full text-xs font-medium"
                      style={{
                        backgroundColor: sale.status === 'completed' ? 'var(--color-success-light)' : 'var(--color-danger-light)',
                        color: sale.status === 'completed' ? 'var(--color-success)' : 'var(--color-danger)',
                      }}
                    >
                      {sale.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Summary cards */}
      <SalesSummary />
    </div>
  )
}
