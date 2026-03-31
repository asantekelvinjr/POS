'use client'
import { useEffect, useState } from 'react'
import { apiGet } from '@/lib/api'
import SalesChart from '@/components/reports/SalesChart'
import Badge from '@/components/ui/Badge'

interface Sale {
  id: number; transaction_code: string; cashier_name: string; customer_name: string | null
  total_amount: number; payment_method: string; status: string; created_at: string
}

export default function SalesReportPage() {
  const [sales, setSales]     = useState<Sale[]>([])
  const [loading, setLoading] = useState(true)
  const [start, setStart]     = useState('')
  const [end, setEnd]         = useState('')

  useEffect(() => {
    // Default: today
    const today = new Date().toISOString().split('T')[0]
    setStart(today)
    setEnd(today)
    apiGet<Sale[]>('/sales?limit=50')
      .then(setSales)
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  function handleFilter() {
    setLoading(true)
    const query = [start && `startDate=${start}`, end && `endDate=${end}T23:59:59`].filter(Boolean).join('&')
    apiGet<Sale[]>(`/sales?limit=100${query ? '&' + query : ''}`)
      .then(setSales)
      .catch(console.error)
      .finally(() => setLoading(false))
  }

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-2 text-sm text-muted mb-2">
          <a href="/reports" className="hover:text-accent transition-pos">Reports</a>
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/></svg>
          <span className="text-primary font-medium">Sales Report</span>
        </div>
        <h1 className="text-2xl font-bold text-primary" style={{ fontFamily: 'var(--font-display)' }}>Sales Report</h1>
        <p className="text-secondary mt-1">All transactions with filters</p>
      </div>

      {/* Date filter */}
      <div className="card p-4 flex flex-wrap items-end gap-4">
        <div className="space-y-1">
          <label className="block text-xs font-medium text-secondary">From</label>
          <input type="date" value={start} onChange={e => setStart(e.target.value)} className="input-pos px-3 py-2 text-sm"/>
        </div>
        <div className="space-y-1">
          <label className="block text-xs font-medium text-secondary">To</label>
          <input type="date" value={end} onChange={e => setEnd(e.target.value)} className="input-pos px-3 py-2 text-sm"/>
        </div>
        <button onClick={handleFilter}
          className="px-4 py-2 rounded-pos-md text-sm font-semibold text-white transition-pos"
          style={{ backgroundColor: 'var(--color-accent)' }}>
          Filter
        </button>
        <p className="text-sm text-muted ml-auto">{sales.length} transactions</p>
      </div>

      <SalesChart detailed />

      {/* Transactions table */}
      <div className="card overflow-hidden">
        <div className="px-6 py-4 border-b border-base">
          <h3 className="font-semibold text-primary">All Transactions</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-surface-2 text-left">
                {['Transaction', 'Cashier', 'Customer', 'Total', 'Method', 'Date', 'Status'].map(h => (
                  <th key={h} className="px-6 py-3 text-xs font-semibold text-muted uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-base">
              {loading ? (
                Array.from({ length: 6 }).map((_, i) => (
                  <tr key={i}>{Array.from({ length: 7 }).map((_, j) => (
                    <td key={j} className="px-6 py-4"><div className="h-4 rounded animate-pulse" style={{ backgroundColor: 'var(--color-surface-3)', width: '70%' }}/></td>
                  ))}</tr>
                ))
              ) : sales.length === 0 ? (
                <tr><td colSpan={7} className="px-6 py-12 text-center text-muted">No sales found for this period</td></tr>
              ) : sales.map(s => (
                <tr key={s.id} className="hover:bg-surface-2 transition-pos">
                  <td className="px-6 py-4 font-mono font-medium text-accent">{s.transaction_code}</td>
                  <td className="px-6 py-4 text-secondary">{s.cashier_name}</td>
                  <td className="px-6 py-4 text-primary">{s.customer_name || 'Walk-in'}</td>
                  <td className="px-6 py-4 font-semibold text-primary">GHS {Number(s.total_amount).toFixed(2)}</td>
                  <td className="px-6 py-4"><Badge variant="info">{s.payment_method}</Badge></td>
                  <td className="px-6 py-4 text-muted text-xs">{new Date(s.created_at).toLocaleString('en-GH')}</td>
                  <td className="px-6 py-4">
                    <span className="px-2.5 py-1 rounded-full text-xs font-medium"
                      style={{ backgroundColor: s.status === 'completed' ? 'var(--color-success-light)' : 'var(--color-danger-light)', color: s.status === 'completed' ? 'var(--color-success)' : 'var(--color-danger)' }}>
                      {s.status}
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
