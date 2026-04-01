'use client'
import { useState } from 'react'
import Modal from '@/components/ui/Modal'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import { usePaystack } from '@/lib/paystack'
import { apiPost } from '@/lib/api'
import { CartItem } from '@/types/sale'
import { useNotificationStore } from '@/store/notificationStore'

interface PaymentModalProps {
  total: number
  subtotal: number
  tax: number
  items: CartItem[]
  customerId?: number | null
  onSuccess: (saleId: string) => void
  onClose: () => void
}

type PaymentMethod = 'cash' | 'momo' | 'card'

const methods: { id: PaymentMethod; label: string; icon: string; desc: string }[] = [
  { id: 'cash', label: 'Cash',         icon: '💵', desc: 'Physical currency' },
  { id: 'momo', label: 'Mobile Money', icon: '📱', desc: 'MTN, Vodafone, AirtelTigo' },
  { id: 'card', label: 'Card',         icon: '💳', desc: 'Debit or Credit card' },
]

export default function PaymentModal({ total, subtotal, tax, items, customerId, onSuccess, onClose }: PaymentModalProps) {
  const [method, setMethod]                 = useState<PaymentMethod>('cash')
  const [cashTendered, setCashTendered]     = useState('')
  const [customerEmail, setCustomerEmail]   = useState('')
  const [discountAmount, setDiscountAmount] = useState('')
  const [loading, setLoading]               = useState(false)
  const [error, setError]                   = useState('')
  const { initializePayment }               = usePaystack()
  const { addNotification }                 = useNotificationStore()

  // Recompute total with discount
  const discount    = parseFloat(discountAmount || '0')
  const finalTotal  = Math.max(0, subtotal * 1.15 - discount) // subtotal + 15% VAT - discount
  const change      = method === 'cash' ? Math.max(0, parseFloat(cashTendered || '0') - finalTotal) : 0
  const tendered    = parseFloat(cashTendered || '0')
  const cashValid   = tendered >= finalTotal

  async function handlePay() {
    setError('')

    // Validate email for Paystack — required for MoMo/card
    if ((method === 'momo' || method === 'card') && !customerEmail.trim()) {
      setError('Customer email is required for mobile money and card payments')
      return
    }
    if ((method === 'momo' || method === 'card') && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerEmail)) {
      setError('Please enter a valid email address')
      return
    }

    setLoading(true)
    try {
      if (method === 'cash') {
        const data = await apiPost<{ saleId: number; transactionCode: string; total: number; change: number }>('/sales', {
          items: items.map(i => ({ productId: i.id, quantity: i.quantity })),
          paymentMethod: 'cash',
          amountTendered: tendered,
          discountAmount: discount > 0 ? discount : undefined,
          customerId: customerId || undefined,
        })
        // Fire sale notification
        addNotification({
          type: 'sale',
          title: 'Sale completed',
          message: `Cash sale of GHS ${finalTotal.toFixed(2)} · ${items.length} item(s) · Change: GHS ${change.toFixed(2)}`,
          link: `/pos/receipt/${data.saleId}`,
        })
        onSuccess(String(data.saleId))
      } else {
        initializePayment({
          email: customerEmail.trim(),
          amount: Math.round(finalTotal * 100),
          currency: 'GHS',
          channels: method === 'momo' ? ['mobile_money'] : ['card'],
          metadata: { items_count: items.length, discount_amount: discount },
          onSuccess: async (ref: string) => {
            try {
              const data = await apiPost<{ saleId: number }>('/payments/verify', {
                reference: ref,
                items: items.map(i => ({ productId: i.id, quantity: i.quantity })),
                customerId: customerId || undefined,
                discountAmount: discount > 0 ? discount : undefined,
              })
              addNotification({
                type: 'sale',
                title: 'Sale completed',
                message: `${method === 'momo' ? 'Mobile Money' : 'Card'} payment of GHS ${finalTotal.toFixed(2)} · ${items.length} item(s)`,
                link: `/pos/receipt/${data.saleId}`,
              })
              onSuccess(String(data.saleId))
            } catch (e) {
              setError(e instanceof Error ? e.message : 'Payment verification failed')
              setLoading(false)
            }
          },
          onClose: () => setLoading(false),
        })
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Payment failed')
      setLoading(false)
    }
  }

  return (
    <Modal open title="Process Payment" onClose={onClose} size="md">
      <div className="space-y-4">
        {/* Total display */}
        <div className="rounded-pos-lg px-5 py-4 text-center" style={{ backgroundColor: 'var(--color-accent-light)' }}>
          <p className="text-sm text-secondary font-medium">Amount Due</p>
          <p className="text-4xl font-bold mt-1" style={{ color: 'var(--color-accent)', fontFamily: 'var(--font-display)' }}>
            GHS {finalTotal.toFixed(2)}
          </p>
          {discount > 0 && (
            <p className="text-xs mt-1" style={{ color: 'var(--color-success)' }}>
              Discount of GHS {discount.toFixed(2)} applied
            </p>
          )}
        </div>

        {/* Discount field */}
        <div className="flex items-center gap-3 px-1">
          <div className="flex-1">
            <Input
              label="Discount (GHS)"
              type="number"
              min="0"
              max={subtotal}
              step="0.01"
              value={discountAmount}
              onChange={e => setDiscountAmount(e.target.value)}
              placeholder="0.00"
              hint="Optional — applied before total"
              prefix={
                <svg className="w-4 h-4 text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 14.25l6-6m4.5-3.493V21.75l-3.75-1.5-3.75 1.5-3.75-1.5-3.75 1.5V4.757c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0c1.1.128 1.907 1.077 1.907 2.185z"/>
                </svg>
              }
            />
          </div>
          {discount > 0 && (
            <button onClick={() => setDiscountAmount('')}
              className="mt-5 text-xs text-danger hover:underline font-medium">
              Remove
            </button>
          )}
        </div>

        {/* Payment method */}
        <div>
          <p className="text-sm font-medium text-secondary mb-2">Payment Method</p>
          <div className="grid grid-cols-3 gap-2">
            {methods.map(m => (
              <button key={m.id} onClick={() => setMethod(m.id)}
                className="flex flex-col items-center gap-1.5 p-3 rounded-pos-md transition-pos text-sm font-medium border"
                style={{
                  backgroundColor: method === m.id ? 'var(--color-accent-light)' : 'var(--color-surface-2)',
                  borderColor:     method === m.id ? 'var(--color-accent)' : 'var(--color-border)',
                  color:           method === m.id ? 'var(--color-accent)' : 'var(--color-text-secondary)',
                }}>
                <span className="text-xl">{m.icon}</span>
                <span>{m.label}</span>
                <span className="text-xs font-normal opacity-70">{m.desc}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Cash fields */}
        {method === 'cash' && (
          <div className="space-y-3">
            <Input
              label="Amount Tendered (GHS)"
              type="number"
              min={finalTotal}
              step="0.01"
              value={cashTendered}
              onChange={e => setCashTendered(e.target.value)}
              placeholder={finalTotal.toFixed(2)}
            />
            {cashTendered && (
              <div className="flex justify-between items-center px-4 py-3 rounded-pos-md text-sm font-semibold"
                style={{
                  backgroundColor: cashValid ? 'var(--color-success-light)' : 'var(--color-danger-light)',
                  color: cashValid ? 'var(--color-success)' : 'var(--color-danger)',
                }}>
                <span>{cashValid ? 'Change to give' : 'Insufficient amount'}</span>
                {cashValid && <span>GHS {change.toFixed(2)}</span>}
              </div>
            )}
          </div>
        )}

        {/* Paystack email — now clearly required */}
        {(method === 'momo' || method === 'card') && (
          <Input
            label="Customer Email"
            type="email"
            value={customerEmail}
            onChange={e => setCustomerEmail(e.target.value)}
            placeholder="customer@email.com"
            required
            hint="Required by Paystack to send payment confirmation"
          />
        )}

        {/* Error */}
        {error && (
          <div className="p-3 rounded-pos-md text-sm flex items-start gap-2"
            style={{ backgroundColor: 'var(--color-danger-light)', color: 'var(--color-danger)' }}>
            <svg className="w-4 h-4 shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clipRule="evenodd"/>
            </svg>
            {error}
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3 pt-1">
          <Button variant="ghost" fullWidth onClick={onClose} disabled={loading}>Cancel</Button>
          <Button variant="accent" fullWidth loading={loading}
            disabled={method === 'cash' && !cashValid}
            onClick={handlePay}>
            {method === 'cash' ? `Confirm GHS ${finalTotal.toFixed(2)}` : `Pay GHS ${finalTotal.toFixed(2)}`}
          </Button>
        </div>

        {(method === 'momo' || method === 'card') && (
          <p className="text-xs text-center text-muted">
            Secured by <span className="font-semibold">Paystack</span> · PCI DSS compliant
          </p>
        )}
      </div>
    </Modal>
  )
}
