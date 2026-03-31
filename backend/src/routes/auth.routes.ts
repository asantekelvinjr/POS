import { Router } from 'express'
import { AuthController } from '../controllers/auth.controller'
import { authenticate } from '../middleware/auth'
import { authLimiter } from '../middleware/rateLimiter'

const router = Router()

// Public
router.post('/login',    authLimiter, AuthController.login)

// Protected
router.get('/me',              authenticate, AuthController.me)
router.post('/logout',         authenticate, AuthController.logout)
router.put('/change-password', authenticate, AuthController.changePassword)

export default router
