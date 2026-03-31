import { query, queryOne } from '../config/db'

export interface User {
  id: number
  name: string
  email: string
  password_hash: string
  role: 'admin' | 'manager' | 'cashier'
  is_active: boolean
  created_at: string
  updated_at: string
}

export type SafeUser = Omit<User, 'password_hash'>

export const UserModel = {
  async findAll(): Promise<SafeUser[]> {
    return query<SafeUser>(
      `SELECT id, name, email, role, is_active, created_at, updated_at
       FROM users ORDER BY created_at DESC`
    )
  },

  async findById(id: number): Promise<SafeUser | null> {
    return queryOne<SafeUser>(
      `SELECT id, name, email, role, is_active, created_at, updated_at
       FROM users WHERE id = $1`,
      [id]
    )
  },

  async findByEmail(email: string): Promise<User | null> {
    return queryOne<User>(
      `SELECT * FROM users WHERE email = $1 AND is_active = true`,
      [email]
    )
  },

  async create(data: {
    name: string
    email: string
    passwordHash: string
    role: string
  }): Promise<SafeUser> {
    const result = await queryOne<SafeUser>(
      `INSERT INTO users (name, email, password_hash, role)
       VALUES ($1, $2, $3, $4)
       RETURNING id, name, email, role, is_active, created_at, updated_at`,
      [data.name, data.email, data.passwordHash, data.role]
    )
    return result!
  },

  async update(id: number, data: Partial<{
    name: string
    email: string
    role: string
    isActive: boolean
    passwordHash: string
  }>): Promise<SafeUser | null> {
    const fields: string[] = []
    const values: unknown[] = []
    let i = 1

    if (data.name)         { fields.push(`name = $${i++}`);          values.push(data.name) }
    if (data.email)        { fields.push(`email = $${i++}`);         values.push(data.email) }
    if (data.role)         { fields.push(`role = $${i++}`);          values.push(data.role) }
    if (data.isActive !== undefined) { fields.push(`is_active = $${i++}`); values.push(data.isActive) }
    if (data.passwordHash) { fields.push(`password_hash = $${i++}`); values.push(data.passwordHash) }

    if (fields.length === 0) return this.findById(id)

    fields.push(`updated_at = NOW()`)
    values.push(id)

    return queryOne<SafeUser>(
      `UPDATE users SET ${fields.join(', ')}
       WHERE id = $${i}
       RETURNING id, name, email, role, is_active, created_at, updated_at`,
      values
    )
  },

  async deactivate(id: number): Promise<void> {
    await query(`UPDATE users SET is_active = false, updated_at = NOW() WHERE id = $1`, [id])
  },
}
