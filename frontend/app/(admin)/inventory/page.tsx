'use client'
import { useState } from 'react'
import { useInventory } from '@/hooks/useInventory'
import StockTable from '@/components/inventory/StockTable'
import LowStockAlert from '@/components/inventory/LowStockAlert'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Modal from '@/components/ui/Modal'

export default function InventoryPage() {
  const { inventory, loading, adjustStock } = useInventory()
  const [search, setSearch]   = useState('')
  const [filter, setFilter]   = useState<'all' | 'low' | 'out'>('all')
  const [adjustModal, setAdjustModal] = useState(false)
  const [selected, setSelected]       = useState<{ productId: number; name: string; current: number } | null>(null)
  const [newQty, setNewQty]           = useState('')
  const [saving, setSaving]           = useState(false)

  async function handleAdjust() {
    if (!selected) return
    setSaving(true)
    try {
      await adjustStock(selected.productId, parseInt(newQty), 'Manual adjustment')
      setAdjustModal(false)
      setSelected(null)
      setNewQty('')
    } catch (e) {
      alert(e instanceof Error ? e.message : 'Failed')
    } finally {
      setSaving(false)
    }
  }

  const inStock  = inventory.filter(i => i.quantity_in_stock > i.reorder_level).length
  const low      = inventory.filter(i => i.quantity_in_stock <= i.reorder_level && i.quantity_in_stock > 0).length
  const out      = inventory.filter(i => i.quantity_in_stock === 0).length

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-primary" style={{ fontFamily: 'var(--font-display)' }}>Inventory</h1>
          <p className="text-secondary mt-1">Track and manage your stock levels</p>
        </div>
        <Button variant="accent" size="sm" onClick={() => setAdjustModal(true)}>
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99"/></svg>
          Adjust Stock
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Products', value: loading ? '…' : inventory.length, color: 'accent' },
          { label: 'In Stock',       value: loading ? '…' : inStock,           color: 'success' },
          { label: 'Low Stock',      value: loading ? '…' : low,               color: 'highlight' },
          { label: 'Out of Stock',   value: loading ? '…' : out,               color: 'danger' },
        ].map(s => (
          <div key={s.label} className="card p-4 text-center">
            <p className="text-2xl font-bold" style={{ color: `var(--color-${s.color})` }}>{s.value}</p>
            <p className="text-xs text-secondary mt-1 font-medium">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        <div className="xl:col-span-3 space-y-4">
          <div className="card p-4 flex flex-col sm:flex-row gap-3">
            <div className="flex-1">
              <Input placeholder="Search products…" value={search} onChange={e => setSearch(e.target.value)}
                prefix={<svg className="w-4 h-4 text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"/></svg>}
              />
            </div>
            <div className="flex gap-2">
              {(['all', 'low', 'out'] as const).map(f => (
                <button key={f} onClick={() => setFilter(f)}
                  className="px-3.5 py-2 rounded-pos-md text-sm font-medium capitalize transition-pos"
                  style={{ backgroundColor: filter === f ? 'var(--color-accent)' : 'var(--color-surface-2)', color: filter === f ? 'white' : 'var(--color-text-secondary)' }}>
                  {f === 'all' ? 'All' : f === 'low' ? 'Low Stock' : 'Out of Stock'}
                </button>
              ))}
            </div>
          </div>
          <StockTable search={search} filter={filter} />
        </div>
        <div><LowStockAlert compact /></div>
      </div>

      {/* Adjust stock modal */}
      <Modal open={adjustModal} onClose={() => setAdjustModal(false)} title="Adjust Stock">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-secondary mb-1.5">Select Product</label>
            <select
              className="w-full input-pos px-3 py-2.5 text-sm"
              value={selected?.productId || ''}
              onChange={e => {
                const item = inventory.find(i => i.product_id === parseInt(e.target.value))
                if (item) { setSelected({ productId: item.product_id, name: item.product_name, current: item.quantity_in_stock }); setNewQty(String(item.quantity_in_stock)) }
              }}
            >
              <option value="">— Choose product —</option>
              {inventory.map(i => (
                <option key={i.product_id} value={i.product_id}>{i.product_name} (current: {i.quantity_in_stock})</option>
              ))}
            </select>
          </div>
          {selected && (
            <Input label="New Stock Quantity" type="number" min="0" value={newQty} onChange={e => setNewQty(e.target.value)}
              hint={`Current: ${selected.current} units`}/>
          )}
          <div className="flex gap-3 pt-2">
            <Button variant="ghost" fullWidth onClick={() => setAdjustModal(false)}>Cancel</Button>
            <Button variant="accent" fullWidth loading={saving} disabled={!selected || !newQty} onClick={handleAdjust}>
              Update Stock
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
