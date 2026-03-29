'use client'

import { use } from 'react'
import Button from '@/components/ui/Button'
import ReceiptModal from '@/components/pos/ReceiptModal'

export default function ReceiptPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)

  // In real app, fetch sale by id
  const mockSale = {
    id,
    transactionCode: `TXN-${id}`,
    date: new Date().toLocaleString('en-GH'),
    cashier: 'Kwabena Osei',
    customer: 'Walk-in Customer',
    items: [
      { name: 'Milo 400g', qty: 2, price: 24.00 },
      { name: 'Fanta 500ml', qty: 4, price: 7.00 },
      { name: 'Mentos Roll', qty: 3, price: 3.50 },
    ],
    subtotal: 86.50,
    tax: 12.975,
    total: 99.475,
    paymentMethod: 'MTN MoMo',
    paystackRef: 'PSK_TEST_123456',
  }

  return (
    <div className="max-w-md mx-auto space-y-6 py-8">
      {/* Success indicator */}
      <div className="text-center space-y-3">
        <div
          className="w-16 h-16 rounded-full flex items-center justify-center mx-auto"
          style={{ backgroundColor: 'var(--color-success-light)' }}
        >
          <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
            style={{ color: 'var(--color-success)' }}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
          </svg>
        </div>
        <div>
          <h1 className="text-2xl font-bold text-primary" style={{ fontFamily: 'var(--font-display)' }}>
            Payment Successful!
          </h1>
          <p className="text-secondary mt-1">Transaction completed via {mockSale.paymentMethod}</p>
        </div>
      </div>

      {/* Receipt card */}
      <div className="card overflow-hidden">
        {/* Store header */}
        <div className="px-6 py-5 text-center border-b border-base"
          style={{ backgroundColor: 'var(--color-accent)', color: 'white' }}>
          <h2 className="font-bold text-lg" style={{ fontFamily: 'var(--font-display)' }}>PayPoint POS</h2>
          <p className="text-sm opacity-80 mt-0.5">Accra, Ghana · 0244-PAYPOINT</p>
        </div>

        {/* Meta */}
        <div className="px-6 py-4 border-b border-base space-y-1.5 text-sm">
          {[
            ['Transaction', mockSale.transactionCode],
            ['Date', mockSale.date],
            ['Cashier', mockSale.cashier],
            ['Customer', mockSale.customer],
            ['Payment', mockSale.paymentMethod],
          ].map(([k, v]) => (
            <div key={k} className="flex justify-between">
              <span className="text-secondary">{k}</span>
              <span className="font-medium text-primary">{v}</span>
            </div>
          ))}
        </div>

        {/* Items */}
        <div className="px-6 py-4 border-b border-base space-y-2">
          {mockSale.items.map((item, i) => (
            <div key={i} className="flex justify-between text-sm">
              <div>
                <span className="text-primary">{item.name}</span>
                <span className="text-muted ml-2">× {item.qty}</span>
              </div>
              <span className="text-primary font-medium">GHS {(item.qty * item.price).toFixed(2)}</span>
            </div>
          ))}
        </div>

        {/* Totals */}
        <div className="px-6 py-4 space-y-1.5 text-sm">
          <div className="flex justify-between text-secondary">
            <span>Subtotal</span><span>GHS {mockSale.subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-secondary">
            <span>VAT (15%)</span><span>GHS {mockSale.tax.toFixed(2)}</span>
          </div>
          <div className="flex justify-between font-bold text-base text-primary border-t border-base pt-2 mt-2">
            <span>Total Paid</span>
            <span style={{ color: 'var(--color-accent)' }}>GHS {mockSale.total.toFixed(2)}</span>
          </div>
        </div>

        {/* Paystack ref */}
        <div className="px-6 py-3 bg-surface-2 text-center">
          <p className="text-xs text-muted font-mono">Ref: {mockSale.paystackRef}</p>
        </div>

        <div className="px-6 py-4 text-center">
          <p className="text-xs text-muted">Thank you for shopping with us!</p>
        </div>
      </div>

      <div className="flex gap-3">
        <Button variant="ghost" fullWidth>
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6.72 13.829c-.24.03-.48.062-.72.096m.72-.096a42.415 42.415 0 0110.56 0m-10.56 0L6.34 18m10.94-4.171c.24.03.48.062.72.096m-.72-.096L17.66 18m0 0l.229 2.523a1.125 1.125 0 01-1.12 1.227H7.231c-.662 0-1.18-.568-1.12-1.227L6.34 18m11.318 0h1.091A2.25 2.25 0 0021 15.75V9.456c0-1.081-.768-2.015-1.837-2.175a48.055 48.055 0 00-1.913-.247M6.34 18H5.25A2.25 2.25 0 013 15.75V9.456c0-1.081.768-2.015 1.837-2.175a48.041 48.041 0 011.913-.247m10.5 0a48.536 48.536 0 00-10.5 0m10.5 0V3.375c0-.621-.504-1.125-1.125-1.125h-8.25c-.621 0-1.125.504-1.125 1.125v3.659M18 10.5h.008v.008H18V10.5zm-3 0h.008v.008H15V10.5z" />
          </svg>
          Print Receipt
        </Button>
        <Button variant="accent" fullWidth href="/pos">
          New Sale
        </Button>
      </div>
    </div>
  )
}
