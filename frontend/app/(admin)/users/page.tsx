'use client'
import { useState, useEffect } from 'react'
import { apiGet, apiPost, apiDelete } from '@/lib/api'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import Modal from '@/components/ui/Modal'
import Input from '@/components/ui/Input'

interface User { id: number; name: string; email: string; role: string; is_active: boolean; created_at: string }
const roleColor: Record<string, 'accent' | 'info' | 'default'> = { admin: 'accent', manager: 'info', cashier: 'default' }

export default function UsersPage() {
  const [users, setUsers]     = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [showAdd, setShowAdd] = useState(false)
  const [saving, setSaving]   = useState(false)
  const [error, setError]     = useState('')
  const [form, setForm]       = useState({ name: '', email: '', role: 'cashier', password: '' })

  useEffect(() => {
    apiGet<User[]>('/users').then(setUsers).catch(console.error).finally(() => setLoading(false))
  }, [])

  async function handleCreate() {
    setError('')
    setSaving(true)
    try {
      const u = await apiPost<User>('/users', form)
      setUsers(prev => [u, ...prev])
      setShowAdd(false)
      setForm({ name: '', email: '', role: 'cashier', password: '' })
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to create')
    } finally {
      setSaving(false)
    }
  }

  async function handleDeactivate(id: number) {
    if (!confirm('Deactivate this user?')) return
    try {
      await apiDelete(`/users/${id}`)
      setUsers(prev => prev.map(u => u.id === id ? { ...u, is_active: false } : u))
    } catch (e) {
      alert(e instanceof Error ? e.message : 'Failed')
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-primary" style={{ fontFamily: 'var(--font-display)' }}>Users & Access</h1>
          <p className="text-secondary mt-1">Manage staff accounts and permissions</p>
        </div>
        <Button variant="accent" size="sm" onClick={() => setShowAdd(true)}>
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15"/></svg>
          Add Staff
        </Button>
      </div>

      {/* Role cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { role: 'Admin',   perms: 'Full access — all pages, users, settings',           color: 'var(--color-accent)' },
          { role: 'Manager', perms: 'Products, inventory, reports — no user management',  color: 'var(--color-info)' },
          { role: 'Cashier', perms: 'POS screen only',                                    color: 'var(--color-text-muted)' },
        ].map(r => (
          <div key={r.role} className="card p-4 flex items-start gap-3">
            <div className="w-2 h-2 rounded-full mt-2 shrink-0" style={{ backgroundColor: r.color }}/>
            <div>
              <p className="font-semibold text-primary text-sm">{r.role}</p>
              <p className="text-xs text-secondary mt-0.5">{r.perms}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-surface-2 text-left">
                {['Staff Member', 'Email', 'Role', 'Status', 'Joined', ''].map(h => (
                  <th key={h} className="px-6 py-3 text-xs font-semibold text-muted uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-base">
              {loading ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <tr key={i}>{Array.from({ length: 6 }).map((_, j) => (
                    <td key={j} className="px-6 py-4"><div className="h-4 rounded animate-pulse" style={{ backgroundColor: 'var(--color-surface-3)', width: '70%' }}/></td>
                  ))}</tr>
                ))
              ) : users.map(u => (
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
                    <span className="flex items-center gap-1.5 text-xs font-medium" style={{ color: u.is_active ? 'var(--color-success)' : 'var(--color-text-muted)' }}>
                      <span className="w-1.5 h-1.5 rounded-full inline-block" style={{ backgroundColor: u.is_active ? 'var(--color-success)' : 'var(--color-text-muted)' }}/>
                      {u.is_active ? 'active' : 'inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-muted text-xs">{new Date(u.created_at).toLocaleDateString('en-GH')}</td>
                  <td className="px-6 py-4 flex items-center gap-3">
                    <a href={`/users/${u.id}`} className="text-accent hover:underline text-xs font-medium">Edit</a>
                    {u.is_active && (
                      <button onClick={() => handleDeactivate(u.id)} className="text-danger hover:underline text-xs font-medium">Deactivate</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal open={showAdd} onClose={() => setShowAdd(false)} title="Add Staff Member">
        <div className="space-y-4">
          {error && <div className="p-3 rounded-pos-md text-sm" style={{ backgroundColor: 'var(--color-danger-light)', color: 'var(--color-danger)' }}>{error}</div>}
          <Input label="Full Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Kwabena Osei" required/>
          <Input label="Email" type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="staff@store.com" required/>
          <div>
            <label className="block text-sm font-medium text-secondary mb-1.5">Role</label>
            <select value={form.role} onChange={e => setForm({ ...form, role: e.target.value })} className="w-full input-pos px-3 py-2.5 text-sm">
              <option value="cashier">Cashier</option>
              <option value="manager">Manager</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <Input label="Password" type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} placeholder="Min 6 characters" required/>
          <div className="flex gap-3 pt-2">
            <Button variant="ghost" fullWidth onClick={() => setShowAdd(false)}>Cancel</Button>
            <Button variant="accent" fullWidth loading={saving} onClick={handleCreate}>Create Account</Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
