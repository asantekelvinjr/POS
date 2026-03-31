'use client'
import StockTable from '@/components/inventory/StockTable'
import { useInventory } from '@/hooks/useInventory'

export default function InventoryReportPage() {
  const { inventory, loading, lowStockItems, outOfStockItems } = useInventory()

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-2 text-sm text-muted mb-2">
          <a href="/reports" className="hover:text-accent transition-pos">Reports</a>
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/></svg>
          <span className="text-primary font-medium">Inventory Report</span>
        </div>
        <h1 className="text-2xl font-bold text-primary" style={{ fontFamily: 'var(--font-display)' }}>Inventory Report</h1>
        <p className="text-secondary mt-1">Full stock levels, suppliers and reorder status</p>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Products', value: loading ? '…' : inventory.length,                                                              color: 'accent' },
          { label: 'In Stock',       value: loading ? '…' : inventory.filter(i => i.quantity_in_stock > i.reorder_level).length,           color: 'success' },
          { label: 'Low Stock',      value: loading ? '…' : lowStockItems.length,                                                          color: 'highlight' },
          { label: 'Out of Stock',   value: loading ? '…' : outOfStockItems.length,                                                        color: 'danger' },
        ].map(s => (
          <div key={s.label} className="card p-4 text-center">
            <p className="text-2xl font-bold" style={{ color: `var(--color-${s.color})` }}>{s.value}</p>
            <p className="text-xs text-secondary mt-1 font-medium">{s.label}</p>
          </div>
        ))}
      </div>

      <StockTable />
    </div>
  )
}
