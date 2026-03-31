import { Request, Response, NextFunction } from 'express'
import { z } from 'zod'
import { AuthService } from '../services/auth.service'
import { UserModel } from '../models/user.model'

const loginSchema = z.object({
  email:    z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

const registerSchema = z.object({
  name:     z.string().min(2, 'Name must be at least 2 characters'),
  email:    z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  role:     z.enum(['admin', 'manager', 'cashier']).optional(),
})

const changePasswordSchema = z.object({
  currentPassword: z.string().min(1),
  newPassword:     z.string().min(6, 'New password must be at least 6 characters'),
})

export const AuthController = {
  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = loginSchema.parse(req.body)
      const result = await AuthService.login(email, password)
      res.json({ success: true, data: result })
    } catch (err) { next(err) }
  },

  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const data = registerSchema.parse(req.body)
      const result = await AuthService.register(data)
      res.status(201).json({ success: true, data: result })
    } catch (err) { next(err) }
  },

  async me(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await UserModel.findById(req.user!.userId)
      res.json({ success: true, data: user })
    } catch (err) { next(err) }
  },

  async changePassword(req: Request, res: Response, next: NextFunction) {
    try {
      const { currentPassword, newPassword } = changePasswordSchema.parse(req.body)
      await AuthService.changePassword(req.user!.userId, currentPassword, newPassword)
      res.json({ success: true, message: 'Password updated successfully' })
    } catch (err) { next(err) }
  },

  logout(_req: Request, res: Response) {
    // JWT is stateless — client deletes the token
    res.json({ success: true, message: 'Logged out successfully' })
  },
}
