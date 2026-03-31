import { Router } from 'express'
import { CustomersController } from '../controllers/customers.controller'
import { authenticate } from '../middleware/auth'
import { managerPlus, allRoles } from '../middleware/rbac'

const router = Router()

// Cashiers can look up customers at the POS (for loyalty points)
router.get('/',    authenticate, allRoles,    CustomersController.list)
router.get('/:id', authenticate, allRoles,    CustomersController.get)
router.get('/:id/history', authenticate, allRoles, CustomersController.getPurchaseHistory)

// Only manager/admin can create or update customer records
router.post('/',    authenticate, managerPlus, CustomersController.create)
router.put('/:id',  authenticate, managerPlus, CustomersController.update)

export default router
