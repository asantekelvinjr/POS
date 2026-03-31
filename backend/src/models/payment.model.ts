import { query, queryOne } from '../config/db'
import { PoolClient } from 'pg'

export interface Payment {
  id: number
  sale_id: number
  paystack_ref: string | null
  amount_paid: number
  amount_tendered: number | null
  change_given: number | null
  method: 'cash' | 'momo' | 'card'
  status: 'success' | 'failed' | 'pending'
  verified_at: string | null
  created_at: string
}

export const PaymentModel = {
  async findBySaleId(saleId: number): Promise<Payment | null> {
    return queryOne<Payment>(`SELECT * FROM payments WHERE sale_id = $1`, [saleId])
  },

  async findByPaystackRef(ref: string): Promise<Payment | null> {
    return queryOne<Payment>(`SELECT * FROM payments WHERE paystack_ref = $1`, [ref])
  },

  async create(
    data: {
      saleId: number
      paystackRef?: string
      amountPaid: number
      amountTendered?: number
      changeGiven?: number
      method: string
      status?: string
    },
    client: PoolClient
  ): Promise<Payment> {
    const result = await client.query(
      `INSERT INTO payments
         (sale_id, paystack_ref, amount_paid, amount_tendered, change_given,
          method, status, verified_at)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
       RETURNING *`,
      [
        data.saleId,
        data.paystackRef || null,
        data.amountPaid,
        data.amountTendered || null,
        data.changeGiven || null,
        data.method,
        data.status || (data.paystackRef ? 'pending' : 'success'),
        data.paystackRef ? null : new Date().toISOString(),
      ]
    )
    return result.rows[0] as Payment
  },

  async markVerified(paystackRef: string): Promise<Payment | null> {
    return queryOne<Payment>(
      `UPDATE payments
       SET status = 'success', verified_at = NOW()
       WHERE paystack_ref = $1
       RETURNING *`,
      [paystackRef]
    )
  },

  async markFailed(paystackRef: string): Promise<void> {
    await query(
      `UPDATE payments SET status = 'failed' WHERE paystack_ref = $1`,
      [paystackRef]
    )
  },
}
