'use client'

import { useState, useEffect } from 'react'
import { apiGet, apiPut } from '@/lib/api'

export interface InventoryItem {
  id: number
  productId: number
  productName: string
  category: string
  quantityInStock: number
  reorderLevel: number
  supplierName?: string
  supplierPhone?: string
  lastRestockedAt?: string
}

export function useInventory() {
  const [inventory, setInventory] = useState<InventoryItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

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
    const updated = await apiPut<InventoryItem>(`/inventory/${productId}/adjust`, {
      quantity,
      note,
    })
    setInventory(prev =>
      prev.map(i => i.productId === productId ? updated : i)
    )
  }

  const lowStockItems = inventory.filter(
    i => i.quantityInStock <= i.reorderLevel && i.quantityInStock > 0
  )

  const outOfStockItems = inventory.filter(i => i.quantityInStock === 0)

  return {
    inventory,
    loading,
    error,
    lowStockItems,
    outOfStockItems,
    adjustStock,
  }
}
