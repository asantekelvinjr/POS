'use client'
import { useState, useEffect, useCallback } from 'react'
import { Product } from '@/types/product'
import { apiGet, apiPost, apiPut, apiDelete } from '@/lib/api'

export function useProducts() {
  const [products, setProducts]   = useState<Product[]>([])
  const [loading, setLoading]     = useState(true)
  const [error, setError]         = useState<string | null>(null)

  const fetchProducts = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await apiGet<Product[]>('/products')
      setProducts(data)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load products')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchProducts() }, [fetchProducts])

  async function searchProducts(term: string) {
    try {
      const data = await apiGet<Product[]>(`/products?search=${encodeURIComponent(term)}`)
      setProducts(data)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Search failed')
    }
  }

  async function getByBarcode(barcode: string): Promise<Product | null> {
    try {
      const data = await apiGet<Product>(`/products?barcode=${encodeURIComponent(barcode)}`)
      // backend returns array when using list endpoint with ?barcode=
      const result = Array.isArray(data) ? (data as Product[])[0] : data
      return result || null
    } catch {
      return null
    }
  }

  async function createProduct(data: Partial<Product> & { quantity?: number; reorderLevel?: number; supplierName?: string; supplierPhone?: string }): Promise<Product> {
    const result = await apiPost<Product>('/products', data)
    setProducts(prev => [...prev, result])
    return result
  }

  async function updateProduct(id: number, data: Partial<Product> & { quantity?: number; reorderLevel?: number; supplierName?: string; supplierPhone?: string }): Promise<Product> {
    const result = await apiPut<Product>(`/products/${id}`, data)
    setProducts(prev => prev.map(p => p.id === id ? result : p))
    return result
  }

  async function deleteProduct(id: number): Promise<void> {
    await apiDelete(`/products/${id}`)
    setProducts(prev => prev.filter(p => p.id !== id))
  }

  return { products, loading, error, refetch: fetchProducts, searchProducts, getByBarcode, createProduct, updateProduct, deleteProduct }
}
