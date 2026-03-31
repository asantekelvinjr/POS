import app from './app'
import pool from './config/db'
import { env, validateEnv } from './config/env'

// Validate required environment variables before starting
validateEnv()

async function start() {
  // Test DB connection before accepting requests
  try {
    const client = await pool.connect()
    await client.query('SELECT 1')
    client.release()
    console.log('✅ Database connection verified')
  } catch (err) {
    console.error('❌ Could not connect to PostgreSQL:', (err as Error).message)
    console.error('   Check your .env file and make sure PostgreSQL is running.')
    console.error('   Then run: npm run migrate && npm run seed')
    process.exit(1)
  }

  const server = app.listen(env.port, () => {
    console.log('')
    console.log('🚀 PayPoint POS Backend running')
    console.log(`   Environment : ${env.nodeEnv}`)
    console.log(`   Port        : ${env.port}`)
    console.log(`   API base    : http://localhost:${env.port}/api`)
    console.log(`   Health      : http://localhost:${env.port}/health`)
    console.log('')
  })

  // Graceful shutdown
  const shutdown = async (signal: string) => {
    console.log(`\n${signal} received — shutting down gracefully…`)
    server.close(async () => {
      await pool.end()
      console.log('✅ Database pool closed')
      process.exit(0)
    })
  }

  process.on('SIGTERM', () => shutdown('SIGTERM'))
  process.on('SIGINT',  () => shutdown('SIGINT'))

  // Unhandled promise rejections
  process.on('unhandledRejection', (reason) => {
    console.error('❌ Unhandled rejection:', reason)
  })
}

start()
