'use client'
import { useState, useEffect } from 'react'
import { apiGet } from '@/lib/api'

interface PaymentBreakdown { payment_method: string; transactions: number; total: number; percentage: number }

export default function SalesSummary({ detailed }: { detailed?: boolean }) {
  const [breakdown, setBreakdown] = useState<PaymentBreakdown[]>([])
  const [loading, setLoading]     = useState(true)

  useEffect(() => {
    apiGet<PaymentBreakdown[]>('/reports/payment-breakdown?days=1')
      .then(setBreakdown)
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const methodLabel: Record<string, string> = { cash: 'Cash', momo: 'Mobile Money', card: 'Card' }
  const methodIcon:  Record<string, string> = { cash: '💵', momo: '📱', card: '💳' }
  const colorMap:    Record<string, string> = { cash: 'var(--color-success)', momo: 'var(--color-accent)', card: 'var(--color-info)' }
  const bgMap:       Record<string, string> = { cash: 'var(--color-success-light)', momo: 'var(--color-accent-light)', card: 'var(--color-info-light)' }

  const allMethods = ['cash', 'momo', 'card'].map(m => {
    const found = breakdown.find(b => b.payment_method === m)
    return { method: m, transactions: found?.transactions || 0, total: found?.total || 0, percentage: found?.percentage || 0 }
  })

  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-primary">{detailed ? 'Payment Method Breakdown' : 'Sales by Payment Method'}</h3>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {loading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="card p-5">
              <div className="h-4 rounded animate-pulse mb-3" style={{ backgroundColor: 'var(--color-surface-3)', width: '60%' }}/>
              <div className="h-7 rounded animate-pulse mb-2" style={{ backgroundColor: 'var(--color-surface-3)', width: '80%' }}/>
              <div className="h-3 rounded animate-pulse" style={{ backgroundColor: 'var(--color-surface-3)', width: '40%' }}/>
            </div>
          ))
        ) : allMethods.map(item => (
          <div key={item.method} className="card p-5">
            <div className="flex items-start justify-between mb-3">
              <p className="text-sm font-medium text-secondary">{methodLabel[item.method]}</p>
              <span className="text-lg">{methodIcon[item.method]}</span>
            </div>
            <p className="text-xl font-bold text-primary mb-1">GHS {Number(item.total).toFixed(2)}</p>
            <div className="flex items-center gap-1.5 mb-3">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: colorMap[item.method] }}/>
              <p className="text-xs text-muted">{item.transactions} transactions · {Number(item.percentage).toFixed(1)}%</p>
            </div>
            <div className="h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: 'var(--color-surface-3)' }}>
              <div className="h-full rounded-full transition-all" style={{ width: `${item.percentage}%`, backgroundColor: colorMap[item.method] }}/>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
