import { Request, Response, NextFunction } from 'express'
import { z } from 'zod'
import { CustomerModel } from '../models/customer.model'
import { AppError } from '../middleware/errorHandler'

const customerSchema = z.object({
  name:    z.string().min(2, 'Name must be at least 2 characters'),
  phone:   z.string().regex(/^0[2345][0-9]{8}$/, 'Invalid Ghana phone number (e.g. 0244123456)').optional(),
  email:   z.string().email().optional().or(z.literal('')),
  address: z.string().optional(),
})

export const CustomersController = {
  async list(req: Request, res: Response, next: NextFunction) {
    try {
      const { search } = req.query
      const customers = search
        ? await CustomerModel.search(String(search))
        : await CustomerModel.findAll()
      res.json({ success: true, data: customers })
    } catch (err) { next(err) }
  },

  async get(req: Request, res: Response, next: NextFunction) {
    try {
      const customer = await CustomerModel.findById(Number(req.params.id))
      if (!customer) throw new AppError('Customer not found', 404)
      res.json({ success: true, data: customer })
    } catch (err) { next(err) }
  },

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const data = customerSchema.parse(req.body)

      // Check duplicate phone
      if (data.phone) {
        const existing = await CustomerModel.findByPhone(data.phone)
        if (existing) throw new AppError('A customer with this phone number already exists', 409)
      }

      const customer = await CustomerModel.create({
        ...data,
        email: data.email || undefined,
      })
      res.status(201).json({ success: true, data: customer })
    } catch (err) { next(err) }
  },

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const data = customerSchema.partial().parse(req.body)
      const customer = await CustomerModel.update(Number(req.params.id), data)
      if (!customer) throw new AppError('Customer not found', 404)
      res.json({ success: true, data: customer })
    } catch (err) { next(err) }
  },

  async getPurchaseHistory(req: Request, res: Response, next: NextFunction) {
    try {
      const customer = await CustomerModel.findById(Number(req.params.id))
      if (!customer) throw new AppError('Customer not found', 404)
      const history = await CustomerModel.getPurchaseHistory(Number(req.params.id))
      res.json({ success: true, data: history })
    } catch (err) { next(err) }
  },
}
