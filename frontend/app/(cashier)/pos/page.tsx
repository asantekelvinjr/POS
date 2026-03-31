'use client'
import { useState } from 'react'
import ProductSearch from '@/components/pos/ProductSearch'
import Cart from '@/components/pos/Cart'
import BarcodeInput from '@/components/pos/BarcodeInput'
import PaymentModal from '@/components/pos/PaymentModal'
import { useCart } from '@/hooks/useCart'

export default function POSPage() {
  const [showPayment, setShowPayment] = useState(false)
  const { cartItems, subtotal, tax, total, clearCart, customerId } = useCart()

  function handlePaymentSuccess(saleId: string) {
    setShowPayment(false)
    clearCart()
    window.location.href = `/pos/receipt/${saleId}`
  }

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col lg:flex-row gap-0 overflow-hidden -m-6">
      {/* Left: Product area */}
      <div className="flex-1 flex flex-col overflow-hidden bg-base">
        <div className="flex items-center gap-3 px-6 py-4 bg-surface border-b border-base">
          <BarcodeInput />
          <ProductSearch />
        </div>
        <div className="flex-1 overflow-y-auto p-6">
          <ProductSearch.Grid />
        </div>
      </div>

      {/* Right: Cart panel */}
      <div className="w-full lg:w-96 flex flex-col border-t lg:border-t-0 lg:border-l border-base" style={{ backgroundColor: 'var(--color-surface)' }}>
        <div className="px-5 py-4 border-b border-base flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <svg className="w-5 h-5 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z"/>
            </svg>
            <h2 className="font-semibold text-primary">Cart</h2>
            {cartItems.length > 0 && (
              <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ backgroundColor: 'var(--color-accent)', color: 'white' }}>
                {cartItems.length}
              </span>
            )}
          </div>
          {cartItems.length > 0 && (
            <button onClick={clearCart} className="text-xs text-danger hover:text-danger transition-pos font-medium">Clear all</button>
          )}
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4"><Cart /></div>

        <div className="px-5 py-5 border-t border-base space-y-3">
          <div className="space-y-2 text-sm">
            <div className="flex justify-between text-secondary">
              <span>Subtotal</span>
              <span className="font-medium text-primary">GHS {subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-secondary">
              <span>VAT (15%)</span>
              <span className="font-medium text-primary">GHS {tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between pt-2 border-t border-base">
              <span className="font-bold text-base text-primary">Total</span>
              <span className="font-bold text-lg" style={{ color: 'var(--color-accent)' }}>GHS {total.toFixed(2)}</span>
            </div>
          </div>

          <button
            onClick={() => setShowPayment(true)}
            disabled={cartItems.length === 0}
            className="w-full py-3.5 rounded-pos-md font-bold text-white text-base transition-pos disabled:opacity-40 disabled:cursor-not-allowed"
            style={{ backgroundColor: cartItems.length > 0 ? 'var(--color-accent)' : 'var(--color-surface-3)' }}
          >
            {cartItems.length === 0 ? 'Add items to cart' : `Charge GHS ${total.toFixed(2)}`}
          </button>

          <div className="flex gap-2">
            {['Cash', 'MoMo', 'Card'].map(m => (
              <span key={m} className="flex-1 text-center text-xs py-1.5 rounded-pos-sm text-muted bg-surface-2 font-medium">{m}</span>
            ))}
          </div>
        </div>
      </div>

      {showPayment && (
        <PaymentModal
          total={total}
          items={cartItems}
          customerId={customerId}
          onSuccess={handlePaymentSuccess}
          onClose={() => setShowPayment(false)}
        />
      )}
    </div>
  )
}
