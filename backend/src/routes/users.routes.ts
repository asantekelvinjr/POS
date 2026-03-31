import { Router } from 'express'
import { UsersController } from '../controllers/users.controller'
import { authenticate } from '../middleware/auth'
import { adminOnly } from '../middleware/rbac'

const router = Router()

// Users management is admin-only
router.get('/',                          authenticate, adminOnly, UsersController.list)
router.get('/:id',                       authenticate, adminOnly, UsersController.get)
router.post('/',                         authenticate, adminOnly, UsersController.create)
router.put('/:id',                       authenticate, adminOnly, UsersController.update)
router.put('/:id/reset-password',        authenticate, adminOnly, UsersController.resetPassword)
router.delete('/:id',                    authenticate, adminOnly, UsersController.deactivate)

export default router
