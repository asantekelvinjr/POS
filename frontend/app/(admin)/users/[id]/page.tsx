'use client'

import { use } from 'react'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'

export default function UserDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-2 text-sm text-muted mb-2">
          <a href="/users" className="hover:text-accent transition-pos">Users</a>
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
          <span className="text-primary font-medium">Edit User #{id}</span>
        </div>
        <h1 className="text-2xl font-bold text-primary" style={{ fontFamily: 'var(--font-display)' }}>Edit Staff Member</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 card p-6 space-y-5">
          <h2 className="font-semibold text-primary border-b border-base pb-3">Account Details</h2>
          <Input label="Full Name" defaultValue="Kwabena Osei" />
          <Input label="Email" type="email" defaultValue="kwabena@store.com" />
          <div>
            <label className="block text-sm font-medium text-secondary mb-1.5">Role</label>
            <select className="w-full input-pos px-3 py-2.5 text-sm">
              <option value="cashier">Cashier</option>
              <option value="manager">Manager</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-secondary mb-1.5">Status</label>
            <div className="flex gap-4">
              {['active', 'inactive'].map(s => (
                <label key={s} className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" name="status" value={s} defaultChecked={s === 'active'}
                    className="accent-[var(--color-accent)]" />
                  <span className="text-sm text-primary capitalize">{s}</span>
                </label>
              ))}
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <Button variant="ghost" href="/users">Cancel</Button>
            <Button variant="accent">Save Changes</Button>
          </div>
        </div>

        <div className="space-y-4">
          <div className="card p-5">
            <h3 className="font-semibold text-primary mb-4 text-sm">Reset Password</h3>
            <div className="space-y-3">
              <Input label="New Password" type="password" placeholder="Min 8 characters" />
              <Input label="Confirm Password" type="password" placeholder="Repeat password" />
              <Button variant="ghost" size="sm" fullWidth>Reset Password</Button>
            </div>
          </div>
          <div className="card p-5 border border-danger-light">
            <h3 className="font-semibold text-danger mb-2 text-sm">Danger Zone</h3>
            <p className="text-xs text-muted mb-3">Deactivating this account will prevent the user from logging in.</p>
            <Button variant="danger" size="sm" fullWidth>Deactivate Account</Button>
          </div>
        </div>
      </div>
    </div>
  )
}
