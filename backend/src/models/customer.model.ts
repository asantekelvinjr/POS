import { query, queryOne } from '../config/db'

export interface Customer {
  id: number
  name: string
  phone: string | null
  email: string | null
  address: string | null
  loyalty_points: number
  total_spent: number
  created_at: string
}

export const CustomerModel = {
  async findAll(): Promise<Customer[]> {
    return query<Customer>(
      `SELECT * FROM customers ORDER BY name ASC`
    )
  },

  async findById(id: number): Promise<Customer | null> {
    return queryOne<Customer>(`SELECT * FROM customers WHERE id = $1`, [id])
  },

  async findByPhone(phone: string): Promise<Customer | null> {
    return queryOne<Customer>(`SELECT * FROM customers WHERE phone = $1`, [phone])
  },

  async search(term: string): Promise<Customer[]> {
    return query<Customer>(
      `SELECT * FROM customers
       WHERE name ILIKE $1 OR phone ILIKE $1 OR email ILIKE $1
       ORDER BY name ASC LIMIT 20`,
      [`%${term}%`]
    )
  },

  async create(data: {
    name: string
    phone?: string
    email?: string
    address?: string
  }): Promise<Customer> {
    const result = await queryOne<Customer>(
      `INSERT INTO customers (name, phone, email, address)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [data.name, data.phone || null, data.email || null, data.address || null]
    )
    return result!
  },

  async update(id: number, data: Partial<{
    name: string
    phone: string
    email: string
    address: string
  }>): Promise<Customer | null> {
    const fields: string[] = []
    const values: unknown[] = []
    let i = 1

    if (data.name !== undefined)    { fields.push(`name = $${i++}`);    values.push(data.name) }
    if (data.phone !== undefined)   { fields.push(`phone = $${i++}`);   values.push(data.phone) }
    if (data.email !== undefined)   { fields.push(`email = $${i++}`);   values.push(data.email) }
    if (data.address !== undefined) { fields.push(`address = $${i++}`); values.push(data.address) }

    if (fields.length === 0) return this.findById(id)

    values.push(id)
    return queryOne<Customer>(
      `UPDATE customers SET ${fields.join(', ')} WHERE id = $${i} RETURNING *`,
      values
    )
  },

  async addLoyaltyPoints(customerId: number, points: number): Promise<void> {
    await query(
      `UPDATE customers
       SET loyalty_points = loyalty_points + $1,
           total_spent = total_spent + $2
       WHERE id = $3`,
      [points, points * 10, customerId] // 1 point per GHS 10 spent
    )
  },

  async getPurchaseHistory(customerId: number): Promise<unknown[]> {
    return query(
      `SELECT s.id, s.transaction_code, s.created_at, s.total_amount,
              s.payment_method, s.status,
              COUNT(si.id)::int as item_count
       FROM sales s
       LEFT JOIN sale_items si ON si.sale_id = s.id
       WHERE s.customer_id = $1
       GROUP BY s.id
       ORDER BY s.created_at DESC`,
      [customerId]
    )
  },
}
