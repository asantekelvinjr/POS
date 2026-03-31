import { query, queryOne } from '../config/db'

export interface Product {
  id: number
  name: string
  category: string
  price: number
  cost_price: number | null
  barcode: string | null
  description: string | null
  image_url: string | null
  is_active: boolean
  created_at: string
}

export const ProductModel = {
  async findAll(includeInactive = false): Promise<Product[]> {
    return query<Product>(
      `SELECT p.*, i.quantity_in_stock as quantity
       FROM products p
       LEFT JOIN inventory i ON i.product_id = p.id
       ${includeInactive ? '' : 'WHERE p.is_active = true'}
       ORDER BY p.name ASC`
    )
  },

  async findById(id: number): Promise<Product | null> {
    return queryOne<Product>(
      `SELECT p.*, i.quantity_in_stock as quantity
       FROM products p
       LEFT JOIN inventory i ON i.product_id = p.id
       WHERE p.id = $1 AND p.is_active = true`,
      [id]
    )
  },

  async findByBarcode(barcode: string): Promise<Product | null> {
    return queryOne<Product>(
      `SELECT p.*, i.quantity_in_stock as quantity
       FROM products p
       LEFT JOIN inventory i ON i.product_id = p.id
       WHERE p.barcode = $1 AND p.is_active = true`,
      [barcode]
    )
  },

  async search(term: string): Promise<Product[]> {
    return query<Product>(
      `SELECT p.*, i.quantity_in_stock as quantity
       FROM products p
       LEFT JOIN inventory i ON i.product_id = p.id
       WHERE p.is_active = true
         AND (p.name ILIKE $1 OR p.barcode ILIKE $1 OR p.category ILIKE $1)
       ORDER BY p.name ASC
       LIMIT 50`,
      [`%${term}%`]
    )
  },

  async create(data: {
    name: string
    category: string
    price: number
    costPrice?: number
    barcode?: string
    description?: string
    imageUrl?: string
  }): Promise<Product> {
    const result = await queryOne<Product>(
      `INSERT INTO products (name, category, price, cost_price, barcode, description, image_url)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [data.name, data.category, data.price, data.costPrice || null,
       data.barcode || null, data.description || null, data.imageUrl || null]
    )
    return result!
  },

  async update(id: number, data: Partial<{
    name: string
    category: string
    price: number
    costPrice: number
    barcode: string
    description: string
    imageUrl: string
    isActive: boolean
  }>): Promise<Product | null> {
    const fields: string[] = []
    const values: unknown[] = []
    let i = 1

    if (data.name !== undefined)       { fields.push(`name = $${i++}`);        values.push(data.name) }
    if (data.category !== undefined)   { fields.push(`category = $${i++}`);    values.push(data.category) }
    if (data.price !== undefined)      { fields.push(`price = $${i++}`);       values.push(data.price) }
    if (data.costPrice !== undefined)  { fields.push(`cost_price = $${i++}`);  values.push(data.costPrice) }
    if (data.barcode !== undefined)    { fields.push(`barcode = $${i++}`);     values.push(data.barcode) }
    if (data.description !== undefined){ fields.push(`description = $${i++}`); values.push(data.description) }
    if (data.imageUrl !== undefined)   { fields.push(`image_url = $${i++}`);   values.push(data.imageUrl) }
    if (data.isActive !== undefined)   { fields.push(`is_active = $${i++}`);   values.push(data.isActive) }

    if (fields.length === 0) return this.findById(id)

    values.push(id)
    return queryOne<Product>(
      `UPDATE products SET ${fields.join(', ')} WHERE id = $${i} RETURNING *`,
      values
    )
  },

  async softDelete(id: number): Promise<void> {
    await query(`UPDATE products SET is_active = false WHERE id = $1`, [id])
  },
}
