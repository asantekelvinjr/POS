import { Router } from 'express'
import { SalesController } from '../controllers/sales.controller'
import { authenticate } from '../middleware/auth'
import { managerPlus, allRoles } from '../middleware/rbac'

const router = Router()

// Any staff can create a sale (cashier at the POS)
router.post('/',           authenticate, allRoles,    SalesController.create)

// Reports restricted to manager/admin
router.get('/',            authenticate, managerPlus, SalesController.list)
router.get('/summary/daily',   authenticate, managerPlus, SalesController.getDailySummary)
router.get('/summary/weekly',  authenticate, managerPlus, SalesController.getWeeklySummary)
router.get('/:id',         authenticate, managerPlus, SalesController.get)

export default router
