'use client'
import { use, useEffect, useState } from 'react'
import Button from '@/components/ui/Button'

interface SaleItem { product_name: string; quantity: number; unit_price: number; line_total: number }
interface SaleDetail {
  id: number; transaction_code: string; created_at: string; cashier_name: string
  customer_name: string | null; total_amount: number; subtotal: number
  tax_amount: number; discount_amount: number; payment_method: string; status: string
  items: SaleItem[]
  payment: { paystack_ref: string | null; method: string; amount_tendered: number | null; change_given: number | null } | null
}

export default function ReceiptPage({ params }: { params: Promise<{ id: string }> }) {
  const { id }      = use(params)
  const [sale, setSale]       = useState<SaleDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState('')

  useEffect(() => {
    // Fetch directly with token from localStorage — bypasses ProtectedRoute timing issues
    async function load() {
      try {
        const stored  = localStorage.getItem('pos-auth')
        const token   = stored ? JSON.parse(stored)?.state?.token : null
        const BASE    = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api'
        const res     = await fetch(`${BASE}/sales/${id}`, {
          headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        })
        if (!res.ok) throw new Error('Could not load receipt')
        const json    = await res.json()
        setSale(json.data)
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Could not load receipt')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [id])

  if (loading) {
    return (
      <div className="max-w-md mx-auto py-12 space-y-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="h-8 rounded animate-pulse" style={{ backgroundColor: 'var(--color-surface-3)' }}/>
        ))}
      </div>
    )
  }

  if (error || !sale) {
    return (
      <div className="max-w-md mx-auto py-12 text-center space-y-4">
        <p className="text-danger font-medium">{error || 'Receipt not found'}</p>
        <Button variant="accent" href="/pos">Back to POS</Button>
      </div>
    )
  }

  return (
    <div className="max-w-md mx-auto space-y-6 py-8">
      {/* Success banner */}
      <div className="text-center space-y-3">
        <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto"
          style={{ backgroundColor: 'var(--color-success-light)' }}>
          <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
            style={{ color: 'var(--color-success)' }}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5"/>
          </svg>
        </div>
        <div>
          <h1 className="text-2xl font-bold text-primary" style={{ fontFamily: 'var(--font-display)' }}>
            Payment Successful!
          </h1>
          <p className="text-secondary mt-1">Transaction via {sale.payment_method.toUpperCase()}</p>
        </div>
      </div>

      {/* Receipt */}
      <div className="card overflow-hidden">
        {/* Header */}
        <div className="px-6 py-5 text-center border-b border-base"
          style={{ backgroundColor: 'var(--color-accent)', color: 'white' }}>
          <h2 className="font-bold text-lg" style={{ fontFamily: 'var(--font-display)' }}>
            {process.env.NEXT_PUBLIC_STORE_NAME || 'PayPoint POS'}
          </h2>
          <p className="text-sm opacity-80 mt-0.5">
            {process.env.NEXT_PUBLIC_STORE_ADDRESS || 'Accra, Ghana'}
          </p>
        </div>

        {/* Transaction meta */}
        <div className="px-6 py-4 border-b border-base space-y-1.5 text-sm">
          {[
            ['Transaction',  sale.transaction_code],
            ['Date',         new Date(sale.created_at).toLocaleString('en-GH')],
            ['Cashier',      sale.cashier_name],
            ['Customer',     sale.customer_name || 'Walk-in Customer'],
            ['Method',       sale.payment_method.toUpperCase()],
          ].map(([k, v]) => (
            <div key={k} className="flex justify-between">
              <span className="text-secondary">{k}</span>
              <span className="font-medium text-primary">{v}</span>
            </div>
          ))}
        </div>

        {/* Items */}
        <div className="px-6 py-4 border-b border-base space-y-2">
          {sale.items.map((item, i) => (
            <div key={i} className="flex justify-between text-sm">
              <div>
                <span className="text-primary">{item.product_name}</span>
                <span className="text-muted ml-2">× {item.quantity}</span>
              </div>
              <span className="text-primary font-medium">GHS {Number(item.line_total).toFixed(2)}</span>
            </div>
          ))}
        </div>

        {/* Totals */}
        <div className="px-6 py-4 space-y-1.5 text-sm">
          <div className="flex justify-between text-secondary">
            <span>Subtotal</span><span>GHS {Number(sale.subtotal).toFixed(2)}</span>
          </div>
          {Number(sale.discount_amount) > 0 && (
            <div className="flex justify-between text-success">
              <span>Discount</span><span>-GHS {Number(sale.discount_amount).toFixed(2)}</span>
            </div>
          )}
          <div className="flex justify-between text-secondary">
            <span>VAT (15%)</span><span>GHS {Number(sale.tax_amount).toFixed(2)}</span>
          </div>
          {sale.payment?.amount_tendered && (
            <div className="flex justify-between text-secondary">
              <span>Cash Tendered</span><span>GHS {Number(sale.payment.amount_tendered).toFixed(2)}</span>
            </div>
          )}
          {sale.payment?.change_given && Number(sale.payment.change_given) > 0 && (
            <div className="flex justify-between font-medium" style={{ color: 'var(--color-success)' }}>
              <span>Change</span><span>GHS {Number(sale.payment.change_given).toFixed(2)}</span>
            </div>
          )}
          <div className="flex justify-between font-bold text-base text-primary border-t border-base pt-2 mt-2">
            <span>Total Paid</span>
            <span style={{ color: 'var(--color-accent)' }}>GHS {Number(sale.total_amount).toFixed(2)}</span>
          </div>
        </div>

        {sale.payment?.paystack_ref && (
          <div className="px-6 py-3 bg-surface-2 text-center">
            <p className="text-xs text-muted font-mono">Ref: {sale.payment.paystack_ref}</p>
          </div>
        )}

        <div className="px-6 py-4 text-center border-t border-dashed border-base">
          <p className="text-xs text-muted">Thank you for shopping with us! 🙏</p>
        </div>
      </div>

      <div className="flex gap-3">
        <Button variant="ghost" fullWidth onClick={() => window.print()}>
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6.72 13.829c-.24.03-.48.062-.72.096m.72-.096a42.415 42.415 0 0110.56 0m-10.56 0L6.34 18m10.94-4.171c.24.03.48.062.72.096m-.72-.096L17.66 18m0 0l.229 2.523a1.125 1.125 0 01-1.12 1.227H7.231c-.662 0-1.18-.568-1.12-1.227L6.34 18m11.318 0h1.091A2.25 2.25 0 0021 15.75V9.456c0-1.081-.768-2.015-1.837-2.175a48.055 48.055 0 00-1.913-.247M6.34 18H5.25A2.25 2.25 0 013 15.75V9.456c0-1.081.768-2.015 1.837-2.175a48.041 48.041 0 011.913-.247m10.5 0a48.536 48.536 0 00-10.5 0m10.5 0V3.375c0-.621-.504-1.125-1.125-1.125h-8.25c-.621 0-1.125.504-1.125 1.125v3.659"/>
          </svg>
          Print Receipt
        </Button>
        <Button variant="accent" fullWidth href="/pos">New Sale</Button>
      </div>
    </div>
  )
}
