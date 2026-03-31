import { Router } from 'express'
import { ProductsController } from '../controllers/products.controller'
import { authenticate } from '../middleware/auth'
import { managerPlus, allRoles } from '../middleware/rbac'

const router = Router()

// All authenticated users can read products (cashier needs them for POS)
router.get('/',    authenticate, allRoles,    ProductsController.list)
router.get('/:id', authenticate, allRoles,    ProductsController.get)

// Only admin/manager can create, update, delete
router.post('/',    authenticate, managerPlus, ProductsController.create)
router.put('/:id',  authenticate, managerPlus, ProductsController.update)
router.delete('/:id', authenticate, managerPlus, ProductsController.delete)

export default router
