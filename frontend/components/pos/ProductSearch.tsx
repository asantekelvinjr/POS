'use client'
import { useState, useEffect } from 'react'
import { useProducts } from '@/hooks/useProducts'
import { useCart } from '@/hooks/useCart'
import Input from '@/components/ui/Input'

const CATEGORIES = ['All', 'Beverages', 'Food', 'Electronics', 'Clothing', 'Health', 'Household']

function ProductSearchBar() {
  const [search, setSearch] = useState('')
  const { searchProducts, refetch } = useProducts()

  useEffect(() => {
    const timer = setTimeout(() => {
      if (search.trim().length >= 2) searchProducts(search)
      else if (search === '') refetch()
    }, 300)
    return () => clearTimeout(timer)
  }, [search])

  return (
    <div className="flex-1">
      <Input
        placeholder="Search products by name…"
        value={search}
        onChange={e => setSearch(e.target.value)}
        prefix={<svg className="w-4 h-4 text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"/></svg>}
      />
    </div>
  )
}

function ProductGrid() {
  const { products, loading } = useProducts()
  const { addItem }           = useCart()
  const [activeCategory, setActiveCategory] = useState('All')

  const filtered = activeCategory === 'All' ? products : products.filter(p => p.category === activeCategory)

  return (
    <div className="space-y-4">
      <div className="flex gap-2 overflow-x-auto pb-1">
        {CATEGORIES.map(cat => (
          <button key={cat} onClick={() => setActiveCategory(cat)}
            className="shrink-0 px-3.5 py-1.5 rounded-full text-sm font-medium transition-pos"
            style={{ backgroundColor: activeCategory === cat ? 'var(--color-accent)' : 'var(--color-surface)', color: activeCategory === cat ? 'white' : 'var(--color-text-secondary)', border: `1px solid ${activeCategory === cat ? 'transparent' : 'var(--color-border)'}` }}>
            {cat}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-3">
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="card p-3 space-y-2">
              <div className="w-full aspect-square rounded-pos-md animate-pulse" style={{ backgroundColor: 'var(--color-surface-3)' }}/>
              <div className="h-3 rounded animate-pulse" style={{ backgroundColor: 'var(--color-surface-3)', width: '80%' }}/>
              <div className="h-3 rounded animate-pulse" style={{ backgroundColor: 'var(--color-surface-3)', width: '50%' }}/>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-3">
          {filtered.map(product => (
            <button key={product.id} onClick={() => addItem(product)} disabled={product.quantity === 0}
              className="card p-3 text-left hover:shadow-elevated transition-pos disabled:opacity-50 disabled:cursor-not-allowed group"
              style={{ cursor: product.quantity === 0 ? 'not-allowed' : 'pointer' }}>
              <div className="w-full aspect-square rounded-pos-md flex items-center justify-center mb-2 text-2xl font-bold group-hover:scale-105 transition-pos" style={{ backgroundColor: 'var(--color-accent-light)', color: 'var(--color-accent)' }}>
                {product.name[0]}
              </div>
              <p className="text-xs font-semibold text-primary line-clamp-2 leading-tight">{product.name}</p>
              <p className="text-xs text-secondary mt-0.5">{product.category}</p>
              <div className="flex items-center justify-between mt-1.5">
                <p className="text-sm font-bold" style={{ color: 'var(--color-accent)' }}>GHS {Number(product.price).toFixed(2)}</p>
                {product.quantity <= 5 && product.quantity > 0 && <span className="text-xs" style={{ color: 'var(--color-highlight)' }}>{product.quantity} left</span>}
                {product.quantity === 0 && <span className="text-xs text-danger">Out</span>}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

const ProductSearch = Object.assign(ProductSearchBar, { Grid: ProductGrid })
export default ProductSearch
