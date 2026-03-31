import { query } from '../config/db'
import { SaleModel } from '../models/sale.model'
import { InventoryModel } from '../models/inventory.model'

export const ReportsService = {
  async getDailySummary(date?: string) {
    return SaleModel.getDailySummary(date)
  },

  async getWeeklySummary() {
    return SaleModel.getWeeklySummary()
  },

  async getMonthlySummary(year?: number, month?: number) {
    const y = year  || new Date().getFullYear()
    const m = month || new Date().getMonth() + 1

    return query(
      `SELECT
         DATE(created_at) AS day,
         COUNT(*)::int AS transactions,
         COALESCE(SUM(total_amount), 0)::float AS revenue,
         COALESCE(SUM(CASE WHEN payment_method='cash' THEN total_amount END), 0)::float AS cash,
         COALESCE(SUM(CASE WHEN payment_method='momo' THEN total_amount END), 0)::float AS momo,
         COALESCE(SUM(CASE WHEN payment_method='card' THEN total_amount END), 0)::float AS card
       FROM sales
       WHERE EXTRACT(YEAR FROM created_at) = $1
         AND EXTRACT(MONTH FROM created_at) = $2
         AND status = 'completed'
       GROUP BY DATE(created_at)
       ORDER BY day ASC`,
      [y, m]
    )
  },

  async getTopProducts(limit = 10, days = 7) {
    return query(
      `SELECT
         p.id,
         p.name,
         p.category,
         SUM(si.quantity)::int AS qty_sold,
         SUM(si.line_total)::float AS revenue
       FROM sale_items si
       JOIN products p ON p.id = si.product_id
       JOIN sales s ON s.id = si.sale_id
       WHERE s.created_at >= NOW() - ($1 || ' days')::INTERVAL
         AND s.status = 'completed'
       GROUP BY p.id, p.name, p.category
       ORDER BY revenue DESC
       LIMIT $2`,
      [days, limit]
    )
  },

  async getCashierPerformance(days = 7) {
    return query(
      `SELECT
         u.id,
         u.name,
         COUNT(s.id)::int AS total_transactions,
         COALESCE(SUM(s.total_amount), 0)::float AS total_revenue,
         COALESCE(AVG(s.total_amount), 0)::float AS avg_order_value
       FROM users u
       LEFT JOIN sales s ON s.user_id = u.id
         AND s.created_at >= NOW() - ($1 || ' days')::INTERVAL
         AND s.status = 'completed'
       WHERE u.role IN ('cashier', 'admin', 'manager')
         AND u.is_active = true
       GROUP BY u.id, u.name
       ORDER BY total_revenue DESC`,
      [days]
    )
  },

  async getPaymentMethodBreakdown(days = 7) {
    return query(
      `SELECT
         payment_method,
         COUNT(*)::int AS transactions,
         COALESCE(SUM(total_amount), 0)::float AS total,
         ROUND((COUNT(*) * 100.0 / NULLIF(SUM(COUNT(*)) OVER (), 0)), 2)::float AS percentage
       FROM sales
       WHERE created_at >= NOW() - ($1 || ' days')::INTERVAL
         AND status = 'completed'
       GROUP BY payment_method
       ORDER BY total DESC`,
      [days]
    )
  },

  async getInventoryReport() {
    const all     = await InventoryModel.findAll()
    const low     = await InventoryModel.getLowStock()
    const out     = await InventoryModel.getOutOfStock()

    return {
      totalProducts: all.length,
      inStock: all.filter(i => i.quantity_in_stock > i.reorder_level).length,
      lowStock: low.length,
      outOfStock: out.length,
      items: all,
      lowStockItems: low,
      outOfStockItems: out,
    }
  },

  async getSalesSummary(startDate: string, endDate: string) {
    return query(
      `SELECT
         COUNT(*)::int AS total_transactions,
         COALESCE(SUM(total_amount), 0)::float AS gross_revenue,
         COALESCE(SUM(tax_amount), 0)::float AS total_vat,
         COALESCE(SUM(discount_amount), 0)::float AS total_discounts,
         COALESCE(SUM(CASE WHEN status='refunded' THEN total_amount ELSE 0 END), 0)::float AS refunds,
         COALESCE(SUM(CASE WHEN status='completed' THEN total_amount ELSE 0 END), 0)::float AS net_revenue
       FROM sales
       WHERE created_at BETWEEN $1 AND $2`,
      [startDate, endDate]
    )
  },
}
