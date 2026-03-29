'use client'

import { useRef, useState } from 'react'
import { useCart } from '@/hooks/useCart'
import { useProducts } from '@/hooks/useProducts'

export default function BarcodeInput() {
  const inputRef = useRef<HTMLInputElement>(null)
  const [barcode, setBarcode] = useState('')
  const [error, setError] = useState('')
  const { products } = useProducts()
  const { addItem } = useCart()

  function handleScan(e: React.FormEvent) {
    e.preventDefault()
    if (!barcode.trim()) return

    const product = products.find(p => p.barcode === barcode.trim())
    if (product) {
      addItem(product)
      setBarcode('')
      setError('')
    } else {
      setError('Product not found')
      setTimeout(() => setError(''), 2000)
    }
    inputRef.current?.focus()
  }

  return (
    <form onSubmit={handleScan} className="flex items-center gap-2">
      <div className="relative">
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 013.75 9.375v-4.5zM3.75 14.625c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5a1.125 1.125 0 01-1.125-1.125v-4.5zM13.5 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 0113.5 9.375v-4.5z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 6.75h.75v.75h-.75v-.75zM6.75 16.5h.75v.75h-.75v-.75zM16.5 6.75h.75v.75h-.75v-.75zM13.5 13.5h.75v.75h-.75v-.75zM13.5 19.5h.75v.75h-.75v-.75zM19.5 13.5h.75v.75h-.75v-.75zM19.5 19.5h.75v.75h-.75v-.75zM16.5 16.5h.75v.75h-.75v-.75z" />
          </svg>
        </div>
        <input
          ref={inputRef}
          value={barcode}
          onChange={e => setBarcode(e.target.value)}
          placeholder="Scan barcode…"
          className="input-pos pl-9 pr-3 py-2.5 text-sm w-44"
          style={{ borderColor: error ? 'var(--color-danger)' : undefined }}
          autoFocus
        />
      </div>
    </form>
  )
}
