'use client'
import { use, useEffect, useState } from 'react'
import { apiGet } from '@/lib/api'
import Badge from '@/components/ui/Badge'

interface Customer { id: number; name: string; phone: string | null; email: string | null; address: string | null; loyalty_points: number; total_spent: number; created_at: string }
interface PurchaseHistory { id: number; transaction_code: string; created_at: string; total_amount: number; payment_method: string; status: string; item_count: number }

export default function CustomerDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id }    = use(params)
  const [customer, setCustomer] = useState<Customer | null>(null)
  const [history, setHistory]   = useState<PurchaseHistory[]>([])
  const [loading, setLoading]   = useState(true)

  useEffect(() => {
    Promise.all([
      apiGet<Customer>(`/customers/${id}`),
      apiGet<PurchaseHistory[]>(`/customers/${id}/history`),
    ]).then(([c, h]) => { setCustomer(c); setHistory(h) })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [id])

  if (loading) return <div className="space-y-4">{Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-16 card animate-pulse"/>)}</div>
  if (!customer) return <div className="card p-8 text-center text-muted">Customer not found</div>

  const initials = customer.name.split(' ').map(n => n[0]).join('')
  const totalVisits = history.length
  const avgOrder = totalVisits > 0 ? Number(customer.total_spent) / totalVisits : 0

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 text-sm text-muted">
        <a href="/customers" className="hover:text-accent transition-pos">Customers</a>
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/></svg>
        <span className="text-primary font-medium">{customer.name}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="card p-6 text-center space-y-4">
          <div className="w-16 h-16 rounded-full flex items-center justify-center font-bold text-xl text-white mx-auto" style={{ backgroundColor: 'var(--color-accent)' }}>{initials}</div>
          <div>
            <h2 className="font-bold text-xl text-primary" style={{ fontFamily: 'var(--font-display)' }}>{customer.name}</h2>
            <p className="text-secondary text-sm mt-1">Customer since {new Date(customer.created_at).toLocaleDateString('en-GH', { month: 'long', year: 'numeric' })}</p>
          </div>
          <div className="space-y-1.5 text-sm">
            {customer.phone && <p className="text-secondary">{customer.phone}</p>}
            {customer.email && <p className="text-secondary">{customer.email}</p>}
            {customer.address && <p className="text-muted text-xs">{customer.address}</p>}
          </div>
          <div className="pt-2 border-t border-base"><Badge variant="accent">{customer.loyalty_points} Loyalty Points</Badge></div>
        </div>

        <div className="lg:col-span-2 grid grid-cols-2 sm:grid-cols-3 gap-4">
          {[
            { label: 'Total Spent',  value: `GHS ${Number(customer.total_spent).toFixed(2)}`, color: 'var(--color-accent)' },
            { label: 'Total Visits', value: String(totalVisits),                               color: 'var(--color-info)' },
            { label: 'Avg. Order',   value: `GHS ${avgOrder.toFixed(2)}`,                      color: 'var(--color-success)' },
          ].map(s => (
            <div key={s.label} className="card p-5">
              <p className="text-2xl font-bold" style={{ color: s.color }}>{s.value}</p>
              <p className="text-sm text-secondary mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="card overflow-hidden">
        <div className="px-6 py-4 border-b border-base"><h3 className="font-semibold text-primary">Purchase History</h3></div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-surface-2 text-left">
                {['Transaction', 'Date', 'Items', 'Total', 'Method', 'Status'].map(h => (
                  <th key={h} className="px-6 py-3 text-xs font-semibold text-muted uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-base">
              {history.length === 0 ? (
                <tr><td colSpan={6} className="px-6 py-10 text-center text-muted">No purchase history</td></tr>
              ) : history.map(t => (
                <tr key={t.id} className="hover:bg-surface-2 transition-pos">
                  <td className="px-6 py-4 font-mono text-accent">{t.transaction_code}</td>
                  <td className="px-6 py-4 text-secondary">{new Date(t.created_at).toLocaleDateString('en-GH')}</td>
                  <td className="px-6 py-4 text-secondary">{t.item_count}</td>
                  <td className="px-6 py-4 font-semibold text-primary">GHS {Number(t.total_amount).toFixed(2)}</td>
                  <td className="px-6 py-4"><Badge variant="info">{t.payment_method}</Badge></td>
                  <td className="px-6 py-4">
                    <span className="px-2.5 py-1 rounded-full text-xs font-medium"
                      style={{ backgroundColor: t.status === 'completed' ? 'var(--color-success-light)' : 'var(--color-danger-light)', color: t.status === 'completed' ? 'var(--color-success)' : 'var(--color-danger)' }}>
                      {t.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
