'use client'
import { useEffect, useState } from 'react'
import { apiGet } from '@/lib/api'

interface LowStockItem { product_id: number; product_name: string; quantity_in_stock: number; reorder_level: number }

export default function LowStockAlert({ compact }: { compact?: boolean }) {
  const [items, setItems]     = useState<LowStockItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    apiGet<LowStockItem[]>('/inventory/low-stock')
      .then(data => setItems(data.slice(0, 7)))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="card overflow-hidden h-full">
      <div className="px-5 py-4 border-b border-base flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: 'var(--color-danger)' }}/>
          <h3 className="font-semibold text-primary text-sm">Low Stock Alerts</h3>
        </div>
        <a href="/inventory" className="text-xs text-accent hover:underline font-medium">View all</a>
      </div>
      <div className="divide-y divide-base">
        {loading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="px-5 py-3.5">
              <div className="h-3 rounded animate-pulse mb-2" style={{ backgroundColor: 'var(--color-surface-3)', width: '60%' }}/>
              <div className="h-2 rounded animate-pulse" style={{ backgroundColor: 'var(--color-surface-3)' }}/>
            </div>
          ))
        ) : items.length === 0 ? (
          <div className="px-5 py-8 text-center">
            <p className="text-sm font-medium text-success">✅ All stock levels are healthy</p>
          </div>
        ) : items.map(item => {
          const pct    = Math.min(100, Math.round((item.quantity_in_stock / item.reorder_level) * 100))
          const isOut  = item.quantity_in_stock === 0
          return (
            <div key={item.product_id} className="px-5 py-3.5">
              <div className="flex items-center justify-between mb-1.5">
                <p className="text-sm font-medium text-primary">{item.product_name}</p>
                <span className="text-xs font-semibold" style={{ color: isOut ? 'var(--color-danger)' : 'var(--color-highlight)' }}>
                  {isOut ? 'Out' : `${item.quantity_in_stock} left`}
                </span>
              </div>
              <div className="h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: 'var(--color-surface-3)' }}>
                <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, backgroundColor: isOut ? 'var(--color-danger)' : 'var(--color-highlight)' }}/>
              </div>
              {!compact && <p className="text-xs text-muted mt-1">Reorder at {item.reorder_level} units</p>}
            </div>
          )
        })}
      </div>
    </div>
  )
}
