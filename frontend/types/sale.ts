import { Product } from './product'

export interface CartItem {
  id: number
  name: string
  price: number
  quantity: number
  category: string
  barcode?: string
}

export interface Sale {
  id: number
  transactionCode: string
  userId: number
  customerId?: number
  subtotal: number
  discountAmount: number
  taxAmount: number
  totalAmount: number
  paymentMethod: 'cash' | 'momo' | 'card'
  status: 'completed' | 'refunded' | 'pending'
  notes?: string
  createdAt: string
}

export interface SaleItem {
  id: number
  saleId: number
  productId: number
  productName: string
  quantity: number
  unitPrice: number
  discount: number
  lineTotal: number
}

export interface Payment {
  id: number
  saleId: number
  paystackRef?: string
  amountPaid: number
  amountTendered?: number
  changeGiven?: number
  method: 'cash' | 'momo' | 'card'
  status: 'success' | 'failed' | 'pending'
  verifiedAt?: string
  createdAt: string
}

export interface CreateSalePayload {
  items: CartItem[]
  customerId?: number
  paymentMethod: 'cash' | 'momo' | 'card'
  amountTendered?: number
  paystackRef?: string
  discountAmount?: number
}
