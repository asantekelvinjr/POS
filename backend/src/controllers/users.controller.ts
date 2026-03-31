import { Request, Response, NextFunction } from 'express'
import { z } from 'zod'
import { UserModel } from '../models/user.model'
import { AuthService } from '../services/auth.service'
import { AppError } from '../middleware/errorHandler'

const createUserSchema = z.object({
  name:     z.string().min(2),
  email:    z.string().email(),
  password: z.string().min(6),
  role:     z.enum(['admin', 'manager', 'cashier']),
})

const updateUserSchema = z.object({
  name:     z.string().min(2).optional(),
  email:    z.string().email().optional(),
  role:     z.enum(['admin', 'manager', 'cashier']).optional(),
  isActive: z.boolean().optional(),
})

const resetPasswordSchema = z.object({
  newPassword: z.string().min(6, 'Password must be at least 6 characters'),
})

export const UsersController = {
  async list(_req: Request, res: Response, next: NextFunction) {
    try {
      const users = await UserModel.findAll()
      res.json({ success: true, data: users })
    } catch (err) { next(err) }
  },

  async get(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await UserModel.findById(Number(req.params.id))
      if (!user) throw new AppError('User not found', 404)
      res.json({ success: true, data: user })
    } catch (err) { next(err) }
  },

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const data = createUserSchema.parse(req.body)
      const result = await AuthService.register(data)
      res.status(201).json({ success: true, data: result.user })
    } catch (err) { next(err) }
  },

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const data = updateUserSchema.parse(req.body)

      // Prevent admin from deactivating themselves
      if (data.isActive === false && Number(req.params.id) === req.user!.userId) {
        throw new AppError('You cannot deactivate your own account', 400)
      }

      const user = await UserModel.update(Number(req.params.id), data)
      if (!user) throw new AppError('User not found', 404)
      res.json({ success: true, data: user })
    } catch (err) { next(err) }
  },

  async resetPassword(req: Request, res: Response, next: NextFunction) {
    try {
      const { newPassword } = resetPasswordSchema.parse(req.body)
      await AuthService.resetPassword(Number(req.params.id), newPassword)
      res.json({ success: true, message: 'Password reset successfully' })
    } catch (err) { next(err) }
  },

  async deactivate(req: Request, res: Response, next: NextFunction) {
    try {
      if (Number(req.params.id) === req.user!.userId) {
        throw new AppError('You cannot deactivate your own account', 400)
      }
      await UserModel.deactivate(Number(req.params.id))
      res.json({ success: true, message: 'User deactivated successfully' })
    } catch (err) { next(err) }
  },
}
