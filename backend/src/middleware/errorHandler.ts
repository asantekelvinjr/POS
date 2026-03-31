import { Request, Response, NextFunction } from 'express'
import { ZodError } from 'zod'
import { env } from '../config/env'

export class AppError extends Error {
  constructor(
    public message: string,
    public statusCode: number = 500,
    public code?: string
  ) {
    super(message)
    this.name = 'AppError'
  }
}

export function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  // Zod validation error
  if (err instanceof ZodError) {
    res.status(400).json({
      success: false,
      message: 'Validation error',
      errors: err.errors.map(e => ({
        field: e.path.join('.'),
        message: e.message,
      })),
    })
    return
  }

  // Known app error
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      success: false,
      message: err.message,
      code: err.code,
    })
    return
  }

  // PostgreSQL unique violation
  if ((err as NodeJS.ErrnoException).code === '23505') {
    res.status(409).json({
      success: false,
      message: 'A record with this value already exists',
      code: 'DUPLICATE_ENTRY',
    })
    return
  }

  // PostgreSQL foreign key violation
  if ((err as NodeJS.ErrnoException).code === '23503') {
    res.status(400).json({
      success: false,
      message: 'Referenced record does not exist',
      code: 'FOREIGN_KEY_VIOLATION',
    })
    return
  }

  // Unknown error — don't leak details in production
  console.error('❌ Unhandled error:', err)
  res.status(500).json({
    success: false,
    message: env.isDev ? err.message : 'Internal server error',
    ...(env.isDev && { stack: err.stack }),
  })
}

// 404 handler — mount AFTER all routes
export function notFound(req: Request, res: Response): void {
  res.status(404).json({
    success: false,
    message: `Route ${req.method} ${req.path} not found`,
  })
}
