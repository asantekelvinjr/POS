import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { User } from '@/types/user'

interface AuthState {
  user: User | null
  token: string | null
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  setUser: (user: User) => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,

      // ── MOCK LOGIN: accepts any email/password ──────────────────────────
      // TODO: replace with real API when backend is ready:
      //   const data = await apiPost<{ user: User; token: string }>('/auth/login', { email, password })
      //   set({ user: data.user, token: data.token })
      login: async (email: string, _password: string) => {
        await new Promise(r => setTimeout(r, 400)) // fake network delay
        set({
          token: 'mock-token-dev',
          user: {
            id: 1,
            name: email.split('@')[0].replace(/[._]/g, ' '),
            email,
            role: 'admin',
            isActive: true,
            createdAt: new Date().toISOString(),
          },
        })
      },

      logout: () => {
        set({ user: null, token: null })
        window.location.href = '/login'
      },

      setUser: (user: User) => set({ user }),
    }),
    {
      name: 'pos-auth',
      partialize: (state) => ({ user: state.user, token: state.token }),
    }
  )
)
