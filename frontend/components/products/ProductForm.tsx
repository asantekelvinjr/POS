'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'

const CATEGORIES = ['Beverages', 'Food', 'Electronics', 'Clothing', 'Health', 'Household', 'Other']

interface ProductFormProps {
  mode: 'create' | 'edit'
  productId?: string
}

export default function ProductForm({ mode, productId }: ProductFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({
    name: '',
    category: 'Beverages',
    price: '',
    costPrice: '',
    barcode: '',
    description: '',
    quantity: '',
    reorderLevel: '10',
    supplierName: '',
    supplierPhone: '',
  })

  useEffect(() => {
    if (mode === 'edit' && productId) {
      setLoading(true)
      // Fetch product — mock for now
      setTimeout(() => {
        setForm({
          name: 'Milo 400g',
          category: 'Beverages',
          price: '12.00',
          costPrice: '8.50',
          barcode: '6001087014218',
          description: 'Chocolate malt drink',
          quantity: '84',
          reorderLevel: '20',
          supplierName: 'Nestlé Ghana',
          supplierPhone: '0302123456',
        })
        setLoading(false)
      }, 500)
    }
  }, [mode, productId])

  function update(field: string, value: string) {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    try {
      const url = mode === 'create' ? '/api/products' : `/api/products/${productId}`
      await fetch(url, {
        method: mode === 'create' ? 'POST' : 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      router.push('/products')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="card p-6 space-y-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="space-y-1.5">
            <div className="h-3 w-24 rounded animate-pulse" style={{ backgroundColor: 'var(--color-surface-3)' }} />
            <div className="h-10 rounded-pos-md animate-pulse" style={{ backgroundColor: 'var(--color-surface-3)' }} />
          </div>
        ))}
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main details */}
        <div className="lg:col-span-2 space-y-5 card p-6">
          <h2 className="font-semibold text-primary border-b border-base pb-3">Product Details</h2>

          <Input
            label="Product Name"
            value={form.name}
            onChange={e => update('name', e.target.value)}
            placeholder="e.g. Milo 400g"
            required
          />

          <div>
            <label className="block text-sm font-medium text-secondary mb-1.5">Category <span className="text-danger">*</span></label>
            <select
              value={form.category}
              onChange={e => update('category', e.target.value)}
              className="w-full input-pos px-3 py-2.5 text-sm"
              required
            >
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Selling Price (GHS)"
              type="number"
              min="0"
              step="0.01"
              value={form.price}
              onChange={e => update('price', e.target.value)}
              placeholder="0.00"
              required
            />
            <Input
              label="Cost Price (GHS)"
              type="number"
              min="0"
              step="0.01"
              value={form.costPrice}
              onChange={e => update('costPrice', e.target.value)}
              placeholder="0.00"
              hint="Used for profit reports"
            />
          </div>

          <Input
            label="Barcode"
            value={form.barcode}
            onChange={e => update('barcode', e.target.value)}
            placeholder="Scan or type barcode"
            prefix={
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 013.75 9.375v-4.5z" />
              </svg>
            }
          />

          <div>
            <label className="block text-sm font-medium text-secondary mb-1.5">Description</label>
            <textarea
              value={form.description}
              onChange={e => update('description', e.target.value)}
              placeholder="Optional product description…"
              rows={3}
              className="w-full input-pos px-3 py-2.5 text-sm resize-none"
            />
          </div>
        </div>

        {/* Inventory & supplier */}
        <div className="space-y-5">
          <div className="card p-5 space-y-4">
            <h3 className="font-semibold text-primary text-sm border-b border-base pb-3">Stock</h3>
            <Input
              label="Current Stock Quantity"
              type="number"
              min="0"
              value={form.quantity}
              onChange={e => update('quantity', e.target.value)}
              placeholder="0"
            />
            <Input
              label="Reorder Level"
              type="number"
              min="0"
              value={form.reorderLevel}
              onChange={e => update('reorderLevel', e.target.value)}
              hint="Alert when stock drops below this"
            />
          </div>

          <div className="card p-5 space-y-4">
            <h3 className="font-semibold text-primary text-sm border-b border-base pb-3">Supplier</h3>
            <Input
              label="Supplier Name"
              value={form.supplierName}
              onChange={e => update('supplierName', e.target.value)}
              placeholder="e.g. Nestlé Ghana"
            />
            <Input
              label="Supplier Phone"
              value={form.supplierPhone}
              onChange={e => update('supplierPhone', e.target.value)}
              placeholder="0302123456"
            />
          </div>

          <div className="flex gap-3">
            <Button variant="ghost" fullWidth href="/products">Cancel</Button>
            <Button variant="accent" type="submit" fullWidth loading={saving}>
              {mode === 'create' ? 'Create Product' : 'Save Changes'}
            </Button>
          </div>
        </div>
      </div>
    </form>
  )
}
