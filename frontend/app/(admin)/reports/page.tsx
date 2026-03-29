'use client'

import SalesChart from '@/components/reports/SalesChart'
import SalesSummary from '@/components/reports/SalesSummary'
import Button from '@/components/ui/Button'

export default function ReportsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-primary" style={{ fontFamily: 'var(--font-display)' }}>Reports & Analytics</h1>
          <p className="text-secondary mt-1">Overview of your business performance</p>
        </div>
        <div className="flex gap-3">
          <a href="/reports/sales" className="btn-ghost px-4 py-2 text-sm font-medium border border-base rounded-pos-md">
            Sales Report →
          </a>
          <a href="/reports/inventory" className="btn-ghost px-4 py-2 text-sm font-medium border border-base rounded-pos-md">
            Inventory Report →
          </a>
        </div>
      </div>

      {/* Date range filter */}
      <div className="card p-4 flex flex-wrap gap-3 items-center">
        <span className="text-sm font-medium text-secondary">Period:</span>
        {['Today', 'This Week', 'This Month', 'Last 3 Months', 'Custom'].map(p => (
          <button
            key={p}
            className="px-3.5 py-1.5 rounded-pos-md text-sm font-medium transition-pos"
            style={{
              backgroundColor: p === 'This Week' ? 'var(--color-accent)' : 'var(--color-surface-2)',
              color: p === 'This Week' ? 'white' : 'var(--color-text-secondary)',
            }}
          >
            {p}
          </button>
        ))}
        <Button variant="ghost" size="sm" className="ml-auto">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
          </svg>
          Export PDF
        </Button>
      </div>

      <SalesSummary detailed />
      <SalesChart />

      {/* Top products table */}
      <div className="card overflow-hidden">
        <div className="px-6 py-4 border-b border-base">
          <h3 className="font-semibold text-primary">Top Selling Products (This Week)</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-surface-2 text-left">
                {['#', 'Product', 'Category', 'Qty Sold', 'Revenue', 'Trend'].map(h => (
                  <th key={h} className="px-6 py-3 text-xs font-semibold text-muted uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-base">
              {[
                { rank: 1, name: 'Milo 400g', cat: 'Beverages', qty: 84, rev: 672.00, up: true },
                { rank: 2, name: 'Mentos Roll', cat: 'Food', qty: 120, rev: 180.00, up: true },
                { rank: 3, name: 'Fair & White Cream', cat: 'Health', qty: 35, rev: 875.00, up: false },
                { rank: 4, name: 'Fanta 500ml', cat: 'Beverages', qty: 98, rev: 343.00, up: true },
                { rank: 5, name: 'Indomie Chicken', cat: 'Food', qty: 210, rev: 420.00, up: true },
              ].map(p => (
                <tr key={p.rank} className="hover:bg-surface-2 transition-pos">
                  <td className="px-6 py-4">
                    <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${p.rank <= 3 ? 'text-white' : 'text-secondary bg-surface-2'}`}
                      style={p.rank <= 3 ? { backgroundColor: 'var(--color-accent)' } : {}}>
                      {p.rank}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-medium text-primary">{p.name}</td>
                  <td className="px-6 py-4 text-secondary">{p.cat}</td>
                  <td className="px-6 py-4 text-secondary">{p.qty}</td>
                  <td className="px-6 py-4 font-semibold text-primary">GHS {p.rev.toFixed(2)}</td>
                  <td className="px-6 py-4">
                    <span style={{ color: p.up ? 'var(--color-success)' : 'var(--color-danger)' }} className="text-xs font-semibold">
                      {p.up ? '↑ Up' : '↓ Down'}
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
