'use client'

import { useState } from 'react'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import Modal from '@/components/ui/Modal'
import Input from '@/components/ui/Input'

const mockUsers = [
  { id: 1, name: 'Admin User', email: 'admin@store.com', role: 'admin', status: 'active', lastLogin: '2 min ago' },
  { id: 2, name: 'Esi Nyarko', email: 'esi@store.com', role: 'manager', status: 'active', lastLogin: '1 hr ago' },
  { id: 3, name: 'Kwabena Osei', email: 'kwabena@store.com', role: 'cashier', status: 'active', lastLogin: '30 min ago' },
  { id: 4, name: 'Adjoa Sarpong', email: 'adjoa@store.com', role: 'cashier', status: 'active', lastLogin: 'Yesterday' },
  { id: 5, name: 'Nana Yaw', email: 'nana@store.com', role: 'cashier', status: 'inactive', lastLogin: '3 days ago' },
]

const roleColor: Record<string, 'accent' | 'info' | 'default'> = {
  admin: 'accent',
  manager: 'info',
  cashier: 'default',
}

export default function UsersPage() {
  const [showAdd, setShowAdd] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', role: 'cashier', password: '' })

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-primary" style={{ fontFamily: 'var(--font-display)' }}>Users & Access</h1>
          <p className="text-secondary mt-1">Manage staff accounts and permissions</p>
        </div>
        <Button variant="accent" size="sm" onClick={() => setShowAdd(true)}>
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Add Staff
        </Button>
      </div>

      {/* Roles explanation */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { role: 'Admin', perms: 'Full access — settings, users, all reports', color: 'var(--color-accent)' },
          { role: 'Manager', perms: 'Products, inventory, reports, no user management', color: 'var(--color-info)' },
          { role: 'Cashier', perms: 'POS screen, basic sales only', color: 'var(--color-text-muted)' },
        ].map(r => (
          <div key={r.role} className="card p-4 flex items-start gap-3">
            <div className="w-2 h-2 rounded-full mt-2 shrink-0" style={{ backgroundColor: r.color }} />
            <div>
              <p className="font-semibold text-primary text-sm">{r.role}</p>
              <p className="text-xs text-secondary mt-0.5">{r.perms}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Users table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-surface-2 text-left">
                {['Staff Member', 'Email', 'Role', 'Status', 'Last Login', ''].map(h => (
                  <th key={h} className="px-6 py-3 text-xs font-semibold text-muted uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-base">
              {mockUsers.map(u => (
                <tr key={u.id} className="hover:bg-surface-2 transition-pos">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center font-semibold text-xs text-white shrink-0"
                        style={{ backgroundColor: u.role === 'admin' ? 'var(--color-accent)' : u.role === 'manager' ? 'var(--color-info)' : 'var(--color-text-muted)' }}>
                        {u.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <span className="font-medium text-primary">{u.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-secondary">{u.email}</td>
                  <td className="px-6 py-4"><Badge variant={roleColor[u.role]}>{u.role}</Badge></td>
                  <td className="px-6 py-4">
                    <span className="flex items-center gap-1.5 text-xs font-medium"
                      style={{ color: u.status === 'active' ? 'var(--color-success)' : 'var(--color-text-muted)' }}>
                      <span className="w-1.5 h-1.5 rounded-full inline-block"
                        style={{ backgroundColor: u.status === 'active' ? 'var(--color-success)' : 'var(--color-text-muted)' }} />
                      {u.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-muted text-xs">{u.lastLogin}</td>
                  <td className="px-6 py-4">
                    <a href={`/users/${u.id}`} className="text-accent hover:underline text-xs font-medium">Edit</a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add staff modal */}
      <Modal open={showAdd} onClose={() => setShowAdd(false)} title="Add Staff Member">
        <div className="space-y-4">
          <Input label="Full Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Kwabena Osei" required />
          <Input label="Email" type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="staff@store.com" required />
          <div>
            <label className="block text-sm font-medium text-secondary mb-1.5">Role</label>
            <select
              value={form.role}
              onChange={e => setForm({ ...form, role: e.target.value })}
              className="w-full input-pos px-3 py-2.5 text-sm"
            >
              <option value="cashier">Cashier</option>
              <option value="manager">Manager</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <Input label="Temporary Password" type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} placeholder="Min 8 characters" required />
          <div className="flex gap-3 pt-2">
            <Button variant="ghost" fullWidth onClick={() => setShowAdd(false)}>Cancel</Button>
            <Button variant="accent" fullWidth>Create Account</Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
