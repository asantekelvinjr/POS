'use client'

import { useState } from 'react'
import StockTable from '@/components/inventory/StockTable'
import LowStockAlert from '@/components/inventory/LowStockAlert'
import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'

export default function InventoryPage() {
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<'all' | 'low' | 'out'>('all')

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-primary" style={{ fontFamily: 'var(--font-display)' }}>
            Inventory
          </h1>
          <p className="text-secondary mt-1">Track and manage your stock levels</p>
        </div>
        <Button variant="accent" size="sm">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
          </svg>
          Adjust Stock
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Products', value: '248', color: 'accent' },
          { label: 'In Stock', value: '201', color: 'success' },
          { label: 'Low Stock', value: '32', color: 'highlight' },
          { label: 'Out of Stock', value: '15', color: 'danger' },
        ].map(s => (
          <div key={s.label} className="card p-4 text-center">
            <p
              className="text-2xl font-bold"
              style={{
                color: s.color === 'accent' ? 'var(--color-accent)' :
                  s.color === 'success' ? 'var(--color-success)' :
                  s.color === 'highlight' ? 'var(--color-highlight)' :
                  'var(--color-danger)'
              }}
            >
              {s.value}
            </p>
            <p className="text-xs text-secondary mt-1 font-medium">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        {/* Main stock table */}
        <div className="xl:col-span-3 space-y-4">
          <div className="card p-4 flex flex-col sm:flex-row gap-3">
            <div className="flex-1">
              <Input
                placeholder="Search products…"
                value={search}
                onChange={e => setSearch(e.target.value)}
                prefix={
                  <svg className="w-4 h-4 text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                  </svg>
                }
              />
            </div>
            <div className="flex gap-2">
              {(['all', 'low', 'out'] as const).map(f => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className="px-3.5 py-2 rounded-pos-md text-sm font-medium capitalize transition-pos"
                  style={{
                    backgroundColor: filter === f ? 'var(--color-accent)' : 'var(--color-surface-2)',
                    color: filter === f ? 'white' : 'var(--color-text-secondary)',
                  }}
                >
                  {f === 'all' ? 'All' : f === 'low' ? 'Low Stock' : 'Out of Stock'}
                </button>
              ))}
            </div>
          </div>
          <StockTable search={search} filter={filter} />
        </div>

        {/* Low stock sidebar */}
        <div>
          <LowStockAlert compact />
        </div>
      </div>
    </div>
  )
}
