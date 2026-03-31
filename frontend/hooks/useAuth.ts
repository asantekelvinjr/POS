import { useAuthStore } from '@/store/authStore'

export function useAuth() {
  const { user, token, login, logout, fetchMe } = useAuthStore()
  const isAuthenticated = !!token
  const isAdmin   = user?.role === 'admin'
  const isManager = user?.role === 'manager' || isAdmin
  const isCashier = !!user
  return { user, token, isAuthenticated, isAdmin, isManager, isCashier, login, logout, fetchMe }
}
