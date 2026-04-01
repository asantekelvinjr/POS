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

const fmt = (n: number | string) => `GHS ${Number(n).toFixed(2)}`

export default function ReceiptPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const [sale, setSale]         = useState<SaleDetail | null>(null)
  const [loading, setLoading]   = useState(true)
  const [error, setError]       = useState('')
  const [pdfLoading, setPdfLoading] = useState(false)

  useEffect(() => {
    async function load() {
      try {
        const stored = localStorage.getItem('pos-auth')
        const token  = stored ? JSON.parse(stored)?.state?.token : null
        const BASE   = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api'
        const res    = await fetch(`${BASE}/sales/${id}`, {
          headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
          cache: 'no-store',
        })
        if (!res.ok) throw new Error('Could not load receipt')
        const json = await res.json()
        setSale(json.data)
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Could not load receipt')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [id])

  // ── Print: browser print dialog, receipt scales to fill the page ──────────
  function handlePrint() { window.print() }

  // ── PDF: pure jsPDF text — crisp vector output, correct page height ─────────
  // Two-pass approach: pass 1 calculates total height, pass 2 renders into a
  // correctly-sized document so there's no blank whitespace at the bottom.
  async function handleDownloadPDF() {
    if (!sale) return
    setPdfLoading(true)
    try {
      const { default: jsPDF } = await import('jspdf')

      const W        = 80          // mm — standard thermal roll width
      const pad      = 6
      const headerH  = 22
      const ACCENT   = [16, 185, 129] as const

      const storeName    = process.env.NEXT_PUBLIC_STORE_NAME    || 'PayPoint POS'
      const storeAddress = process.env.NEXT_PUBLIC_STORE_ADDRESS || 'Accra, Ghana'
      const storePhone   = process.env.NEXT_PUBLIC_STORE_PHONE   || ''

      // ── Shared drawing function — called twice (dry-run + real render) ──────
      function renderReceipt(pdf: InstanceType<typeof jsPDF> | null): number {
        let y = 0

        const draw = {
          rect(x: number, ry: number, w: number, h: number, style: string) {
            pdf?.rect(x, ry, w, h, style)
          },
          text(text: string, x: number, ry: number, opts?: { align?: 'center' | 'right' | 'left' }) {
            pdf?.text(text, x, ry, opts)
          },
          line(x1: number, ry1: number, x2: number, ry2: number) {
            pdf?.line(x1, ry1, x2, ry2)
          },
          setFont(f: string, style: string)   { pdf?.setFont(f, style) },
          setFontSize(s: number)              { pdf?.setFontSize(s) },
          setTextColor(...c: number[])        { pdf?.setTextColor(c[0], c[1], c[2]) },
          setFillColor(...c: number[])        { pdf?.setFillColor(c[0], c[1], c[2]) },
          setDrawColor(...c: number[])        { pdf?.setDrawColor(c[0], c[1], c[2]) },
          setLineWidth(w: number)             { pdf?.setLineWidth(w) },
        }

        // Header
        draw.setFillColor(...ACCENT)
        draw.rect(0, 0, W, headerH, 'F')
        draw.setTextColor(255, 255, 255)
        draw.setFont('helvetica', 'bold')
        draw.setFontSize(11)
        draw.text(storeName, W / 2, 9, { align: 'center' })
        draw.setFont('helvetica', 'normal')
        draw.setFontSize(7.5)
        draw.text(`${storeAddress}${storePhone ? ' · ' + storePhone : ''}`, W / 2, 15, { align: 'center' })
        y = headerH + 6

        // Row helper
        function row(label: string, value: string, opts: { bold?: boolean; accent?: boolean; size?: number } = {}) {
          const sz = opts.size ?? 8
          draw.setFontSize(sz)
          draw.setFont('helvetica', 'normal')
          draw.setTextColor(100, 116, 139)
          draw.text(label, pad, y)
          draw.setFont('helvetica', opts.bold ? 'bold' : 'normal')
          if (opts.accent) draw.setTextColor(...ACCENT)
          else draw.setTextColor(15, 23, 42)
          draw.text(value, W - pad, y, { align: 'right' })
          draw.setTextColor(15, 23, 42)
          y += sz * 0.58
        }

        function divider(dashed = false) {
          draw.setDrawColor(220, 224, 230)
          draw.setLineWidth(0.2)
          if (dashed) {
            let x = pad
            while (x < W - pad) { draw.line(x, y, Math.min(x + 2, W - pad), y); x += 3.5 }
          } else {
            draw.line(pad, y, W - pad, y)
          }
          y += 4
        }

        function sectionLabel(title: string) {
          draw.setFont('helvetica', 'bold')
          draw.setFontSize(6.5)
          draw.setTextColor(148, 163, 184)
          draw.text(title.toUpperCase(), pad, y)
          y += 5
        }

        // Meta
        row('Transaction', sale!.transaction_code);             y += 0.5
        row('Date', new Date(sale!.created_at).toLocaleString('en-GH')); y += 0.5
        row('Cashier', sale!.cashier_name);                     y += 0.5
        row('Customer', sale!.customer_name || 'Walk-in Customer'); y += 0.5
        row('Method', sale!.payment_method.toUpperCase());      y += 2
        divider()

        // Items
        sectionLabel('Items')
        for (const item of sale!.items) {
          draw.setFont('helvetica', 'normal')
          draw.setFontSize(8)
          draw.setTextColor(15, 23, 42)
          draw.text(item.product_name, pad, y)
          draw.setFont('helvetica', 'bold')
          draw.text(fmt(item.line_total), W - pad, y, { align: 'right' })
          y += 4.5
          draw.setFont('helvetica', 'normal')
          draw.setFontSize(6.8)
          draw.setTextColor(148, 163, 184)
          draw.text(`x${item.quantity} @ GHS ${Number(item.unit_price).toFixed(2)}`, pad, y)
          y += 5
        }
        y += 1
        divider()

        // Totals
        row('Subtotal', fmt(sale!.subtotal));                   y += 0.5
        if (Number(sale!.discount_amount) > 0) {
          row('Discount', `-GHS ${Number(sale!.discount_amount).toFixed(2)}`, { bold: true, accent: true })
          y += 0.5
        }
        row('VAT (15%)', fmt(sale!.tax_amount));                y += 0.5
        if (sale!.payment?.amount_tendered != null) {
          row('Cash Tendered', fmt(sale!.payment.amount_tendered)); y += 0.5
        }
        if (sale!.payment?.change_given != null && Number(sale!.payment.change_given) > 0) {
          row('Change Given', fmt(sale!.payment.change_given), { bold: true, accent: true }); y += 0.5
        }

        // Total Paid — larger
        y += 2
        divider()
        draw.setFontSize(10)
        draw.setFont('helvetica', 'bold')
        draw.setTextColor(15, 23, 42)
        draw.text('Total Paid', pad, y)
        draw.setTextColor(...ACCENT)
        draw.text(fmt(sale!.total_amount), W - pad, y, { align: 'right' })
        y += 9

        // Paystack ref
        if (sale!.payment?.paystack_ref) {
          draw.setFontSize(6.5)
          draw.setFont('helvetica', 'normal')
          draw.setTextColor(148, 163, 184)
          draw.text(`Ref: ${sale!.payment.paystack_ref}`, W / 2, y, { align: 'center' })
          y += 6
        }

        // Footer
        divider(true)
        draw.setFontSize(7)
        draw.setFont('helvetica', 'normal')
        draw.setTextColor(148, 163, 184)
        draw.text('Thank you for shopping with us!', W / 2, y, { align: 'center' })
        y += 4.5
        draw.text('Keep this receipt as proof of purchase.', W / 2, y, { align: 'center' })
        y += 8

        return y
      }

      // Pass 1: dry run — get the exact height
      const totalHeight = renderReceipt(null)

      // Pass 2: create the pdf at the correct height and render for real
      const pdf = new jsPDF({ unit: 'mm', format: [W, totalHeight], orientation: 'portrait' })
      renderReceipt(pdf)
      pdf.save(`receipt-${sale.transaction_code}.pdf`)

    } catch (err) {
      console.error('PDF error:', err)
      alert('Could not generate PDF. Please use Print → "Save as PDF" instead.')
    } finally {
      setPdfLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="max-w-md mx-auto py-12 space-y-3">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="h-8 rounded animate-pulse" style={{ backgroundColor: 'var(--color-surface-3)' }} />
        ))}
      </div>
    )
  }

  if (error || !sale) {
    return (
      <div className="max-w-md mx-auto py-12 text-center space-y-4">
        <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto"
          style={{ backgroundColor: 'var(--color-danger-light)' }}>
          <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
            style={{ color: 'var(--color-danger)' }}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>
        <p className="font-medium" style={{ color: 'var(--color-danger)' }}>{error || 'Receipt not found'}</p>
        <Button variant="accent" href="/pos">Back to POS</Button>
      </div>
    )
  }

  return (
    <>
      {/* ── Print styles ─────────────────────────────────────────────────────
          1. Force html + body to white so the dark app shell doesn't bleed.
          2. Hide everything with visibility:hidden (works across Next.js wrappers).
          3. Reveal only #receipt-printable and its children.
          4. Position receipt top-left, let it fill the printable area naturally.
          5. Exact colour rendering for the green header band.
      ─────────────────────────────────────────────────────────────────── */}
      <style>{`
        @media print {
          @page {
            margin: 12mm 10mm;
          }

          /* Force white page — overrides any dark-mode background */
          html, body {
            background: #ffffff !important;
            background-color: #ffffff !important;
          }

          /* Hide everything */
          body * { visibility: hidden !important; }

          /* Reveal receipt only */
          #receipt-printable,
          #receipt-printable * { visibility: visible !important; }

          #receipt-printable {
            position: fixed !important;
            inset: 0 !important;
            width: 100% !important;
            max-width: 100% !important;
            margin: 0 !important;
            padding: 0 !important;
            box-shadow: none !important;
            border-radius: 0 !important;
            border: none !important;
            background: #ffffff !important;
          }

          * {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
            color-adjust: exact !important;
          }
        }
      `}</style>

      <div className="max-w-md mx-auto space-y-6 py-8">

        {/* Success banner */}
        <div className="text-center space-y-3">
          <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto"
            style={{ backgroundColor: 'var(--color-success-light)' }}>
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
              style={{ color: 'var(--color-success)' }}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
            </svg>
          </div>
          <div>
            <h1 className="text-2xl font-bold" style={{ color: 'var(--color-text-primary)', fontFamily: 'var(--font-display)' }}>
              Payment Successful!
            </h1>
            <p className="mt-1" style={{ color: 'var(--color-text-secondary)' }}>
              Transaction via {sale.payment_method.toUpperCase()}
            </p>
          </div>
        </div>

        {/* Receipt card */}
        <ReceiptCard sale={sale} />

        {/* Action buttons */}
        <div className="flex gap-3">
          <Button variant="ghost" fullWidth onClick={handlePrint}>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round"
                d="M6.72 13.829c-.24.03-.48.062-.72.096m.72-.096a42.415 42.415 0 0110.56 0m-10.56 0L6.34 18m10.94-4.171c.24.03.48.062.72.096m-.72-.096L17.66 18m0 0l.229 2.523a1.125 1.125 0 01-1.12 1.227H7.231c-.662 0-1.18-.568-1.12-1.227L6.34 18m11.318 0h1.091A2.25 2.25 0 0021 15.75V9.456c0-1.081-.768-2.015-1.837-2.175a48.055 48.055 0 00-1.913-.247M6.34 18H5.25A2.25 2.25 0 013 15.75V9.456c0-1.081.768-2.015 1.837-2.175a48.041 48.041 0 011.913-.247m10.5 0a48.536 48.536 0 00-10.5 0m10.5 0V3.375c0-.621-.504-1.125-1.125-1.125h-8.25c-.621 0-1.125.504-1.125 1.125v3.659" />
            </svg>
            Print Receipt
          </Button>
          <Button variant="ghost" fullWidth onClick={handleDownloadPDF} disabled={pdfLoading}>
            {pdfLoading
              ? <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                </svg>
              : <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                </svg>
            }
            {pdfLoading ? 'Generating…' : 'Save PDF'}
          </Button>
          <Button variant="accent" fullWidth href="/pos">New Sale</Button>
        </div>
      </div>
    </>
  )
}

// ── Receipt card: 100% CSS-variable driven, works in light & dark mode ───────
function ReceiptCard({ sale }: { sale: SaleDetail }) {
  return (
    <div
      id="receipt-printable"
      style={{
        backgroundColor: 'var(--color-surface)',
        border: '1px solid var(--color-border)',
        borderRadius: 'var(--radius-lg)',
        boxShadow: 'var(--shadow-card)',
        overflow: 'hidden',
      }}
    >
      {/* Header */}
      <div style={{
        backgroundColor: 'var(--color-accent)',
        color: '#fff',
        padding: '20px 24px',
        textAlign: 'center',
      }}>
        <h2 style={{ fontWeight: 700, fontSize: '1.125rem', margin: 0, fontFamily: 'var(--font-display)' }}>
          {process.env.NEXT_PUBLIC_STORE_NAME || 'PayPoint POS'}
        </h2>
        <p style={{ fontSize: '0.8125rem', opacity: 0.85, marginTop: 3, marginBottom: 0 }}>
          {process.env.NEXT_PUBLIC_STORE_ADDRESS || 'Accra, Ghana'}
          {process.env.NEXT_PUBLIC_STORE_PHONE ? ` · ${process.env.NEXT_PUBLIC_STORE_PHONE}` : ''}
        </p>
      </div>

      {/* Meta rows */}
      <div style={{ padding: '16px 24px', borderBottom: '1px solid var(--color-border)' }}>
        {([
          ['Transaction', sale.transaction_code],
          ['Date',        new Date(sale.created_at).toLocaleString('en-GH')],
          ['Cashier',     sale.cashier_name],
          ['Customer',    sale.customer_name || 'Walk-in Customer'],
          ['Method',      sale.payment_method.toUpperCase()],
        ] as [string, string][]).map(([k, v]) => (
          <div key={k} style={{
            display: 'flex', justifyContent: 'space-between',
            fontSize: '0.875rem', marginBottom: 6,
          }}>
            <span style={{ color: 'var(--color-text-secondary)' }}>{k}</span>
            <span style={{ fontWeight: 500, color: 'var(--color-text-primary)' }}>{v}</span>
          </div>
        ))}
      </div>

      {/* Items */}
      <div style={{ padding: '16px 24px', borderBottom: '1px solid var(--color-border)' }}>
        <p style={{
          fontSize: '0.6875rem', fontWeight: 600,
          color: 'var(--color-text-muted)',
          textTransform: 'uppercase', letterSpacing: '0.06em',
          marginBottom: 10, marginTop: 0,
        }}>
          Items
        </p>
        {sale.items.map((item, i) => (
          <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', marginBottom: 8 }}>
            <div>
              <span style={{ color: 'var(--color-text-primary)' }}>{item.product_name}</span>
              <span style={{ color: 'var(--color-text-muted)', marginLeft: 6, fontSize: '0.75rem' }}>
                × {item.quantity} @ GHS {Number(item.unit_price).toFixed(2)}
              </span>
            </div>
            <span style={{ fontWeight: 500, color: 'var(--color-text-primary)' }}>
              GHS {Number(item.line_total).toFixed(2)}
            </span>
          </div>
        ))}
      </div>

      {/* Totals */}
      <div style={{ padding: '16px 24px' }}>
        <Row label="Subtotal"  value={`GHS ${Number(sale.subtotal).toFixed(2)}`} />
        {Number(sale.discount_amount) > 0 && (
          <Row label="Discount" value={`-GHS ${Number(sale.discount_amount).toFixed(2)}`} accent bold />
        )}
        <Row label="VAT (15%)" value={`GHS ${Number(sale.tax_amount).toFixed(2)}`} />
        {sale.payment?.amount_tendered != null && (
          <Row label="Cash Tendered" value={`GHS ${Number(sale.payment.amount_tendered).toFixed(2)}`} />
        )}
        {sale.payment?.change_given != null && Number(sale.payment.change_given) > 0 && (
          <Row label="Change Given" value={`GHS ${Number(sale.payment.change_given).toFixed(2)}`} accent bold />
        )}

        {/* Total paid */}
        <div style={{
          display: 'flex', justifyContent: 'space-between',
          fontWeight: 700, fontSize: '1rem',
          borderTop: '1px solid var(--color-border)',
          paddingTop: 8, marginTop: 8,
          color: 'var(--color-text-primary)',
        }}>
          <span>Total Paid</span>
          <span style={{ color: 'var(--color-accent)' }}>GHS {Number(sale.total_amount).toFixed(2)}</span>
        </div>
      </div>

      {/* Paystack ref */}
      {sale.payment?.paystack_ref && (
        <div style={{
          padding: '8px 24px',
          backgroundColor: 'var(--color-surface-2)',
          textAlign: 'center',
        }}>
          <p style={{ fontSize: '0.6875rem', color: 'var(--color-text-muted)', fontFamily: 'monospace', margin: 0 }}>
            Ref: {sale.payment.paystack_ref}
          </p>
        </div>
      )}

      {/* Footer */}
      <div style={{
        padding: '16px 24px',
        textAlign: 'center',
        borderTop: '1px dashed var(--color-border)',
      }}>
        <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', margin: 0 }}>
          Thank you for shopping with us! 🙏
        </p>
        <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: 2, marginBottom: 0 }}>
          Keep this receipt as proof of purchase.
        </p>
      </div>
    </div>
  )
}

function Row({
  label, value, accent, bold,
}: {
  label: string; value: string; accent?: boolean; bold?: boolean
}) {
  return (
    <div style={{
      display: 'flex', justifyContent: 'space-between',
      fontSize: '0.875rem', marginBottom: 6,
      fontWeight: bold ? 600 : 400,
      color: accent ? 'var(--color-accent)' : 'var(--color-text-secondary)',
    }}>
      <span>{label}</span>
      <span>{value}</span>
    </div>
  )
}