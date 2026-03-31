import { Request, Response, NextFunction } from 'express'
import { z } from 'zod'
import { InventoryService } from '../services/inventory.service'

const adjustSchema = z.object({
  quantity: z.number().int().min(0, 'Quantity cannot be negative'),
  note:     z.string().optional(),
})

const updateSchema = z.object({
  reorderLevel:  z.number().int().min(0).optional(),
  supplierName:  z.string().optional(),
  supplierPhone: z.string().optional(),
})

export const InventoryController = {
  async list(_req: Request, res: Response, next: NextFunction) {
    try {
      const inventory = await InventoryService.getAll()
      res.json({ success: true, data: inventory })
    } catch (err) { next(err) }
  },

  async getLowStock(_req: Request, res: Response, next: NextFunction) {
    try {
      const items = await InventoryService.getLowStock()
      res.json({ success: true, data: items })
    } catch (err) { next(err) }
  },

  async getOutOfStock(_req: Request, res: Response, next: NextFunction) {
    try {
      const items = await InventoryService.getOutOfStock()
      res.json({ success: true, data: items })
    } catch (err) { next(err) }
  },

  async getByProduct(req: Request, res: Response, next: NextFunction) {
    try {
      const item = await InventoryService.getByProductId(Number(req.params.productId))
      res.json({ success: true, data: item })
    } catch (err) { next(err) }
  },

  async adjust(req: Request, res: Response, next: NextFunction) {
    try {
      const { quantity, note } = adjustSchema.parse(req.body)
      const item = await InventoryService.adjustStock(Number(req.params.productId), quantity, note)
      res.json({ success: true, data: item })
    } catch (err) { next(err) }
  },

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const data = updateSchema.parse(req.body)
      const item = await InventoryService.update(Number(req.params.productId), data)
      res.json({ success: true, data: item })
    } catch (err) { next(err) }
  },
}
