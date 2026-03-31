import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'

import { env } from './config/env'
import { apiLimiter } from './middleware/rateLimiter'
import { errorHandler, notFound } from './middleware/errorHandler'

// Routes
import authRoutes      from './routes/auth.routes'
import productsRoutes  from './routes/products.routes'
import inventoryRoutes from './routes/inventory.routes'
import salesRoutes     from './routes/sales.routes'
import customersRoutes from './routes/customers.routes'
import paymentsRoutes  from './routes/payments.routes'
import reportsRoutes   from './routes/reports.routes'
import usersRoutes     from './routes/users.routes'

const app = express()

// ── Security ──────────────────────────────────────────────────────────────
app.use(helmet())

// ── CORS ──────────────────────────────────────────────────────────────────
app.use(cors({
  origin: env.corsOrigin,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}))

// ── Body parsing ──────────────────────────────────────────────────────────
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true }))

// ── Logging ───────────────────────────────────────────────────────────────
if (env.isDev) {
  app.use(morgan('dev'))
} else {
  app.use(morgan('combined'))
}

// ── Rate limiting ─────────────────────────────────────────────────────────
app.use('/api', apiLimiter)

// ── Health check ──────────────────────────────────────────────────────────
app.get('/health', (_req, res) => {
  res.json({
    status: 'ok',
    env: env.nodeEnv,
    timestamp: new Date().toISOString(),
  })
})

// ── API Routes ────────────────────────────────────────────────────────────
const api = '/api'
app.use(`${api}/auth`,      authRoutes)
app.use(`${api}/products`,  productsRoutes)
app.use(`${api}/inventory`, inventoryRoutes)
app.use(`${api}/sales`,     salesRoutes)
app.use(`${api}/customers`, customersRoutes)
app.use(`${api}/payments`,  paymentsRoutes)
app.use(`${api}/reports`,   reportsRoutes)
app.use(`${api}/users`,     usersRoutes)

// ── 404 & Error handlers ──────────────────────────────────────────────────
app.use(notFound)
app.use(errorHandler)

export default app
