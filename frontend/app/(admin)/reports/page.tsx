'use client'
import { useEffect, useState } from 'react'
import { apiGet } from '@/lib/api'
import SalesChart from '@/components/reports/SalesChart'
import SalesSummary from '@/components/reports/SalesSummary'

interface TopProduct { id: number; name: string; category: string; qty_sold: number; revenue: number }
interface CashierStat { id: number; name: string; total_transactions: number; total_revenue: number; avg_order_value: number }

export default function ReportsPage() {
  const [topProducts, setTopProducts]   = useState<TopProduct[]>([])
  const [cashiers, setCashiers]         = useState<CashierStat[]>([])
  const [loading, setLoading]           = useState(true)

  useEffect(() => {
    Promise.all([
      apiGet<TopProduct[]>('/reports/top-products?days=7&limit=5'),
      apiGet<CashierStat[]>('/reports/cashier-performance?days=7'),
    ]).then(([tp, cp]) => { setTopProducts(tp); setCashiers(cp) })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-primary" style={{ fontFamily: 'var(--font-display)' }}>Reports & Analytics</h1>
          <p className="text-secondary mt-1">Business performance overview</p>
        </div>
        <div className="flex gap-3">
          <a href="/reports/sales" className="btn-ghost px-4 py-2 text-sm font-medium border border-base rounded-pos-md">Sales Report →</a>
          <a href="/reports/inventory" className="btn-ghost px-4 py-2 text-sm font-medium border border-base rounded-pos-md">Inventory Report →</a>
        </div>
      </div>

      <SalesSummary detailed />
      <SalesChart />

      {/* Top products */}
      <div className="card overflow-hidden">
        <div className="px-6 py-4 border-b border-base"><h3 className="font-semibold text-primary">Top Selling Products (Last 7 Days)</h3></div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-surface-2 text-left">
                {['#', 'Product', 'Category', 'Qty Sold', 'Revenue'].map(h => (
                  <th key={h} className="px-6 py-3 text-xs font-semibold text-muted uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-base">
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i}>{Array.from({ length: 5 }).map((_, j) => (
                    <td key={j} className="px-6 py-4"><div className="h-4 rounded animate-pulse" style={{ backgroundColor: 'var(--color-surface-3)', width: '70%' }}/></td>
                  ))}</tr>
                ))
              ) : topProducts.length === 0 ? (
                <tr><td colSpan={5} className="px-6 py-10 text-center text-muted">No sales data yet</td></tr>
              ) : topProducts.map((p, idx) => (
                <tr key={p.id} className="hover:bg-surface-2 transition-pos">
                  <td className="px-6 py-4">
                    <span className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white" style={{ backgroundColor: idx < 3 ? 'var(--color-accent)' : 'var(--color-surface-3)', color: idx < 3 ? 'white' : 'var(--color-text-secondary)' }}>
                      {idx + 1}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-medium text-primary">{p.name}</td>
                  <td className="px-6 py-4 text-secondary">{p.category}</td>
                  <td className="px-6 py-4 text-secondary">{p.qty_sold}</td>
                  <td className="px-6 py-4 font-semibold text-primary">GHS {Number(p.revenue).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Cashier performance */}
      <div className="card overflow-hidden">
        <div className="px-6 py-4 border-b border-base"><h3 className="font-semibold text-primary">Cashier Performance (Last 7 Days)</h3></div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-surface-2 text-left">
                {['Cashier', 'Transactions', 'Revenue', 'Avg Order'].map(h => (
                  <th key={h} className="px-6 py-3 text-xs font-semibold text-muted uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-base">
              {loading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <tr key={i}>{Array.from({ length: 4 }).map((_, j) => (
                    <td key={j} className="px-6 py-4"><div className="h-4 rounded animate-pulse" style={{ backgroundColor: 'var(--color-surface-3)', width: '70%' }}/></td>
                  ))}</tr>
                ))
              ) : cashiers.map(c => (
                <tr key={c.id} className="hover:bg-surface-2 transition-pos">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white" style={{ backgroundColor: 'var(--color-accent)' }}>
                        {c.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <span className="font-medium text-primary">{c.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-secondary">{c.total_transactions}</td>
                  <td className="px-6 py-4 font-semibold text-primary">GHS {Number(c.total_revenue).toFixed(2)}</td>
                  <td className="px-6 py-4 text-secondary">GHS {Number(c.avg_order_value).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
