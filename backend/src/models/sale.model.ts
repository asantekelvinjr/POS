import { query, queryOne } from '../config/db'
import { PoolClient } from 'pg'

export interface Sale {
  id: number
  transaction_code: string
  user_id: number
  customer_id: number | null
  subtotal: number
  discount_amount: number
  tax_amount: number
  total_amount: number
  payment_method: 'cash' | 'momo' | 'card'
  status: 'completed' | 'refunded' | 'pending'
  notes: string | null
  created_at: string
  // Joined fields
  cashier_name?: string
  customer_name?: string
}

export interface SaleItem {
  id: number
  sale_id: number
  product_id: number
  product_name: string
  quantity: number
  unit_price: number
  discount: number
  line_total: number
}

export const SaleModel = {
  async findAll(filters?: {
    startDate?: string
    endDate?: string
    userId?: number
    limit?: number
    offset?: number
  }): Promise<Sale[]> {
    const conditions: string[] = []
    const values: unknown[] = []
    let i = 1

    if (filters?.startDate) { conditions.push(`s.created_at >= $${i++}`); values.push(filters.startDate) }
    if (filters?.endDate)   { conditions.push(`s.created_at <= $${i++}`); values.push(filters.endDate) }
    if (filters?.userId)    { conditions.push(`s.user_id = $${i++}`);     values.push(filters.userId) }

    const where = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : ''
    const limit = filters?.limit ? `LIMIT $${i++}` : 'LIMIT 100'
    if (filters?.limit) values.push(filters.limit)
    const offset = filters?.offset ? `OFFSET $${i++}` : ''
    if (filters?.offset) values.push(filters.offset)

    return query<Sale>(
      `SELECT s.*,
              u.name as cashier_name,
              c.name as customer_name
       FROM sales s
       JOIN users u ON u.id = s.user_id
       LEFT JOIN customers c ON c.id = s.customer_id
       ${where}
       ORDER BY s.created_at DESC
       ${limit} ${offset}`,
      values
    )
  },

  async findById(id: number): Promise<Sale | null> {
    return queryOne<Sale>(
      `SELECT s.*,
              u.name as cashier_name,
              c.name as customer_name
       FROM sales s
       JOIN users u ON u.id = s.user_id
       LEFT JOIN customers c ON c.id = s.customer_id
       WHERE s.id = $1`,
      [id]
    )
  },

  async create(
    data: {
      transactionCode: string
      userId: number
      customerId?: number
      subtotal: number
      discountAmount: number
      taxAmount: number
      totalAmount: number
      paymentMethod: string
      notes?: string
    },
    client: PoolClient
  ): Promise<Sale> {
    const result = await client.query(
      `INSERT INTO sales
         (transaction_code, user_id, customer_id, subtotal, discount_amount,
          tax_amount, total_amount, payment_method, status, notes)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,'completed',$9)
       RETURNING *`,
      [
        data.transactionCode, data.userId, data.customerId || null,
        data.subtotal, data.discountAmount, data.taxAmount, data.totalAmount,
        data.paymentMethod, data.notes || null,
      ]
    )
    return result.rows[0] as Sale
  },

  async getItems(saleId: number): Promise<SaleItem[]> {
    return query<SaleItem>(
      `SELECT * FROM sale_items WHERE sale_id = $1 ORDER BY id ASC`,
      [saleId]
    )
  },

  async createItems(
    items: Omit<SaleItem, 'id'>[],
    client: PoolClient
  ): Promise<void> {
    for (const item of items) {
      await client.query(
        `INSERT INTO sale_items
           (sale_id, product_id, product_name, quantity, unit_price, discount, line_total)
         VALUES ($1,$2,$3,$4,$5,$6,$7)`,
        [item.sale_id, item.product_id, item.product_name,
         item.quantity, item.unit_price, item.discount, item.line_total]
      )
    }
  },

  async getDailySummary(date?: string): Promise<{
    total_revenue: number
    total_transactions: number
    total_items_sold: number
    cash_total: number
    momo_total: number
    card_total: number
  } | null> {
    const targetDate = date || 'CURRENT_DATE'
    return queryOne(
      `SELECT
         COALESCE(SUM(total_amount), 0)::float           AS total_revenue,
         COUNT(*)::int                                    AS total_transactions,
         COALESCE(SUM(si.items_count), 0)::int           AS total_items_sold,
         COALESCE(SUM(CASE WHEN payment_method='cash' THEN total_amount END), 0)::float  AS cash_total,
         COALESCE(SUM(CASE WHEN payment_method='momo' THEN total_amount END), 0)::float  AS momo_total,
         COALESCE(SUM(CASE WHEN payment_method='card' THEN total_amount END), 0)::float  AS card_total
       FROM sales s
       LEFT JOIN (
         SELECT sale_id, SUM(quantity) as items_count FROM sale_items GROUP BY sale_id
       ) si ON si.sale_id = s.id
       WHERE DATE(s.created_at) = ${targetDate}
         AND s.status = 'completed'`
    )
  },

  async getWeeklySummary(): Promise<unknown[]> {
    return query(
      `SELECT
         DATE(created_at) AS day,
         COUNT(*)::int AS transactions,
         COALESCE(SUM(total_amount), 0)::float AS revenue
       FROM sales
       WHERE created_at >= NOW() - INTERVAL '7 days'
         AND status = 'completed'
       GROUP BY DATE(created_at)
       ORDER BY day ASC`
    )
  },
}
