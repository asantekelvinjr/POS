export type UserRole = 'admin' | 'manager' | 'cashier'

export interface User {
  id: number
  name: string
  email: string
  role: UserRole
  isActive: boolean
  createdAt: string
}

export interface AuthUser extends User {
  token: string
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface LoginResponse {
  user: User
  token: string
}
