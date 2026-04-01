import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type NotificationType = 'sale' | 'low_stock' | 'out_of_stock' | 'refund' | 'new_customer' | 'info'

export interface Notification {
  id: string
  type: NotificationType
  title: string
  message: string
  timestamp: string
  read: boolean
  link?: string
}

interface NotificationState {
  notifications: Notification[]
  addNotification: (n: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void
  markRead: (id: string) => void
  markAllRead: () => void
  clear: () => void
}

export const useNotificationStore = create<NotificationState>()(
  persist(
    (set) => ({
      notifications: [],

      addNotification: (n) => {
        const notification: Notification = {
          ...n,
          id: `notif_${Date.now()}_${Math.random().toString(36).slice(2)}`,
          timestamp: new Date().toISOString(),
          read: false,
        }
        set(state => ({
          notifications: [notification, ...state.notifications].slice(0, 50), // keep last 50
        }))
      },

      markRead: (id) => set(state => ({
        notifications: state.notifications.map(n => n.id === id ? { ...n, read: true } : n),
      })),

      markAllRead: () => set(state => ({
        notifications: state.notifications.map(n => ({ ...n, read: true })),
      })),

      clear: () => set({ notifications: [] }),
    }),
    { name: 'pos-notifications' }
  )
)
