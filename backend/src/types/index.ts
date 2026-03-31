// ── API Response wrapper ───────────────────────────────────────────────────
export interface ApiResponse<T = unknown> {
  success: boolean
  data?: T
  message?: string
  errors?: Array<{ field: string; message: string }>
}

// ── Pagination ─────────────────────────────────────────────────────────────
export interface PaginationParams {
  limit?: number
  offset?: number
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  limit: number
  offset: number
}

// ── Auth ───────────────────────────────────────────────────────────────────
export type UserRole = 'admin' | 'manager' | 'cashier'

export interface TokenPayload {
  userId: number
  email: string
  role: UserRole
}

// ── Cart ───────────────────────────────────────────────────────────────────
export interface CartItemInput {
  productId: number
  quantity: number
  price?: number
}

// ── Payment ────────────────────────────────────────────────────────────────
export type PaymentMethod = 'cash' | 'momo' | 'card'
export type PaymentStatus = 'success' | 'failed' | 'pending'
export type SaleStatus    = 'completed' | 'refunded' | 'pending'

// ── Report filters ─────────────────────────────────────────────────────────
export interface DateRangeFilter {
  startDate?: string
  endDate?: string
}

export interface ReportFilter extends DateRangeFilter {
  days?: number
  limit?: number
}
