import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { User } from '@/types/user'
import { apiPost, apiGet } from '@/lib/api'

interface AuthState {
  user: User | null
  token: string | null
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  setUser: (user: User) => void
  fetchMe: () => Promise<void>
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,

      login: async (email: string, password: string) => {
        const data = await apiPost<{ user: User; token: string }>('/auth/login', { email, password })
        set({ user: data.user, token: data.token })
      },

      logout: async () => {
        try { await apiPost('/auth/logout', {}) } catch { /* ignore */ }
        set({ user: null, token: null })
        window.location.href = '/login'
      },

      fetchMe: async () => {
        const user = await apiGet<User>('/auth/me')
        set({ user })
      },

      setUser: (user: User) => set({ user }),
    }),
    {
      name: 'pos-auth',
      partialize: (state) => ({ user: state.user, token: state.token }),
    }
  )
)
