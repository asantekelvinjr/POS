import { Request, Response, NextFunction } from 'express'
import { z } from 'zod'
import { ProductsService } from '../services/products.service'

const productSchema = z.object({
  name:         z.string().min(1, 'Name is required'),
  category:     z.string().min(1, 'Category is required'),
  price:        z.number().positive('Price must be positive'),
  costPrice:    z.number().positive().optional(),
  barcode:      z.string().optional(),
  description:  z.string().optional(),
  imageUrl:     z.string().url().optional(),
  quantity:     z.number().int().min(0).optional(),
  reorderLevel: z.number().int().min(0).optional(),
  supplierName: z.string().optional(),
  supplierPhone:z.string().optional(),
})

export const ProductsController = {
  async list(req: Request, res: Response, next: NextFunction) {
    try {
      const { search, barcode } = req.query
      let products
      if (barcode)       products = [await ProductsService.getByBarcode(String(barcode))]
      else if (search)   products = await ProductsService.search(String(search))
      else               products = await ProductsService.getAll()
      res.json({ success: true, data: products })
    } catch (err) { next(err) }
  },

  async get(req: Request, res: Response, next: NextFunction) {
    try {
      const product = await ProductsService.getById(Number(req.params.id))
      res.json({ success: true, data: product })
    } catch (err) { next(err) }
  },

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const data = productSchema.parse(req.body)
      const product = await ProductsService.create(data)
      res.status(201).json({ success: true, data: product })
    } catch (err) { next(err) }
  },

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const data = productSchema.partial().parse(req.body)
      const product = await ProductsService.update(Number(req.params.id), data)
      res.json({ success: true, data: product })
    } catch (err) { next(err) }
  },

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      await ProductsService.delete(Number(req.params.id))
      res.json({ success: true, message: 'Product deleted successfully' })
    } catch (err) { next(err) }
  },
}
