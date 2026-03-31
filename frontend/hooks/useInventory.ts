'use client'
import { useState, useEffect } from 'react'
import { apiGet, apiPut } from '@/lib/api'

export interface InventoryItem {
  id: number
  product_id: number
  product_name: string
  category: string
  quantity_in_stock: number
  reorder_level: number
  supplier_name: string | null
  supplier_phone: string | null
  last_restocked_at: string | null
  updated_at: string
}

export function useInventory() {
  const [inventory, setInventory]   = useState<InventoryItem[]>([])
  const [loading, setLoading]       = useState(true)
  const [error, setError]           = useState<string | null>(null)

  useEffect(() => {
    async function fetch() {
      try {
        const data = await apiGet<InventoryItem[]>('/inventory')
        setInventory(data)
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Failed to load inventory')
      } finally {
        setLoading(false)
      }
    }
    fetch()
  }, [])

  async function adjustStock(productId: number, quantity: number, note?: string) {
    const updated = await apiPut<InventoryItem>(`/inventory/product/${productId}/adjust`, { quantity, note })
    setInventory(prev => prev.map(i => i.product_id === productId ? updated : i))
    return updated
  }

  const lowStockItems  = inventory.filter(i => i.quantity_in_stock <= i.reorder_level && i.quantity_in_stock > 0)
  const outOfStockItems = inventory.filter(i => i.quantity_in_stock === 0)

  return { inventory, loading, error, lowStockItems, outOfStockItems, adjustStock }
}
