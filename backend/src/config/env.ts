import dotenv from 'dotenv'
dotenv.config()

const required = [
  'JWT_SECRET',
  'DB_HOST',
  'DB_NAME',
  'DB_USER',
  'DB_PASSWORD',
]

export function validateEnv() {
  // Skip strict validation in development if DATABASE_URL is set
  if (process.env.DATABASE_URL) return

  const missing = required.filter(key => !process.env[key])
  if (missing.length > 0) {
    console.error(`❌ Missing required environment variables: ${missing.join(', ')}`)
    console.error('   Copy .env.example to .env and fill in the values.')
    process.exit(1)
  }
}

export const env = {
  port:          parseInt(process.env.PORT || '4000'),
  nodeEnv:       process.env.NODE_ENV || 'development',
  isDev:         process.env.NODE_ENV !== 'production',
  jwtSecret:     process.env.JWT_SECRET || 'dev_secret_change_me',
  jwtExpiresIn:  process.env.JWT_EXPIRES_IN || '7d',
  corsOrigin:    process.env.CORS_ORIGIN || 'http://localhost:3000',
  bcryptRounds:  parseInt(process.env.BCRYPT_ROUNDS || '10'),
  vatRate:       parseFloat(process.env.VAT_RATE || '0.15'),
  paystack: {
    secretKey:   process.env.PAYSTACK_SECRET_KEY || '',
    publicKey:   process.env.PAYSTACK_PUBLIC_KEY || '',
  },
}
