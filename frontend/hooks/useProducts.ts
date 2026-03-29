'use client'

import { useState, useEffect, useCallback } from 'react'
import { Product } from '@/types/product'
import { apiGet, apiPost, apiPut, apiDelete } from '@/lib/api'

// Mock data for development — replace with real API calls
const MOCK_PRODUCTS: Product[] = [
  { id: 1, name: 'Milo 400g', category: 'Beverages', price: 12.00, costPrice: 8.50, barcode: '6001087014218', quantity: 84, isActive: true, createdAt: '2024-01-01' },
  { id: 2, name: 'Fanta 500ml', category: 'Beverages', price: 7.00, costPrice: 4.50, barcode: '5449000054227', quantity: 12, isActive: true, createdAt: '2024-01-01' },
  { id: 3, name: 'Mentos Roll', category: 'Food', price: 3.50, costPrice: 2.00, barcode: '8710400024700', quantity: 5, isActive: true, createdAt: '2024-01-01' },
  { id: 4, name: 'Indomie Chicken', category: 'Food', price: 2.00, costPrice: 1.20, barcode: '8998553500404', quantity: 210, isActive: true, createdAt: '2024-01-01' },
  { id: 5, name: 'Paracetamol 500mg', category: 'Health', price: 1.50, costPrice: 0.80, barcode: '5012295510019', quantity: 0, isActive: true, createdAt: '2024-01-01' },
  { id: 6, name: 'Fair & White Cream', category: 'Health', price: 25.00, costPrice: 16.00, barcode: '3760120740012', quantity: 18, isActive: true, createdAt: '2024-01-01' },
  { id: 7, name: 'Sunlight Soap 200g', category: 'Household', price: 4.50, costPrice: 2.80, barcode: '8712561530046', quantity: 8, isActive: true, createdAt: '2024-01-01' },
  { id: 8, name: 'Peak Milk 400g', category: 'Beverages', price: 18.00, costPrice: 12.00, barcode: '5900951010048', quantity: 45, isActive: true, createdAt: '2024-01-01' },
  { id: 9, name: 'Colgate Toothpaste', category: 'Health', price: 8.00, costPrice: 5.50, barcode: '7891024121381', quantity: 32, isActive: true, createdAt: '2024-01-01' },
  { id: 10, name: 'Omo 500g', category: 'Household', price: 9.00, costPrice: 6.00, barcode: '8720632014875', quantity: 60, isActive: true, createdAt: '2024-01-01' },
]

const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK === 'true' || true // flip to false when backend is ready

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchProducts = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      if (USE_MOCK) {
        await new Promise(r => setTimeout(r, 300)) // simulate network
        setProducts(MOCK_PRODUCTS)
      } else {
        const data = await apiGet<Product[]>('/products')
        setProducts(data)
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load products')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchProducts()
  }, [fetchProducts])

  async function createProduct(data: Partial<Product>): Promise<Product> {
    const result = await apiPost<Product>('/products', data)
    setProducts(prev => [...prev, result])
    return result
  }

  async function updateProduct(id: number, data: Partial<Product>): Promise<Product> {
    const result = await apiPut<Product>(`/products/${id}`, data)
    setProducts(prev => prev.map(p => p.id === id ? result : p))
    return result
  }

  async function deleteProduct(id: number): Promise<void> {
    await apiDelete(`/products/${id}`)
    setProducts(prev => prev.filter(p => p.id !== id))
  }

  return {
    products,
    loading,
    error,
    refetch: fetchProducts,
    createProduct,
    updateProduct,
    deleteProduct,
  }
}
