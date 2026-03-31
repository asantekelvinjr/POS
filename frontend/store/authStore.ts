import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { User } from '@/types/user'
import { apiPost, apiGet } from '@/lib/api'

interface AuthState {
  user: User | null
  token: string | null
  rememberMe: boolean
  login: (email: string, password: string, remember: boolean) => Promise<void>
  logout: () => void
  setUser: (user: User) => void
  fetchMe: () => Promise<void>
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      rememberMe: false,

      login: async (email: string, password: string, remember: boolean) => {
        const data = await apiPost<{ user: User; token: string }>('/auth/login', { email, password })
        set({ user: data.user, token: data.token, rememberMe: remember })
      },

      logout: async () => {
        try { await apiPost('/auth/logout', {}) } catch { /* ignore */ }
        set({ user: null, token: null, rememberMe: false })
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
      // Always persist — remember me just controls session UX, not storage
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        rememberMe: state.rememberMe,
      }),
    }
  )
)
