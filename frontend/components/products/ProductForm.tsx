'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import { apiGet, apiPost, apiPut } from '@/lib/api'
import { Product } from '@/types/product'

const CATEGORIES = ['Beverages', 'Food', 'Electronics', 'Clothing', 'Health', 'Household', 'Other']

interface ProductFormProps { mode: 'create' | 'edit'; productId?: string }

export default function ProductForm({ mode, productId }: ProductFormProps) {
  const router  = useRouter()
  const [loading, setLoading] = useState(false)
  const [saving, setSaving]   = useState(false)
  const [error, setError]     = useState('')
  const [form, setForm] = useState({
    name: '', category: 'Beverages', price: '', costPrice: '', barcode: '',
    description: '', quantity: '', reorderLevel: '10', supplierName: '', supplierPhone: '',
  })

  useEffect(() => {
    if (mode === 'edit' && productId) {
      setLoading(true)
      apiGet<Product & { quantity: number; reorder_level: number; supplier_name: string; supplier_phone: string }>(`/products/${productId}`)
        .then(p => setForm({
          name: p.name, category: p.category,
          price: String(p.price), costPrice: p.costPrice ? String(p.costPrice) : '',
          barcode: p.barcode || '', description: p.description || '',
          quantity: String(p.quantity || 0), reorderLevel: String(p.reorder_level || 10),
          supplierName: p.supplier_name || '', supplierPhone: p.supplier_phone || '',
        }))
        .catch(() => setError('Failed to load product'))
        .finally(() => setLoading(false))
    }
  }, [mode, productId])

  function update(field: string, value: string) { setForm(prev => ({ ...prev, [field]: value })) }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setSaving(true)
    try {
      const body = {
        name: form.name, category: form.category,
        price: parseFloat(form.price),
        costPrice: form.costPrice ? parseFloat(form.costPrice) : undefined,
        barcode: form.barcode || undefined,
        description: form.description || undefined,
        quantity: parseInt(form.quantity || '0'),
        reorderLevel: parseInt(form.reorderLevel || '10'),
        supplierName: form.supplierName || undefined,
        supplierPhone: form.supplierPhone || undefined,
      }
      if (mode === 'create') await apiPost('/products', body)
      else await apiPut(`/products/${productId}`, body)
      router.push('/products')
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to save product')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="card p-6 space-y-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="space-y-1.5">
            <div className="h-3 w-24 rounded animate-pulse" style={{ backgroundColor: 'var(--color-surface-3)' }}/>
            <div className="h-10 rounded-pos-md animate-pulse" style={{ backgroundColor: 'var(--color-surface-3)' }}/>
          </div>
        ))}
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit}>
      {error && (
        <div className="mb-4 p-3.5 rounded-pos-md text-sm flex items-center gap-2" style={{ backgroundColor: 'var(--color-danger-light)', color: 'var(--color-danger)' }}>
          <svg className="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clipRule="evenodd"/></svg>
          {error}
        </div>
      )}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-5 card p-6">
          <h2 className="font-semibold text-primary border-b border-base pb-3">Product Details</h2>
          <Input label="Product Name" value={form.name} onChange={e => update('name', e.target.value)} placeholder="e.g. Milo 400g" required/>
          <div>
            <label className="block text-sm font-medium text-secondary mb-1.5">Category <span className="text-danger">*</span></label>
            <select value={form.category} onChange={e => update('category', e.target.value)} className="w-full input-pos px-3 py-2.5 text-sm" required>
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input label="Selling Price (GHS)" type="number" min="0" step="0.01" value={form.price} onChange={e => update('price', e.target.value)} placeholder="0.00" required/>
            <Input label="Cost Price (GHS)" type="number" min="0" step="0.01" value={form.costPrice} onChange={e => update('costPrice', e.target.value)} placeholder="0.00" hint="For profit reports"/>
          </div>
          <Input label="Barcode" value={form.barcode} onChange={e => update('barcode', e.target.value)} placeholder="Scan or type barcode"/>
          <div>
            <label className="block text-sm font-medium text-secondary mb-1.5">Description</label>
            <textarea value={form.description} onChange={e => update('description', e.target.value)} placeholder="Optional product description…" rows={3} className="w-full input-pos px-3 py-2.5 text-sm resize-none"/>
          </div>
        </div>
        <div className="space-y-5">
          <div className="card p-5 space-y-4">
            <h3 className="font-semibold text-primary text-sm border-b border-base pb-3">Stock</h3>
            <Input label="Current Stock Quantity" type="number" min="0" value={form.quantity} onChange={e => update('quantity', e.target.value)} placeholder="0"/>
            <Input label="Reorder Level" type="number" min="0" value={form.reorderLevel} onChange={e => update('reorderLevel', e.target.value)} hint="Alert when stock drops below this"/>
          </div>
          <div className="card p-5 space-y-4">
            <h3 className="font-semibold text-primary text-sm border-b border-base pb-3">Supplier</h3>
            <Input label="Supplier Name" value={form.supplierName} onChange={e => update('supplierName', e.target.value)} placeholder="e.g. Nestlé Ghana"/>
            <Input label="Supplier Phone" value={form.supplierPhone} onChange={e => update('supplierPhone', e.target.value)} placeholder="0302123456"/>
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
