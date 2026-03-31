'use client'
import { useRef, useState } from 'react'
import { useCart } from '@/hooks/useCart'
import { apiGet } from '@/lib/api'
import { Product } from '@/types/product'

export default function BarcodeInput() {
  const inputRef      = useRef<HTMLInputElement>(null)
  const [barcode, setBarcode] = useState('')
  const [error, setError]     = useState('')
  const [scanning, setScanning] = useState(false)
  const { addItem }   = useCart()

  async function handleScan(e: React.FormEvent) {
    e.preventDefault()
    if (!barcode.trim()) return
    setScanning(true)
    setError('')
    try {
      // backend returns array with one item when ?barcode= is used
      const results = await apiGet<Product[]>(`/products?barcode=${encodeURIComponent(barcode.trim())}`)
      const product = Array.isArray(results) ? results[0] : results
      if (product) {
        addItem(product)
        setBarcode('')
      } else {
        setError('Not found')
        setTimeout(() => setError(''), 2000)
      }
    } catch {
      setError('Not found')
      setTimeout(() => setError(''), 2000)
    } finally {
      setScanning(false)
      inputRef.current?.focus()
    }
  }

  return (
    <form onSubmit={handleScan} className="flex items-center gap-2">
      <div className="relative">
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 013.75 9.375v-4.5zM3.75 14.625c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5a1.125 1.125 0 01-1.125-1.125v-4.5zM13.5 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 0113.5 9.375v-4.5z"/>
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
        {scanning && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <svg className="w-3.5 h-3.5 animate-spin text-muted" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
            </svg>
          </div>
        )}
      </div>
      {error && <span className="text-xs text-danger font-medium">{error}</span>}
    </form>
  )
}
