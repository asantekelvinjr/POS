'use client'

import { useState } from 'react'

const weeklyData = [
  { day: 'Mon', sales: 3200, transactions: 42 },
  { day: 'Tue', sales: 4100, transactions: 58 },
  { day: 'Wed', sales: 2800, transactions: 35 },
  { day: 'Thu', sales: 5600, transactions: 74 },
  { day: 'Fri', sales: 6200, transactions: 89 },
  { day: 'Sat', sales: 7800, transactions: 102 },
  { day: 'Sun', sales: 4820, transactions: 63 },
]

const monthlyData = [
  { day: 'Jan', sales: 42000, transactions: 520 },
  { day: 'Feb', sales: 38000, transactions: 480 },
  { day: 'Mar', sales: 51000, transactions: 630 },
  { day: 'Apr', sales: 46000, transactions: 580 },
  { day: 'May', sales: 58000, transactions: 720 },
  { day: 'Jun', sales: 62000, transactions: 780 },
]

export default function SalesChart({ detailed }: { detailed?: boolean }) {
  const [view, setView] = useState<'week' | 'month'>('week')
  const [metric, setMetric] = useState<'sales' | 'transactions'>('sales')

  const data = view === 'week' ? weeklyData : monthlyData
  const maxVal = Math.max(...data.map(d => d[metric]))

  const total = data.reduce((sum, d) => sum + d[metric], 0)
  const avg = total / data.length

  return (
    <div className="card p-6 space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h3 className="font-semibold text-primary">
            {metric === 'sales' ? 'Revenue Overview' : 'Transaction Volume'}
          </h3>
          <p className="text-xs text-muted mt-0.5">
            Total: {metric === 'sales' ? `GHS ${total.toLocaleString()}` : `${total} txns`}
          </p>
        </div>

        <div className="flex gap-2 flex-wrap">
          {/* Metric toggle */}
          <div className="flex rounded-pos-md overflow-hidden border border-base">
            {(['sales', 'transactions'] as const).map(m => (
              <button
                key={m}
                onClick={() => setMetric(m)}
                className="px-3 py-1.5 text-xs font-medium capitalize transition-pos"
                style={{
                  backgroundColor: metric === m ? 'var(--color-accent)' : 'transparent',
                  color: metric === m ? 'white' : 'var(--color-text-secondary)',
                }}
              >
                {m === 'sales' ? 'Revenue' : 'Transactions'}
              </button>
            ))}
          </div>

          {/* Period toggle */}
          <div className="flex rounded-pos-md overflow-hidden border border-base">
            {(['week', 'month'] as const).map(p => (
              <button
                key={p}
                onClick={() => setView(p)}
                className="px-3 py-1.5 text-xs font-medium capitalize transition-pos"
                style={{
                  backgroundColor: view === p ? 'var(--color-accent)' : 'transparent',
                  color: view === p ? 'white' : 'var(--color-text-secondary)',
                }}
              >
                {p === 'week' ? 'This Week' : 'Monthly'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="flex items-end gap-2 h-40 pt-4">
        {data.map((d, i) => {
          const heightPct = maxVal > 0 ? (d[metric] / maxVal) * 100 : 0
          const isToday = view === 'week' && i === data.length - 1

          return (
            <div key={d.day} className="flex-1 flex flex-col items-center gap-1.5 group">
              {/* Value tooltip */}
              <div
                className="opacity-0 group-hover:opacity-100 transition-pos text-xs font-semibold text-center whitespace-nowrap"
                style={{ color: 'var(--color-accent)' }}
              >
                {metric === 'sales' ? `GHS ${d.sales.toLocaleString()}` : d.transactions}
              </div>

              {/* Bar */}
              <div className="w-full flex-1 flex items-end">
                <div
                  className="w-full rounded-t-pos-sm transition-all duration-500"
                  style={{
                    height: `${heightPct}%`,
                    minHeight: '4px',
                    backgroundColor: isToday
                      ? 'var(--color-accent)'
                      : 'color-mix(in srgb, var(--color-accent) 35%, var(--color-surface-3))',
                    borderRadius: '4px 4px 0 0',
                  }}
                />
              </div>

              {/* Label */}
              <span
                className="text-xs font-medium"
                style={{ color: isToday ? 'var(--color-accent)' : 'var(--color-text-muted)' }}
              >
                {d.day}
              </span>
            </div>
          )
        })}
      </div>

      {/* Average line reference */}
      <div className="flex items-center justify-between pt-2 border-t border-base text-xs text-muted">
        <span>
          Avg per day:{' '}
          <span className="font-semibold text-primary">
            {metric === 'sales' ? `GHS ${Math.round(avg).toLocaleString()}` : `${Math.round(avg)} txns`}
          </span>
        </span>
        <span>
          Peak:{' '}
          <span className="font-semibold text-primary">
            {metric === 'sales' ? `GHS ${maxVal.toLocaleString()}` : `${maxVal} txns`}
          </span>
        </span>
      </div>

      {/* Detailed table — only on /reports/sales */}
      {detailed && (
        <div className="border-t border-base pt-4 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left">
                {['Day', 'Revenue', 'Transactions', 'Avg Order'].map(h => (
                  <th key={h} className="pb-2 text-xs font-semibold text-muted uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-base">
              {weeklyData.map(d => (
                <tr key={d.day} className="hover:bg-surface-2 transition-pos">
                  <td className="py-2.5 font-medium text-primary">{d.day}</td>
                  <td className="py-2.5 text-secondary">GHS {d.sales.toLocaleString()}</td>
                  <td className="py-2.5 text-secondary">{d.transactions}</td>
                  <td className="py-2.5 text-secondary">
                    GHS {(d.sales / d.transactions).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
