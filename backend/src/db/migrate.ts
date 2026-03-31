import fs from 'fs'
import path from 'path'
// import pool from './config/db'
// import { validateEnv } from './config/env'
import pool from '@/config/db'
import { validateEnv } from '@/config/env'

validateEnv()

async function migrate() {
  const client = await pool.connect()

  try {
    // Create a migrations tracking table if it doesn't exist
    await client.query(`
      CREATE TABLE IF NOT EXISTS _migrations (
        id         SERIAL PRIMARY KEY,
        filename   VARCHAR(255) NOT NULL UNIQUE,
        applied_at TIMESTAMPTZ  NOT NULL DEFAULT NOW()
      )
    `)

    // Get already-applied migrations
    const applied = await client.query<{ filename: string }>(
      `SELECT filename FROM _migrations ORDER BY filename ASC`
    )
    const appliedSet = new Set(applied.rows.map(r => r.filename))

    // Read migration files in order
    const migrationsDir = path.join(__dirname, 'migrations')
    const files = fs
      .readdirSync(migrationsDir)
      .filter(f => f.endsWith('.sql'))
      .sort()

    let count = 0
    for (const file of files) {
      if (appliedSet.has(file)) {
        console.log(`  ⏭  Skipping ${file} (already applied)`)
        continue
      }

      const sql = fs.readFileSync(path.join(migrationsDir, file), 'utf-8')

      console.log(`  ▶  Applying ${file}…`)
      await client.query('BEGIN')
      try {
        await client.query(sql)
        await client.query(
          `INSERT INTO _migrations (filename) VALUES ($1)`,
          [file]
        )
        await client.query('COMMIT')
        console.log(`  ✅  ${file} applied`)
        count++
      } catch (err) {
        await client.query('ROLLBACK')
        console.error(`  ❌  Failed on ${file}:`, (err as Error).message)
        throw err
      }
    }

    if (count === 0) {
      console.log('\n✅ Database is already up to date.\n')
    } else {
      console.log(`\n✅ ${count} migration(s) applied successfully.\n`)
    }
  } finally {
    client.release()
    await pool.end()
  }
}

migrate().catch(err => {
  console.error('\n❌ Migration failed:', err.message)
  process.exit(1)
})
