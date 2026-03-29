'use client'

import ProductForm from '@/components/products/ProductForm'

export default function NewProductPage() {
  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-2 text-sm text-muted mb-2">
          <a href="/products" className="hover:text-accent transition-pos">Products</a>
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
          <span className="text-primary font-medium">Add New</span>
        </div>
        <h1 className="text-2xl font-bold text-primary" style={{ fontFamily: 'var(--font-display)' }}>
          Add New Product
        </h1>
        <p className="text-secondary mt-1">Fill in the product details below</p>
      </div>
      <ProductForm mode="create" />
    </div>
  )
}
