'use client'
import { useInventory } from '@/hooks/useInventory'
import Badge from '@/components/ui/Badge'

interface StockTableProps { search?: string; filter?: 'all' | 'low' | 'out'; compact?: boolean }

export default function StockTable({ search = '', filter = 'all', compact }: StockTableProps) {
  const { inventory, loading } = useInventory()

  const filtered = inventory.filter(s => {
    const matchSearch = s.product_name.toLowerCase().includes(search.toLowerCase())
    const matchFilter = filter === 'all' ? true : filter === 'low' ? (s.quantity_in_stock > 0 && s.quantity_in_stock <= s.reorder_level) : s.quantity_in_stock === 0
    return matchSearch && matchFilter
  })

  function stockStatus(qty: number, reorder: number): 'success' | 'warning' | 'danger' {
    if (qty === 0) return 'danger'
    if (qty <= reorder) return 'warning'
    return 'success'
  }

  return (
    <div className="card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-surface-2 text-left">
              {['Product', 'Category', 'In Stock', 'Reorder At', ...(compact ? [] : ['Supplier', 'Last Restocked']), 'Status'].map(h => (
                <th key={h} className="px-6 py-3 text-xs font-semibold text-muted uppercase tracking-wider whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-base">
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i}>{Array.from({ length: compact ? 5 : 7 }).map((_, j) => (
                  <td key={j} className="px-6 py-4"><div className="h-4 rounded animate-pulse" style={{ backgroundColor: 'var(--color-surface-3)', width: '70%' }}/></td>
                ))}</tr>
              ))
            ) : filtered.length === 0 ? (
              <tr><td colSpan={compact ? 5 : 7} className="px-6 py-10 text-center text-muted">No items match your filters</td></tr>
            ) : filtered.map(item => {
              const status = stockStatus(item.quantity_in_stock, item.reorder_level)
              return (
                <tr key={item.product_id} className="hover:bg-surface-2 transition-pos">
                  <td className="px-6 py-4 font-medium text-primary">{item.product_name}</td>
                  <td className="px-6 py-4 text-secondary">{item.category}</td>
                  <td className="px-6 py-4 font-semibold" style={{ color: status === 'danger' ? 'var(--color-danger)' : status === 'warning' ? 'var(--color-highlight)' : 'var(--color-success)' }}>
                    {item.quantity_in_stock}
                  </td>
                  <td className="px-6 py-4 text-secondary">{item.reorder_level}</td>
                  {!compact && <td className="px-6 py-4 text-secondary">{item.supplier_name || '—'}</td>}
                  {!compact && <td className="px-6 py-4 text-muted text-xs">{item.last_restocked_at ? new Date(item.last_restocked_at).toLocaleDateString('en-GH') : '—'}</td>}
                  <td className="px-6 py-4">
                    <Badge variant={status}>{status === 'danger' ? 'Out of stock' : status === 'warning' ? 'Low stock' : 'In stock'}</Badge>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
