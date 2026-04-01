'use client'
import { useState, useEffect } from 'react'
import { apiGet, apiPost } from '@/lib/api'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Badge from '@/components/ui/Badge'
import Modal from '@/components/ui/Modal'
import { useNotificationStore } from '@/store/notificationStore'

interface Customer {
  id: number; name: string; phone: string | null; email: string | null
  loyalty_points: number; total_spent: number; created_at: string
}

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [loading, setLoading]     = useState(true)
  const [search, setSearch]       = useState('')
  const [showAdd, setShowAdd]     = useState(false)
  const [saving, setSaving]       = useState(false)
  const [error, setError]         = useState('')
  const [form, setForm]           = useState({ name: '', phone: '', email: '', address: '' })
  const { addNotification }       = useNotificationStore()

  useEffect(() => {
    apiGet<Customer[]>('/customers').then(setCustomers).catch(console.error).finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    const t = setTimeout(() => {
      const q = search.trim()
      if (q.length >= 2)
        apiGet<Customer[]>(`/customers?search=${encodeURIComponent(q)}`).then(setCustomers).catch(console.error)
      else if (q === '')
        apiGet<Customer[]>('/customers').then(setCustomers).catch(console.error)
    }, 300)
    return () => clearTimeout(t)
  }, [search])

  async function handleAdd() {
    setError('')
    if (!form.name.trim()) { setError('Name is required'); return }
    setSaving(true)
    try {
      const c = await apiPost<Customer>('/customers', form)
      setCustomers(prev => [c, ...prev])
      addNotification({
        type: 'new_customer',
        title: 'New customer registered',
        message: `${c.name} has been added to your customer list`,
        link: `/customers/${c.id}`,
      })
      setShowAdd(false)
      setForm({ name: '', phone: '', email: '', address: '' })
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to save customer')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-primary" style={{ fontFamily: 'var(--font-display)' }}>Customers</h1>
          <p className="text-secondary mt-1">{customers.length} registered customers</p>
        </div>
        <Button variant="accent" size="sm" onClick={() => setShowAdd(true)}>
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM4 19.235v-.11a6.375 6.375 0 0112.75 0v.109A12.318 12.318 0 0110.374 21c-2.331 0-4.512-.645-6.374-1.766z"/>
          </svg>
          Add Customer
        </Button>
      </div>

      <div className="card p-4">
        <Input placeholder="Search by name, phone, or email…" value={search} onChange={e => setSearch(e.target.value)}
          prefix={<svg className="w-4 h-4 text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"/></svg>}
        />
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left" style={{ backgroundColor: 'var(--color-surface-2)' }}>
                {['Customer', 'Phone', 'Total Spent', 'Loyalty Points', 'Joined', ''].map(h => (
                  <th key={h} className="px-6 py-3 text-xs font-semibold text-muted uppercase tracking-wider whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} style={{ borderTop: '1px solid var(--color-border)' }}>
                    {Array.from({ length: 6 }).map((_, j) => (
                      <td key={j} className="px-6 py-4">
                        <div className="h-4 rounded animate-pulse" style={{ backgroundColor: 'var(--color-surface-3)', width: '70%' }}/>
                      </td>
                    ))}
                  </tr>
                ))
              ) : customers.length === 0 ? (
                <tr><td colSpan={6} className="px-6 py-12 text-center text-muted">No customers found</td></tr>
              ) : customers.map(c => (
                <tr key={c.id} className="transition-pos" style={{ borderTop: '1px solid var(--color-border)' }}
                  onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'var(--color-surface-2)')}
                  onMouseLeave={e => (e.currentTarget.style.backgroundColor = '')}>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center font-semibold text-xs text-white shrink-0"
                        style={{ backgroundColor: 'var(--color-accent)' }}>
                        {c.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <p className="font-medium text-primary">{c.name}</p>
                        <p className="text-xs text-muted">{c.email || 'No email'}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-secondary font-mono">{c.phone || '—'}</td>
                  <td className="px-6 py-4 font-semibold text-primary">GHS {Number(c.total_spent).toFixed(2)}</td>
                  <td className="px-6 py-4">
                    <Badge variant={c.loyalty_points >= 500 ? 'accent' : c.loyalty_points >= 100 ? 'info' : 'default'}>
                      {c.loyalty_points} pts
                    </Badge>
                  </td>
                  <td className="px-6 py-4 text-muted text-xs">{new Date(c.created_at).toLocaleDateString('en-GH')}</td>
                  <td className="px-6 py-4">
                    <a href={`/customers/${c.id}`} className="text-accent hover:underline text-xs font-medium">View →</a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal open={showAdd} onClose={() => { setShowAdd(false); setError('') }} title="Add New Customer">
        <div className="space-y-4">
          {error && (
            <div className="p-3 rounded-pos-md text-sm" style={{ backgroundColor: 'var(--color-danger-light)', color: 'var(--color-danger)' }}>
              {error}
            </div>
          )}
          <Input label="Full Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Kwame Asante" required/>
          <Input label="Phone Number" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} placeholder="0244123456" hint="Ghana format: 0244XXXXXX"/>
          <Input label="Email (optional)" type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="customer@email.com"/>
          <Input label="Address (optional)" value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} placeholder="Accra, Ghana"/>
          <div className="flex gap-3 pt-2">
            <Button variant="ghost" fullWidth onClick={() => { setShowAdd(false); setError('') }}>Cancel</Button>
            <Button variant="accent" fullWidth loading={saving} onClick={handleAdd}>Save Customer</Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
