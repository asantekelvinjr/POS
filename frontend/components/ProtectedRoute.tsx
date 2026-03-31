'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/authStore'

interface ProtectedRouteProps {
  children: React.ReactNode
  allowedRoles?: string[]
}

export default function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const router = useRouter()
  const { user, token } = useAuthStore()
  const [checked, setChecked] = useState(false)

  useEffect(() => {
    // Wait one tick so Zustand can rehydrate from localStorage
    const timer = setTimeout(() => {
      if (!token) {
        router.replace('/login')
        return
      }
      if (allowedRoles && user && !allowedRoles.includes(user.role)) {
        // Don't send to login — send to the right home for their role
        if (user.role === 'cashier') router.replace('/pos')
        else router.replace('/dashboard')
        return
      }
      setChecked(true)
    }, 50)
    return () => clearTimeout(timer)
  }, [token, user, allowedRoles, router])

  if (!checked) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-base">
        <div className="flex items-center gap-3 text-secondary">
          <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
          </svg>
          <span className="text-sm">Loading…</span>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
