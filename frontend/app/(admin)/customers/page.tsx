'use client'

import { useState } from 'react'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Badge from '@/components/ui/Badge'
import Modal from '@/components/ui/Modal'

const mockCustomers = [
  { id: 1, name: 'Kwame Asante', phone: '0244123456', email: 'kwame@gmail.com', totalSpent: 1240.50, visits: 12, points: 120, joinedDate: '2024-01-15' },
  { id: 2, name: 'Ama Boateng', phone: '0551234567', email: 'ama.b@yahoo.com', totalSpent: 8432.00, visits: 67, points: 843, joinedDate: '2023-11-02' },
  { id: 3, name: 'Kofi Mensah', phone: '0271234567', email: '', totalSpent: 320.75, visits: 4, points: 32, joinedDate: '2024-03-20' },
  { id: 4, name: 'Abena Sarpong', phone: '0201234567', email: 'abena@outlook.com', totalSpent: 5610.00, visits: 43, points: 561, joinedDate: '2023-08-10' },
  { id: 5, name: 'Yaw Darko', phone: '0261234567', email: '', totalSpent: 190.25, visits: 2, points: 19, joinedDate: '2024-04-01' },
]

export default function CustomersPage() {
  const [search, setSearch] = useState('')
  const [showAdd, setShowAdd] = useState(false)
  const [form, setForm] = useState({ name: '', phone: '', email: '', address: '' })

  const filtered = mockCustomers.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.phone.includes(search) ||
    c.email.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-primary" style={{ fontFamily: 'var(--font-display)' }}>Customers</h1>
          <p className="text-secondary mt-1">{mockCustomers.length} registered customers</p>
        </div>
        <Button variant="accent" size="sm" onClick={() => setShowAdd(true)}>
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM4 19.235v-.11a6.375 6.375 0 0112.75 0v.109A12.318 12.318 0 0110.374 21c-2.331 0-4.512-.645-6.374-1.766z" />
          </svg>
          Add Customer
        </Button>
      </div>

      {/* Search */}
      <div className="card p-4">
        <Input
          placeholder="Search by name, phone, or email…"
          value={search}
          onChange={e => setSearch(e.target.value)}
          prefix={
            <svg className="w-4 h-4 text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
            </svg>
          }
        />
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-surface-2 text-left">
                {['Customer', 'Phone', 'Total Spent', 'Visits', 'Loyalty Points', 'Joined', ''].map(h => (
                  <th key={h} className="px-6 py-3 text-xs font-semibold text-muted uppercase tracking-wider whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-base">
              {filtered.map(c => (
                <tr key={c.id} className="hover:bg-surface-2 transition-pos">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center font-semibold text-xs text-white shrink-0"
                        style={{ backgroundColor: 'var(--color-accent)' }}
                      >
                        {c.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <p className="font-medium text-primary">{c.name}</p>
                        <p className="text-xs text-muted">{c.email || 'No email'}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-secondary font-mono">{c.phone}</td>
                  <td className="px-6 py-4 font-semibold text-primary">GHS {c.totalSpent.toFixed(2)}</td>
                  <td className="px-6 py-4 text-secondary">{c.visits}</td>
                  <td className="px-6 py-4">
                    <Badge variant={c.points >= 500 ? 'accent' : c.points >= 100 ? 'info' : 'default'}>
                      {c.points} pts
                    </Badge>
                  </td>
                  <td className="px-6 py-4 text-muted text-xs">{c.joinedDate}</td>
                  <td className="px-6 py-4">
                    <a href={`/customers/${c.id}`} className="text-accent hover:underline text-xs font-medium">
                      View →
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add customer modal */}
      <Modal open={showAdd} onClose={() => setShowAdd(false)} title="Add New Customer">
        <div className="space-y-4">
          <Input label="Full Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Kwame Asante" required />
          <Input label="Phone Number" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} placeholder="0244123456" />
          <Input label="Email (optional)" type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="customer@email.com" />
          <Input label="Address (optional)" value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} placeholder="Accra, Ghana" />
          <div className="flex gap-3 pt-2">
            <Button variant="ghost" fullWidth onClick={() => setShowAdd(false)}>Cancel</Button>
            <Button variant="accent" fullWidth>Save Customer</Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
