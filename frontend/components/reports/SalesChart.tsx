'use client'
import { useState, useEffect } from 'react'
import { apiGet } from '@/lib/api'

interface DayData { day: string; transactions: number; revenue: number }

export default function SalesChart({ detailed }: { detailed?: boolean }) {
  const [data, setData]     = useState<DayData[]>([])
  const [loading, setLoading] = useState(true)
  const [metric, setMetric] = useState<'revenue' | 'transactions'>('revenue')

  useEffect(() => {
    apiGet<DayData[]>('/reports/weekly')
      .then(rows => setData(rows.map(r => ({ ...r, day: new Date(r.day).toLocaleDateString('en-GH', { weekday: 'short' }) }))))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const maxVal = data.length > 0 ? Math.max(...data.map(d => Number(d[metric]))) : 1
  const total  = data.reduce((s, d) => s + Number(d[metric]), 0)

  return (
    <div className="card p-6 space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h3 className="font-semibold text-primary">{metric === 'revenue' ? 'Revenue Overview' : 'Transaction Volume'}</h3>
          <p className="text-xs text-muted mt-0.5">
            Total: {metric === 'revenue' ? `GHS ${total.toLocaleString()}` : `${total} txns`}
          </p>
        </div>
        <div className="flex rounded-pos-md overflow-hidden border border-base">
          {(['revenue', 'transactions'] as const).map(m => (
            <button key={m} onClick={() => setMetric(m)}
              className="px-3 py-1.5 text-xs font-medium capitalize transition-pos"
              style={{ backgroundColor: metric === m ? 'var(--color-accent)' : 'transparent', color: metric === m ? 'white' : 'var(--color-text-secondary)' }}>
              {m === 'revenue' ? 'Revenue' : 'Transactions'}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="h-40 flex items-end gap-2">
          {Array.from({ length: 7 }).map((_, i) => (
            <div key={i} className="flex-1 rounded-t animate-pulse" style={{ height: `${30 + Math.random() * 70}%`, backgroundColor: 'var(--color-surface-3)' }}/>
          ))}
        </div>
      ) : (
        <div className="flex items-end gap-2 h-40 pt-4">
          {data.map((d, i) => {
            const val = Number(d[metric])
            const pct = maxVal > 0 ? (val / maxVal) * 100 : 0
            const isLast = i === data.length - 1
            return (
              <div key={d.day} className="flex-1 flex flex-col items-center gap-1.5 group">
                <div className="opacity-0 group-hover:opacity-100 transition-pos text-xs font-semibold text-center whitespace-nowrap" style={{ color: 'var(--color-accent)' }}>
                  {metric === 'revenue' ? `GHS ${val.toLocaleString()}` : val}
                </div>
                <div className="w-full flex-1 flex items-end">
                  <div className="w-full rounded-t transition-all duration-500" style={{
                    height: `${pct}%`, minHeight: '4px', borderRadius: '4px 4px 0 0',
                    backgroundColor: isLast ? 'var(--color-accent)' : 'color-mix(in srgb, var(--color-accent) 35%, var(--color-surface-3))',
                  }}/>
                </div>
                <span className="text-xs font-medium" style={{ color: isLast ? 'var(--color-accent)' : 'var(--color-text-muted)' }}>{d.day}</span>
              </div>
            )
          })}
        </div>
      )}

      <div className="flex items-center justify-between pt-2 border-t border-base text-xs text-muted">
        <span>Avg: <span className="font-semibold text-primary">{metric === 'revenue' ? `GHS ${data.length ? Math.round(total / data.length).toLocaleString() : 0}` : `${data.length ? Math.round(total / data.length) : 0} txns`}</span></span>
        <span>Peak: <span className="font-semibold text-primary">{metric === 'revenue' ? `GHS ${maxVal.toLocaleString()}` : `${maxVal} txns`}</span></span>
      </div>

      {detailed && data.length > 0 && (
        <div className="border-t border-base pt-4 overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="text-left">{['Day','Revenue','Transactions','Avg Order'].map(h => <th key={h} className="pb-2 text-xs font-semibold text-muted uppercase tracking-wider">{h}</th>)}</tr></thead>
            <tbody className="divide-y divide-base">
              {data.map(d => (
                <tr key={d.day} className="hover:bg-surface-2 transition-pos">
                  <td className="py-2.5 font-medium text-primary">{d.day}</td>
                  <td className="py-2.5 text-secondary">GHS {Number(d.revenue).toLocaleString()}</td>
                  <td className="py-2.5 text-secondary">{d.transactions}</td>
                  <td className="py-2.5 text-secondary">GHS {d.transactions > 0 ? (Number(d.revenue) / d.transactions).toFixed(2) : '0.00'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
