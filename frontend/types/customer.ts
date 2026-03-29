export interface Customer {
  id: number
  name: string
  phone?: string
  email?: string
  address?: string
  loyaltyPoints: number
  totalSpent: number
  createdAt: string
}

export interface CustomerFormData {
  name: string
  phone: string
  email: string
  address: string
}
