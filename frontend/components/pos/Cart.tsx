'use client'

import { useCart } from '@/hooks/useCart'

export default function Cart() {
  const { cartItems, updateQty, removeItem } = useCart()

  if (cartItems.length === 0) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-center py-12">
        <div
          className="w-16 h-16 rounded-full flex items-center justify-center mb-4"
          style={{ backgroundColor: 'var(--color-surface-2)' }}
        >
          <svg className="w-7 h-7 text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
          </svg>
        </div>
        <p className="text-sm font-medium text-secondary">Cart is empty</p>
        <p className="text-xs text-muted mt-1">Scan a barcode or search for a product</p>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      {cartItems.map(item => (
        <div
          key={item.id}
          className="flex items-start gap-3 p-3 rounded-pos-md transition-pos"
          style={{ backgroundColor: 'var(--color-surface-2)' }}
        >
          {/* Product color dot */}
          <div
            className="w-8 h-8 rounded-pos-sm flex items-center justify-center text-xs font-bold text-white shrink-0 mt-0.5"
            style={{ backgroundColor: 'var(--color-accent)' }}
          >
            {item.name[0]}
          </div>

          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-primary truncate">{item.name}</p>
            <p className="text-xs text-secondary mt-0.5">GHS {item.price.toFixed(2)} each</p>

            {/* Qty controls */}
            <div className="flex items-center gap-2 mt-2">
              <button
                onClick={() => updateQty(item.id, item.quantity - 1)}
                className="w-6 h-6 rounded-full flex items-center justify-center text-secondary hover:text-primary hover:bg-surface-3 transition-pos text-sm"
              >
                −
              </button>
              <span className="text-sm font-semibold text-primary w-6 text-center">{item.quantity}</span>
              <button
                onClick={() => updateQty(item.id, item.quantity + 1)}
                className="w-6 h-6 rounded-full flex items-center justify-center text-secondary hover:text-primary hover:bg-surface-3 transition-pos text-sm"
              >
                +
              </button>
            </div>
          </div>

          <div className="flex flex-col items-end gap-2 shrink-0">
            <p className="text-sm font-bold text-primary">
              GHS {(item.price * item.quantity).toFixed(2)}
            </p>
            <button
              onClick={() => removeItem(item.id)}
              className="text-muted hover:text-danger transition-pos"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}
