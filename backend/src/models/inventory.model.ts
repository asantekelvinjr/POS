import { query, queryOne } from '../config/db'
import { PoolClient } from 'pg'

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

export const InventoryModel = {
  async findAll(): Promise<InventoryItem[]> {
    return query<InventoryItem>(
      `SELECT i.*, p.name as product_name, p.category
       FROM inventory i
       JOIN products p ON p.id = i.product_id
       WHERE p.is_active = true
       ORDER BY p.name ASC`
    )
  },

  async findByProductId(productId: number): Promise<InventoryItem | null> {
    return queryOne<InventoryItem>(
      `SELECT i.*, p.name as product_name, p.category
       FROM inventory i
       JOIN products p ON p.id = i.product_id
       WHERE i.product_id = $1`,
      [productId]
    )
  },

  async getLowStock(): Promise<InventoryItem[]> {
    return query<InventoryItem>(
      `SELECT i.*, p.name as product_name, p.category
       FROM inventory i
       JOIN products p ON p.id = i.product_id
       WHERE p.is_active = true
         AND i.quantity_in_stock <= i.reorder_level
         AND i.quantity_in_stock > 0
       ORDER BY i.quantity_in_stock ASC`
    )
  },

  async getOutOfStock(): Promise<InventoryItem[]> {
    return query<InventoryItem>(
      `SELECT i.*, p.name as product_name, p.category
       FROM inventory i
       JOIN products p ON p.id = i.product_id
       WHERE p.is_active = true
         AND i.quantity_in_stock = 0
       ORDER BY p.name ASC`
    )
  },

  async create(data: {
    productId: number
    quantity: number
    reorderLevel?: number
    supplierName?: string
    supplierPhone?: string
  }): Promise<InventoryItem> {
    const result = await queryOne<InventoryItem>(
      `INSERT INTO inventory (product_id, quantity_in_stock, reorder_level, supplier_name, supplier_phone)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [data.productId, data.quantity, data.reorderLevel || 10,
       data.supplierName || null, data.supplierPhone || null]
    )
    return result!
  },

  // Deduct stock after a sale — used inside a transaction
  async deductStock(
    productId: number,
    quantity: number,
    client: PoolClient
  ): Promise<void> {
    const result = await client.query(
      `UPDATE inventory
       SET quantity_in_stock = quantity_in_stock - $1,
           updated_at = NOW()
       WHERE product_id = $2
         AND quantity_in_stock >= $1
       RETURNING quantity_in_stock`,
      [quantity, productId]
    )
    if (result.rowCount === 0) {
      throw new Error(`Insufficient stock for product ID ${productId}`)
    }
  },

  async adjustStock(
    productId: number,
    newQuantity: number,
    _note?: string
  ): Promise<InventoryItem | null> {
    return queryOne<InventoryItem>(
      `UPDATE inventory
       SET quantity_in_stock = $1,
           last_restocked_at = CASE WHEN $1 > quantity_in_stock THEN NOW() ELSE last_restocked_at END,
           updated_at = NOW()
       WHERE product_id = $2
       RETURNING *`,
      [newQuantity, productId]
    )
  },

  async update(productId: number, data: Partial<{
    reorderLevel: number
    supplierName: string
    supplierPhone: string
  }>): Promise<InventoryItem | null> {
    const fields: string[] = []
    const values: unknown[] = []
    let i = 1

    if (data.reorderLevel !== undefined)  { fields.push(`reorder_level = $${i++}`);  values.push(data.reorderLevel) }
    if (data.supplierName !== undefined)  { fields.push(`supplier_name = $${i++}`);  values.push(data.supplierName) }
    if (data.supplierPhone !== undefined) { fields.push(`supplier_phone = $${i++}`); values.push(data.supplierPhone) }

    if (fields.length === 0) return this.findByProductId(productId)

    fields.push(`updated_at = NOW()`)
    values.push(productId)

    return queryOne<InventoryItem>(
      `UPDATE inventory SET ${fields.join(', ')} WHERE product_id = $${i} RETURNING *`,
      values
    )
  },
}
