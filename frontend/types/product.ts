export interface Product {
  id: number
  name: string
  category: string
  price: number
  costPrice?: number
  barcode?: string
  description?: string
  imageUrl?: string
  quantity: number
  isActive: boolean
  createdAt: string
}

export interface ProductFormData {
  name: string
  category: string
  price: string
  costPrice: string
  barcode: string
  description: string
  quantity: string
  reorderLevel: string
  supplierName: string
  supplierPhone: string
}
