import { Router } from 'express'
import { PaymentsController } from '../controllers/payments.controller'
import { authenticate } from '../middleware/auth'
import { allRoles, managerPlus } from '../middleware/rbac'

const router = Router()

// Any staff can verify a payment (cashier processes it at POS)
router.post('/verify',     authenticate, allRoles,    PaymentsController.verify)

// Initializing server-side transactions — manager/admin only
router.post('/initialize', authenticate, managerPlus, PaymentsController.initialize)

export default router
