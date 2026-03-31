import { Request, Response, NextFunction } from 'express'
import { z } from 'zod'
import { PaystackService } from '../services/paystack.service'

const verifySchema = z.object({
  reference:      z.string().min(1, 'Payment reference is required'),
  items:          z.array(z.object({
    productId:  z.number().int().positive(),
    quantity:   z.number().int().positive(),
  })).min(1),
  customerId:     z.number().int().positive().optional(),
  discountAmount: z.number().min(0).optional(),
})

const initSchema = z.object({
  email:    z.string().email(),
  amount:   z.number().positive(), // GHS amount (not pesewas)
  metadata: z.record(z.unknown()).optional(),
})

export const PaymentsController = {
  // Called after Paystack redirect/popup confirms payment
  async verify(req: Request, res: Response, next: NextFunction) {
    try {
      const body = verifySchema.parse(req.body)
      const result = await PaystackService.verifyAndRecordSale({
        ...body,
        userId: req.user!.userId,
      })
      res.json({ success: true, data: result })
    } catch (err) { next(err) }
  },

  // Optional: initialize a transaction server-side
  async initialize(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, amount, metadata } = initSchema.parse(req.body)
      const result = await PaystackService.initializeTransaction({
        email,
        amount: Math.round(amount * 100), // convert GHS → pesewas
        currency: 'GHS',
        metadata,
      })
      res.json({ success: true, data: result })
    } catch (err) { next(err) }
  },
}
