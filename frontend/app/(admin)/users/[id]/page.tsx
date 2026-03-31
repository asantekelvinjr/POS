'use client'
import { use, useEffect, useState } from 'react'
import { apiGet, apiPut } from '@/lib/api'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'

interface User { id: number; name: string; email: string; role: string; is_active: boolean }

export default function UserDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id }      = use(params)
  const [user, setUser]     = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving]   = useState(false)
  const [resetting, setResetting] = useState(false)
  const [error, setError]   = useState('')
  const [success, setSuccess] = useState('')
  const [form, setForm]     = useState({ name: '', email: '', role: 'cashier', isActive: true })
  const [newPassword, setNewPassword] = useState('')

  useEffect(() => {
    apiGet<User>(`/users/${id}`)
      .then(u => { setUser(u); setForm({ name: u.name, email: u.email, role: u.role, isActive: u.is_active }) })
      .catch(() => setError('Failed to load user'))
      .finally(() => setLoading(false))
  }, [id])

  async function handleSave() {
    setError(''); setSuccess(''); setSaving(true)
    try {
      const updated = await apiPut<User>(`/users/${id}`, form)
      setUser(updated)
      setSuccess('Changes saved successfully')
    } catch (e) { setError(e instanceof Error ? e.message : 'Failed') }
    finally { setSaving(false) }
  }

  async function handleResetPassword() {
    if (!newPassword || newPassword.length < 6) { setError('Password must be at least 6 characters'); return }
    setError(''); setResetting(true)
    try {
      await apiPut(`/users/${id}/reset-password`, { newPassword })
      setNewPassword('')
      setSuccess('Password reset successfully')
    } catch (e) { setError(e instanceof Error ? e.message : 'Failed') }
    finally { setResetting(false) }
  }

  if (loading) return <div className="card p-8 animate-pulse h-64"/>
  if (!user) return <div className="card p-8 text-center text-muted">User not found</div>

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-2 text-sm text-muted mb-2">
          <a href="/users" className="hover:text-accent transition-pos">Users</a>
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/></svg>
          <span className="text-primary font-medium">{user.name}</span>
        </div>
        <h1 className="text-2xl font-bold text-primary" style={{ fontFamily: 'var(--font-display)' }}>Edit Staff Member</h1>
      </div>

      {error   && <div className="p-3.5 rounded-pos-md text-sm" style={{ backgroundColor: 'var(--color-danger-light)', color: 'var(--color-danger)' }}>{error}</div>}
      {success && <div className="p-3.5 rounded-pos-md text-sm" style={{ backgroundColor: 'var(--color-success-light)', color: 'var(--color-success)' }}>{success}</div>}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 card p-6 space-y-5">
          <h2 className="font-semibold text-primary border-b border-base pb-3">Account Details</h2>
          <Input label="Full Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}/>
          <Input label="Email" type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}/>
          <div>
            <label className="block text-sm font-medium text-secondary mb-1.5">Role</label>
            <select value={form.role} onChange={e => setForm({ ...form, role: e.target.value })} className="w-full input-pos px-3 py-2.5 text-sm">
              <option value="cashier">Cashier</option>
              <option value="manager">Manager</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-secondary mb-1.5">Status</label>
            <div className="flex gap-4">
              {['true', 'false'].map(s => (
                <label key={s} className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" name="status" value={s} checked={String(form.isActive) === s} onChange={() => setForm({ ...form, isActive: s === 'true' })} className="accent-[var(--color-accent)]"/>
                  <span className="text-sm text-primary capitalize">{s === 'true' ? 'Active' : 'Inactive'}</span>
                </label>
              ))}
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <Button variant="ghost" href="/users">Cancel</Button>
            <Button variant="accent" loading={saving} onClick={handleSave}>Save Changes</Button>
          </div>
        </div>

        <div className="space-y-4">
          <div className="card p-5">
            <h3 className="font-semibold text-primary mb-4 text-sm">Reset Password</h3>
            <div className="space-y-3">
              <Input label="New Password" type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} placeholder="Min 6 characters"/>
              <Button variant="ghost" size="sm" fullWidth loading={resetting} onClick={handleResetPassword}>Reset Password</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
