'use client'

import Badge from '@/components/ui/Badge'

const mockStock = [
  { id: 1, name: 'Milo 400g', category: 'Beverages', qty: 84, reorder: 20, supplier: 'Nestlé Ghana', lastRestocked: '2024-04-10' },
  { id: 2, name: 'Fanta 500ml', category: 'Beverages', qty: 12, reorder: 30, supplier: 'Coca-Cola GH', lastRestocked: '2024-04-08' },
  { id: 3, name: 'Mentos Roll', category: 'Food', qty: 5, reorder: 50, supplier: 'Van Melle', lastRestocked: '2024-04-05' },
  { id: 4, name: 'Indomie Chicken', category: 'Food', qty: 210, reorder: 100, supplier: 'Dufil Ghana', lastRestocked: '2024-04-12' },
  { id: 5, name: 'Paracetamol 500mg', category: 'Health', qty: 0, reorder: 200, supplier: 'Ernest Chemists', lastRestocked: '2024-03-30' },
  { id: 6, name: 'Fair & White Cream', category: 'Health', qty: 18, reorder: 25, supplier: 'D&H Pharma', lastRestocked: '2024-04-01' },
]

interface StockTableProps {
  search?: string
  filter?: 'all' | 'low' | 'out'
  compact?: boolean
}

export default function StockTable({ search = '', filter = 'all', compact }: StockTableProps) {
  const filtered = mockStock.filter(s => {
    const matchSearch = s.name.toLowerCase().includes(search.toLowerCase())
    const matchFilter =
      filter === 'all' ? true :
      filter === 'low' ? (s.qty > 0 && s.qty <= s.reorder) :
      s.qty === 0
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
                <th key={h} className="px-6 py-3 text-xs font-semibold text-muted uppercase tracking-wider whitespace-nowrap">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-base">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-10 text-center text-muted">
                  No items match your filters
                </td>
              </tr>
            ) : (
              filtered.map(item => {
                const status = stockStatus(item.qty, item.reorder)
                return (
                  <tr key={item.id} className="hover:bg-surface-2 transition-pos">
                    <td className="px-6 py-4 font-medium text-primary">{item.name}</td>
                    <td className="px-6 py-4 text-secondary">{item.category}</td>
                    <td className="px-6 py-4 font-semibold" style={{
                      color: status === 'danger' ? 'var(--color-danger)' :
                        status === 'warning' ? 'var(--color-highlight)' : 'var(--color-success)'
                    }}>
                      {item.qty}
                    </td>
                    <td className="px-6 py-4 text-secondary">{item.reorder}</td>
                    {!compact && <td className="px-6 py-4 text-secondary">{item.supplier}</td>}
                    {!compact && <td className="px-6 py-4 text-muted text-xs">{item.lastRestocked}</td>}
                    <td className="px-6 py-4">
                      <Badge variant={status}>
                        {status === 'danger' ? 'Out of stock' :
                          status === 'warning' ? 'Low stock' : 'In stock'}
                      </Badge>
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
