'use client'

import { useState, useEffect } from 'react'
import { useProducts } from '@/hooks/useProducts'
import ProductTable from '@/components/products/ProductTable'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Badge from '@/components/ui/Badge'

const CATEGORIES = ['All', 'Beverages', 'Food', 'Electronics', 'Clothing', 'Health', 'Household']

export default function ProductsPage() {
  const { products, loading } = useProducts()
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('All')

  const filtered = products.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.barcode?.includes(search)
    const matchCat = category === 'All' || p.category === category
    return matchSearch && matchCat
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-primary" style={{ fontFamily: 'var(--font-display)' }}>
            Products
          </h1>
          <p className="text-secondary mt-1">
            {products.length} products across {CATEGORIES.length - 1} categories
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
            </svg>
            Export
          </Button>
          <Button variant="accent" size="sm" href="/products/new">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            Add Product
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="card p-4 space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1">
            <Input
              placeholder="Search by name or barcode…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              prefix={
                <svg className="w-4 h-4 text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                </svg>
              }
            />
          </div>
        </div>

        {/* Category pills */}
        <div className="flex gap-2 flex-wrap">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className="px-3.5 py-1.5 rounded-full text-sm font-medium transition-pos"
              style={{
                backgroundColor: category === cat ? 'var(--color-accent)' : 'var(--color-surface-2)',
                color: category === cat ? 'white' : 'var(--color-text-secondary)',
              }}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Results info */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-secondary">
          Showing <span className="font-semibold text-primary">{filtered.length}</span> of {products.length} products
        </p>
        <div className="flex items-center gap-2">
          <Badge variant="success">{products.filter(p => p.quantity > 10).length} In stock</Badge>
          <Badge variant="warning">{products.filter(p => p.quantity <= 10 && p.quantity > 0).length} Low stock</Badge>
          <Badge variant="danger">{products.filter(p => p.quantity === 0).length} Out of stock</Badge>
        </div>
      </div>

      {/* Table */}
      <ProductTable products={filtered} loading={loading} />
    </div>
  )
}
