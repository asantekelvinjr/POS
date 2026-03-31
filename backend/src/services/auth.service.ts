import bcrypt from 'bcryptjs'
import { UserModel } from '../models/user.model'
import { generateToken } from '../middleware/auth'
import { AppError } from '../middleware/errorHandler'
import { env } from '../config/env'

export const AuthService = {
  async login(email: string, password: string) {
    const user = await UserModel.findByEmail(email.toLowerCase().trim())
    if (!user) throw new AppError('Invalid email or password', 401)

    const isValid = await bcrypt.compare(password, user.password_hash)
    if (!isValid) throw new AppError('Invalid email or password', 401)

    const token = generateToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    })

    const { password_hash: _, ...safeUser } = user
    return { user: safeUser, token }
  },

  async register(data: {
    name: string
    email: string
    password: string
    role?: string
  }) {
    const existing = await UserModel.findByEmail(data.email.toLowerCase())
    if (existing) throw new AppError('Email already registered', 409)

    const passwordHash = await bcrypt.hash(data.password, env.bcryptRounds)

    const user = await UserModel.create({
      name: data.name.trim(),
      email: data.email.toLowerCase().trim(),
      passwordHash,
      role: data.role || 'cashier',
    })

    const token = generateToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    })

    return { user, token }
  },

  async changePassword(userId: number, currentPassword: string, newPassword: string) {
    const userWithHash = await UserModel.findByEmail(
      (await UserModel.findById(userId))!.email
    )
    if (!userWithHash) throw new AppError('User not found', 404)

    const isValid = await bcrypt.compare(currentPassword, userWithHash.password_hash)
    if (!isValid) throw new AppError('Current password is incorrect', 401)

    const passwordHash = await bcrypt.hash(newPassword, env.bcryptRounds)
    await UserModel.update(userId, { passwordHash })
  },

  async resetPassword(userId: number, newPassword: string) {
    const passwordHash = await bcrypt.hash(newPassword, env.bcryptRounds)
    await UserModel.update(userId, { passwordHash })
  },
}
