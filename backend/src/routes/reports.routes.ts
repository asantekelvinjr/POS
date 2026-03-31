import { Router } from 'express'
import { ReportsController } from '../controllers/reports.controller'
import { authenticate } from '../middleware/auth'
import { managerPlus } from '../middleware/rbac'

const router = Router()

// All reports are manager/admin only
router.get('/daily',               authenticate, managerPlus, ReportsController.daily)
router.get('/weekly',              authenticate, managerPlus, ReportsController.weekly)
router.get('/monthly',             authenticate, managerPlus, ReportsController.monthly)
router.get('/top-products',        authenticate, managerPlus, ReportsController.topProducts)
router.get('/cashier-performance', authenticate, managerPlus, ReportsController.cashierPerformance)
router.get('/payment-breakdown',   authenticate, managerPlus, ReportsController.paymentBreakdown)
router.get('/inventory',           authenticate, managerPlus, ReportsController.inventory)
router.get('/summary',             authenticate, managerPlus, ReportsController.summary)

export default router
