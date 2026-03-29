'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/authStore'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'

export default function LoginPage() {
  const router = useRouter()
  const { login } = useAuthStore()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login(email, password)
      router.push('/dashboard')
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Invalid credentials. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-base flex">
      {/* Left panel — branding */}
      <div
        className="hidden lg:flex lg:w-1/2 flex-col justify-between p-12 relative overflow-hidden"
        style={{ backgroundColor: 'var(--color-sidebar-bg)' }}
      >
        {/* Background pattern */}
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `radial-gradient(circle at 25% 25%, var(--color-accent) 0%, transparent 50%),
                              radial-gradient(circle at 75% 75%, var(--color-highlight) 0%, transparent 50%)`,
          }}
        />
        <div className="absolute inset-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.03'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}
        />

        <div className="relative z-10">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-pos-md flex items-center justify-center font-bold text-lg"
              style={{ backgroundColor: 'var(--color-accent)', color: 'white', fontFamily: 'var(--font-display)' }}
            >
              P
            </div>
            <span
              className="text-xl font-bold tracking-tight text-white"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              PayPoint POS
            </span>
          </div>
        </div>

        <div className="relative z-10 space-y-6">
          <h1
            className="text-5xl font-bold text-white leading-tight"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Sell smarter,<br />
            <span style={{ color: 'var(--color-accent)' }}>grow faster.</span>
          </h1>
          <p className="text-lg leading-relaxed" style={{ color: 'var(--color-sidebar-text)' }}>
            Your complete point of sale solution with Paystack-powered payments — built for Ghanaian businesses.
          </p>

          {/* Feature pills */}
          <div className="flex flex-wrap gap-2 pt-2">
            {['Mobile Money', 'Real-time Inventory', 'Smart Reports', 'Multi-role Access'].map(f => (
              <span
                key={f}
                className="text-xs font-medium px-3 py-1.5 rounded-full"
                style={{
                  backgroundColor: 'rgba(16,185,129,0.15)',
                  color: 'var(--color-accent)',
                  border: '1px solid rgba(16,185,129,0.2)'
                }}
              >
                {f}
              </span>
            ))}
          </div>
        </div>

        <div className="relative z-10 text-xs" style={{ color: 'var(--color-sidebar-text)' }}>
          © 2024 PayPoint POS · Made for Ghana
        </div>
      </div>

      {/* Right panel — login form */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-16">
        <div className="w-full max-w-md space-y-8">
          {/* Mobile logo */}
          <div className="flex items-center gap-3 lg:hidden">
            <div
              className="w-9 h-9 rounded-pos-md flex items-center justify-center font-bold"
              style={{ backgroundColor: 'var(--color-accent)', color: 'white', fontFamily: 'var(--font-display)' }}
            >P</div>
            <span className="text-lg font-bold" style={{ fontFamily: 'var(--font-display)' }}>PayPoint POS</span>
          </div>

          <div>
            <h2 className="text-3xl font-bold text-primary" style={{ fontFamily: 'var(--font-display)' }}>
              Welcome back
            </h2>
            <p className="mt-2 text-secondary">Sign in to your account to continue</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <Input
              label="Email address"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="cashier@store.com"
              required
              autoComplete="email"
            />

            <div>
              <Input
                label="Password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                autoComplete="current-password"
                suffix={
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-muted hover:text-secondary transition-pos text-sm"
                  >
                    {showPassword ? 'Hide' : 'Show'}
                  </button>
                }
              />
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded accent-[var(--color-accent)]"
                />
                <span className="text-secondary">Remember me</span>
              </label>
              <a href="#" className="text-accent hover:underline font-medium">
                Forgot password?
              </a>
            </div>

            {error && (
              <div
                className="flex items-center gap-2.5 p-3.5 rounded-pos-md text-sm"
                style={{ backgroundColor: 'var(--color-danger-light)', color: 'var(--color-danger)' }}
              >
                <svg className="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clipRule="evenodd" />
                </svg>
                {error}
              </div>
            )}

            <Button type="submit" variant="accent" size="lg" loading={loading} fullWidth>
              {loading ? 'Signing in…' : 'Sign in'}
            </Button>
          </form>

          <p className="text-center text-sm text-muted">
            Need an account?{' '}
            <span className="text-accent font-medium cursor-pointer hover:underline">
              Contact your administrator
            </span>
          </p>
        </div>
      </div>
    </div>
  )
}
