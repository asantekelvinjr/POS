import { Router } from 'express'
import { InventoryController } from '../controllers/inventory.controller'
import { authenticate } from '../middleware/auth'
import { managerPlus } from '../middleware/rbac'

const router = Router()

router.get('/',                          authenticate, managerPlus, InventoryController.list)
router.get('/low-stock',                 authenticate, managerPlus, InventoryController.getLowStock)
router.get('/out-of-stock',              authenticate, managerPlus, InventoryController.getOutOfStock)
router.get('/product/:productId',        authenticate, managerPlus, InventoryController.getByProduct)
router.put('/product/:productId/adjust', authenticate, managerPlus, InventoryController.adjust)
router.put('/product/:productId',        authenticate, managerPlus, InventoryController.update)

export default router
