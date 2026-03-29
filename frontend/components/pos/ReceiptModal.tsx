'use client'

import Modal from '@/components/ui/Modal'
import Button from '@/components/ui/Button'

interface ReceiptItem { name: string; qty: number; price: number }

interface ReceiptModalProps {
  open: boolean
  onClose: () => void
  sale: {
    transactionCode: string
    date: string
    cashier: string
    items: ReceiptItem[]
    subtotal: number
    tax: number
    total: number
    paymentMethod: string
  }
}

export default function ReceiptModal({ open, onClose, sale }: ReceiptModalProps) {
  return (
    <Modal open={open} onClose={onClose} title="Receipt" size="sm">
      <div className="space-y-4 text-sm">
        {/* Store header */}
        <div className="text-center pb-3 border-b border-dashed border-base">
          <p className="font-bold text-base text-primary" style={{ fontFamily: 'var(--font-display)' }}>PayPoint POS</p>
          <p className="text-muted text-xs mt-0.5">Accra, Ghana</p>
        </div>

        {/* Meta */}
        <div className="space-y-1 text-xs">
          {[
            ['Txn', sale.transactionCode],
            ['Date', sale.date],
            ['Cashier', sale.cashier],
            ['Method', sale.paymentMethod],
          ].map(([k, v]) => (
            <div key={k} className="flex justify-between">
              <span className="text-muted">{k}</span>
              <span className="text-primary font-medium">{v}</span>
            </div>
          ))}
        </div>

        {/* Items */}
        <div className="border-t border-dashed border-base pt-3 space-y-1.5">
          {sale.items.map((item, i) => (
            <div key={i} className="flex justify-between text-xs">
              <span className="text-secondary">{item.name} ×{item.qty}</span>
              <span className="text-primary font-medium">GHS {(item.qty * item.price).toFixed(2)}</span>
            </div>
          ))}
        </div>

        {/* Totals */}
        <div className="border-t border-dashed border-base pt-3 space-y-1 text-xs">
          <div className="flex justify-between text-muted">
            <span>Subtotal</span><span>GHS {sale.subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-muted">
            <span>VAT 15%</span><span>GHS {sale.tax.toFixed(2)}</span>
          </div>
          <div className="flex justify-between font-bold text-sm text-primary border-t border-base pt-1 mt-1">
            <span>Total</span>
            <span style={{ color: 'var(--color-accent)' }}>GHS {sale.total.toFixed(2)}</span>
          </div>
        </div>

        <p className="text-center text-xs text-muted pt-2 border-t border-dashed border-base">
          Thank you for your purchase!
        </p>

        <div className="flex gap-2 pt-1">
          <Button variant="ghost" size="sm" fullWidth onClick={() => window.print()}>
            Print
          </Button>
          <Button variant="accent" size="sm" fullWidth onClick={onClose}>
            Done
          </Button>
        </div>
      </div>
    </Modal>
  )
}
