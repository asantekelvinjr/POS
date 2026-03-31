import { Request, Response, NextFunction } from 'express'
import { z } from 'zod'
import { SalesService } from '../services/sales.service'
import { SaleModel } from '../models/sale.model'

const cartItemSchema = z.object({
  productId: z.number().int().positive(),
  quantity:  z.number().int().positive('Quantity must be at least 1'),
  price:     z.number().positive().optional(),
})

const createSaleSchema = z.object({
  items:          z.array(cartItemSchema).min(1, 'At least one item is required'),
  paymentMethod:  z.enum(['cash', 'momo', 'card']),
  customerId:     z.number().int().positive().optional(),
  amountTendered: z.number().positive().optional(),
  paystackRef:    z.string().optional(),
  discountAmount: z.number().min(0).optional(),
  notes:          z.string().optional(),
})

export const SalesController = {
  async list(req: Request, res: Response, next: NextFunction) {
    try {
      const { startDate, endDate, limit, offset } = req.query
      const sales = await SaleModel.findAll({
        startDate: startDate as string,
        endDate:   endDate   as string,
        limit:     limit  ? Number(limit)  : 50,
        offset:    offset ? Number(offset) : 0,
      })
      res.json({ success: true, data: sales })
    } catch (err) { next(err) }
  },

  async get(req: Request, res: Response, next: NextFunction) {
    try {
      const sale = await SalesService.getSaleWithItems(Number(req.params.id))
      res.json({ success: true, data: sale })
    } catch (err) { next(err) }
  },

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const body = createSaleSchema.parse(req.body)

      // Cash payment: must provide amountTendered >= total
      if (body.paymentMethod === 'cash' && !body.amountTendered) {
        res.status(400).json({ success: false, message: 'amountTendered is required for cash payments' })
        return
      }

      const result = await SalesService.createSale({
        ...body,
        userId: req.user!.userId,
      })

      res.status(201).json({ success: true, data: result })
    } catch (err) { next(err) }
  },

  async getDailySummary(req: Request, res: Response, next: NextFunction) {
    try {
      const { date } = req.query
      const summary = await SalesService.getDailySummary(date as string)
      res.json({ success: true, data: summary })
    } catch (err) { next(err) }
  },

  async getWeeklySummary(_req: Request, res: Response, next: NextFunction) {
    try {
      const summary = await SalesService.getWeeklySummary()
      res.json({ success: true, data: summary })
    } catch (err) { next(err) }
  },
}
