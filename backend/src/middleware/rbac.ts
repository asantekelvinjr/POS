import { Request, Response, NextFunction } from 'express'

type Role = 'admin' | 'manager' | 'cashier'

/**
 * Middleware factory — restricts route to specific roles.
 * Must be used AFTER the `authenticate` middleware.
 *
 * Usage:
 *   router.get('/users', authenticate, requireRole('admin'), usersController.list)
 *   router.get('/products', authenticate, requireRole('admin', 'manager'), productsController.list)
 */
export function requireRole(...roles: Role[]) {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Unauthorized' })
      return
    }

    if (!roles.includes(req.user.role as Role)) {
      res.status(403).json({
        success: false,
        message: `Access denied. Required role: ${roles.join(' or ')}`,
      })
      return
    }

    next()
  }
}

// Convenience shortcuts
export const adminOnly    = requireRole('admin')
export const managerPlus  = requireRole('admin', 'manager')
export const allRoles     = requireRole('admin', 'manager', 'cashier')
