'use client'

import { useRouter } from 'next/navigation'
import { useCart } from '@/hooks/useCart'
import Button from '@/components/ui/Button'

export default function CheckoutPage() {
  const router = useRouter()
  const { cartItems, subtotal, tax, total } = useCart()

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-primary" style={{ fontFamily: 'var(--font-display)' }}>Checkout</h1>
        <p className="text-secondary mt-1">Review order before processing payment</p>
      </div>

      <div className="card overflow-hidden">
        <div className="px-6 py-4 border-b border-base">
          <h2 className="font-semibold text-primary">Order Summary</h2>
        </div>
        <div className="divide-y divide-base">
          {cartItems.length === 0 ? (
            <p className="px-6 py-8 text-center text-muted">No items in cart</p>
          ) : (
            cartItems.map(item => (
              <div key={item.id} className="px-6 py-4 flex items-center justify-between">
                <div>
                  <p className="font-medium text-primary">{item.name}</p>
                  <p className="text-sm text-secondary">Qty: {item.quantity} × GHS {item.price.toFixed(2)}</p>
                </div>
                <p className="font-semibold text-primary">GHS {(item.quantity * item.price).toFixed(2)}</p>
              </div>
            ))
          )}
        </div>
        <div className="px-6 py-4 bg-surface-2 space-y-2 text-sm">
          <div className="flex justify-between text-secondary">
            <span>Subtotal</span><span>GHS {subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-secondary">
            <span>VAT (15%)</span><span>GHS {tax.toFixed(2)}</span>
          </div>
          <div className="flex justify-between font-bold text-base text-primary border-t border-base pt-2">
            <span>Total</span>
            <span style={{ color: 'var(--color-accent)' }}>GHS {total.toFixed(2)}</span>
          </div>
        </div>
      </div>

      <div className="flex gap-3">
        <Button variant="ghost" fullWidth onClick={() => router.back()}>Back to POS</Button>
        <Button variant="accent" fullWidth onClick={() => router.push('/pos')}>Process Payment</Button>
      </div>
    </div>
  )
}
