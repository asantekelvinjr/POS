'use client'
import { useState, useEffect } from 'react'
import Badge from '@/components/ui/Badge'
import Input from '@/components/ui/Input'
import { useAuthStore } from '@/store/authStore'

interface Sale {
  id: number
  transaction_code: string
  cashier_name: string
  customer_name: string | null
  total_amount: number
  payment_method: string
  status: string
  created_at: string
  item_count?: number
}

export default function SalesHistoryPage() {
  const { user }          = useAuthStore()
  const [sales, setSales] = useState<Sale[]>([])
  const [loading, setLoading]   = useState(true)
  const [error, setError]       = useState('')
  const [search, setSearch]     = useState('')

  useEffect(() => {
    async function load() {
      try {
        const stored = localStorage.getItem('pos-auth')
        const token  = stored ? JSON.parse(stored)?.state?.token : null
        const BASE   = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api'
        // Cashiers see all sales they're allowed to see
        const res = await fetch(`${BASE}/sales?limit=100`, {
          headers: { Authorization: `Bearer ${token}` },
          cache: 'no-store',
        })
        if (!res.ok) throw new Error('Could not load sales')
        const json = await res.json()
        setSales(json.data || [])
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Failed to load sales')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const filtered = sales.filter(s =>
    s.transaction_code.toLowerCase().includes(search.toLowerCase()) ||
    (s.customer_name || '').toLowerCase().includes(search.toLowerCase()) ||
    s.cashier_name.toLowerCase().includes(search.toLowerCase())
  )

  const isCashierOnly = user?.role === 'cashier'

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-primary" style={{ fontFamily: 'var(--font-display)' }}>
          Sales History
        </h1>
        <p className="text-secondary mt-1">
          {isCashierOnly
            ? 'View your transactions and reprint receipts'
            : 'All transactions — click any row to view the receipt'}
        </p>
      </div>

      {/* Search */}
      <div className="card p-4">
        <Input
          placeholder="Search by transaction code, customer, or cashier…"
          value={search}
          onChange={e => setSearch(e.target.value)}
          prefix={
            <svg className="w-4 h-4 text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"/>
            </svg>
          }
        />
      </div>

      {/* Error */}
      {error && (
        <div className="p-4 rounded-pos-md text-sm"
          style={{ backgroundColor: 'var(--color-danger-light)', color: 'var(--color-danger)' }}>
          {error}
        </div>
      )}

      {/* Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ backgroundColor: 'var(--color-surface-2)' }} className="text-left">
                {['Transaction', 'Cashier', 'Customer', 'Total', 'Method', 'Date & Time', 'Status', ''].map(h => (
                  <th key={h} className="px-6 py-3 text-xs font-semibold text-muted uppercase tracking-wider whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 6 }).map((_, i) => (
                  <tr key={i} style={{ borderTop: '1px solid var(--color-border)' }}>
                    {Array.from({ length: 8 }).map((_, j) => (
                      <td key={j} className="px-6 py-4">
                        <div className="h-4 rounded animate-pulse"
                          style={{ backgroundColor: 'var(--color-surface-3)', width: '70%' }}/>
                      </td>
                    ))}
                  </tr>
                ))
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center text-muted">
                    {search ? 'No sales match your search' : 'No sales yet'}
                  </td>
                </tr>
              ) : filtered.map(sale => (
                <tr
                  key={sale.id}
                  style={{ borderTop: '1px solid var(--color-border)', cursor: 'pointer' }}
                  className="transition-pos"
                  onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'var(--color-surface-2)')}
                  onMouseLeave={e => (e.currentTarget.style.backgroundColor = '')}
                  onClick={() => window.location.href = `/pos/receipt/${sale.id}`}
                >
                  <td className="px-6 py-4 font-mono font-medium text-accent">
                    {sale.transaction_code}
                  </td>
                  <td className="px-6 py-4 text-secondary">{sale.cashier_name}</td>
                  <td className="px-6 py-4 text-primary">{sale.customer_name || 'Walk-in'}</td>
                  <td className="px-6 py-4 font-semibold text-primary">
                    GHS {Number(sale.total_amount).toFixed(2)}
                  </td>
                  <td className="px-6 py-4">
                    <Badge variant="info">{sale.payment_method}</Badge>
                  </td>
                  <td className="px-6 py-4 text-muted text-xs">
                    {new Date(sale.created_at).toLocaleString('en-GH', {
                      day: '2-digit', month: 'short', year: 'numeric',
                      hour: '2-digit', minute: '2-digit',
                    })}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className="px-2.5 py-1 rounded-full text-xs font-medium"
                      style={{
                        backgroundColor: sale.status === 'completed'
                          ? 'var(--color-success-light)' : 'var(--color-danger-light)',
                        color: sale.status === 'completed'
                          ? 'var(--color-success)' : 'var(--color-danger)',
                      }}
                    >
                      {sale.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-xs font-medium text-accent hover:underline">
                      Receipt →
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer count */}
        {!loading && filtered.length > 0 && (
          <div className="px-6 py-3 border-t border-base text-xs text-muted"
            style={{ backgroundColor: 'var(--color-surface-2)' }}>
            Showing {filtered.length} of {sales.length} transactions · Click any row to view receipt
          </div>
        )}
      </div>
    </div>
  )
}
