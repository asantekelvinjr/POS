'use client'
import { useState } from 'react'
import Modal from '@/components/ui/Modal'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import { usePaystack } from '@/lib/paystack'
import { apiPost } from '@/lib/api'
import { CartItem } from '@/types/sale'

interface PaymentModalProps {
  total: number
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

export default function PaymentModal({ total, items, customerId, onSuccess, onClose }: PaymentModalProps) {
  const [method, setMethod]             = useState<PaymentMethod>('cash')
  const [cashTendered, setCashTendered] = useState('')
  const [customerEmail, setCustomerEmail] = useState('')
  const [loading, setLoading]           = useState(false)
  const [error, setError]               = useState('')
  const { initializePayment }           = usePaystack()

  const change  = method === 'cash' ? Math.max(0, parseFloat(cashTendered || '0') - total) : 0
  const tendered = parseFloat(cashTendered || '0')
  const cashValid = tendered >= total

  async function handlePay() {
    setError('')
    setLoading(true)
    try {
      if (method === 'cash') {
        const data = await apiPost<{ saleId: number; transactionCode: string; total: number; change: number }>('/sales', {
          items: items.map(i => ({ productId: i.id, quantity: i.quantity })),
          paymentMethod: 'cash',
          amountTendered: tendered,
          customerId: customerId || undefined,
        })
        onSuccess(String(data.saleId))
      } else {
        initializePayment({
          email: customerEmail || 'walkin@paypoint.pos',
          amount: Math.round(total * 100),
          currency: 'GHS',
          channels: method === 'momo' ? ['mobile_money'] : ['card'],
          metadata: { items_count: items.length },
          onSuccess: async (ref: string) => {
            try {
              const data = await apiPost<{ saleId: number }>('/payments/verify', {
                reference: ref,
                items: items.map(i => ({ productId: i.id, quantity: i.quantity })),
                customerId: customerId || undefined,
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
      <div className="space-y-5">
        {/* Total */}
        <div className="rounded-pos-lg px-5 py-4 text-center" style={{ backgroundColor: 'var(--color-accent-light)' }}>
          <p className="text-sm text-secondary font-medium">Amount Due</p>
          <p className="text-4xl font-bold mt-1" style={{ color: 'var(--color-accent)', fontFamily: 'var(--font-display)' }}>
            GHS {total.toFixed(2)}
          </p>
        </div>

        {/* Method selector */}
        <div>
          <p className="text-sm font-medium text-secondary mb-2">Payment Method</p>
          <div className="grid grid-cols-3 gap-2">
            {methods.map(m => (
              <button key={m.id} onClick={() => setMethod(m.id)}
                className="flex flex-col items-center gap-1.5 p-3 rounded-pos-md transition-pos text-sm font-medium border"
                style={{ backgroundColor: method === m.id ? 'var(--color-accent-light)' : 'var(--color-surface-2)', borderColor: method === m.id ? 'var(--color-accent)' : 'var(--color-border)', color: method === m.id ? 'var(--color-accent)' : 'var(--color-text-secondary)' }}>
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
            <Input label="Amount Tendered (GHS)" type="number" min={total} step="0.01" value={cashTendered} onChange={e => setCashTendered(e.target.value)} placeholder={total.toFixed(2)}/>
            {cashTendered && (
              <div className="flex justify-between items-center px-4 py-3 rounded-pos-md text-sm font-semibold"
                style={{ backgroundColor: cashValid ? 'var(--color-success-light)' : 'var(--color-danger-light)', color: cashValid ? 'var(--color-success)' : 'var(--color-danger)' }}>
                <span>{cashValid ? 'Change to give' : 'Insufficient amount'}</span>
                {cashValid && <span>GHS {change.toFixed(2)}</span>}
              </div>
            )}
          </div>
        )}

        {/* Paystack fields */}
        {(method === 'momo' || method === 'card') && (
          <Input label="Customer Email (optional)" type="email" value={customerEmail} onChange={e => setCustomerEmail(e.target.value)} placeholder="customer@email.com" hint="Leave blank for walk-in customers"/>
        )}

        {/* Error */}
        {error && (
          <div className="p-3 rounded-pos-md text-sm" style={{ backgroundColor: 'var(--color-danger-light)', color: 'var(--color-danger)' }}>
            {error}
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3 pt-1">
          <Button variant="ghost" fullWidth onClick={onClose} disabled={loading}>Cancel</Button>
          <Button variant="accent" fullWidth loading={loading} disabled={method === 'cash' && !cashValid} onClick={handlePay}>
            {method === 'cash' ? `Confirm GHS ${total.toFixed(2)}` : 'Pay with Paystack'}
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
