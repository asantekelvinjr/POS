'use client'

import { use } from 'react'
import ProductForm from '@/components/products/ProductForm'

export default function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-2 text-sm text-muted mb-2">
          <a href="/products" className="hover:text-accent transition-pos">Products</a>
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
          <span className="text-primary font-medium">Edit Product</span>
        </div>
        <h1 className="text-2xl font-bold text-primary" style={{ fontFamily: 'var(--font-display)' }}>
          Edit Product
        </h1>
        <p className="text-secondary mt-1">Update product details — changes save immediately</p>
      </div>
      <ProductForm mode="edit" productId={id} />
    </div>
  )
}
