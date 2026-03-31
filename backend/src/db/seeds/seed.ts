import bcrypt from 'bcryptjs'
// import pool from '../config/db'
// import { validateEnv } from '../config/env'
import pool from '@/config/db'
import { validateEnv } from '@/config/env'

validateEnv()

async function seed() {
  const client = await pool.connect()
  console.log('\n🌱 Seeding database with demo data…\n')

  try {
    await client.query('BEGIN')

    // ── 1. Users ──────────────────────────────────────────────────────────
    console.log('  👤 Creating users…')
    const passwordHash = await bcrypt.hash('password123', 10)

    await client.query(`
      INSERT INTO users (name, email, password_hash, role) VALUES
        ('Admin User',    'admin@store.com',   $1, 'admin'),
        ('Esi Nyarko',    'esi@store.com',     $1, 'manager'),
        ('Kwabena Osei',  'kwabena@store.com', $1, 'cashier'),
        ('Adjoa Sarpong', 'adjoa@store.com',   $1, 'cashier'),
        ('Nana Yaw',      'nana@store.com',    $1, 'cashier')
      ON CONFLICT (email) DO NOTHING
    `, [passwordHash])

    // ── 2. Products ───────────────────────────────────────────────────────
    console.log('  📦 Creating products…')
    const productsResult = await client.query(`
      INSERT INTO products (name, category, price, cost_price, barcode, description) VALUES
        ('Milo 400g',             'Beverages',  12.00,  8.50, '6001087014218', 'Chocolate malt drink'),
        ('Fanta 500ml',           'Beverages',   7.00,  4.50, '5449000054227', 'Orange flavoured drink'),
        ('Coca-Cola 500ml',       'Beverages',   7.00,  4.50, '5449000000996', 'Classic cola drink'),
        ('Peak Milk 400g',        'Beverages',  18.00, 12.00, '5900951010048', 'Full cream powdered milk'),
        ('Malt drink 330ml',      'Beverages',   5.50,  3.50, '5449000123450', 'Non-alcoholic malt'),
        ('Indomie Chicken 70g',   'Food',         2.00,  1.20, '8998553500404', 'Instant noodles'),
        ('Indomie Onion 70g',     'Food',         2.00,  1.20, '8998553500411', 'Instant noodles onion'),
        ('Mentos Roll',           'Food',         3.50,  2.00, '8710400024700', 'Mint candy roll'),
        ('Tom Tom Candy',         'Food',         1.00,  0.50, '6001010001234', 'Menthol candy'),
        ('Digestive Biscuit',     'Food',         9.00,  6.00, '7622210951045', 'Wheat biscuits'),
        ('Paracetamol 500mg ×8',  'Health',       1.50,  0.80, '5012295510019', 'Pain relief tablets'),
        ('Robb Balm 25g',         'Health',       4.00,  2.50, '6001010009999', 'Medicated balm'),
        ('Fair & White Cream',    'Health',      25.00, 16.00, '3760120740012', 'Body lotion'),
        ('Vaseline 100ml',        'Health',       8.00,  5.00, '7501032307529', 'Petroleum jelly'),
        ('Sunlight Soap 200g',    'Household',    4.50,  2.80, '8712561530046', 'Laundry soap'),
        ('Omo Powder 500g',       'Household',    9.00,  6.00, '8720632014875', 'Detergent powder'),
        ('Dettol 250ml',          'Household',   14.00,  9.00, '6001010020001', 'Antiseptic liquid'),
        ('Colgate Toothpaste',    'Health',       8.00,  5.50, '7891024121381', 'Fluoride toothpaste'),
        ('Nescafé Classic 200g',  'Beverages',   22.00, 15.00, '7613033099472', 'Instant coffee'),
        ('Blue Band 250g',        'Food',         7.50,  5.00, '6001087099887', 'Margarine spread')
      ON CONFLICT (barcode) DO NOTHING
      RETURNING id
    `)

    const productIds = productsResult.rows.map(r => r.id as number)

    // ── 3. Inventory ──────────────────────────────────────────────────────
    console.log('  📊 Setting up inventory…')
    const stockLevels = [84, 12, 55, 45, 30, 210, 190, 5, 120, 40, 0, 60, 18, 35, 8, 72, 25, 32, 15, 48]
    const reorderLevels = [20, 30, 30, 20, 25, 100, 100, 50, 100, 30, 200, 50, 25, 30, 40, 50, 20, 30, 15, 30]

    for (let i = 0; i < productIds.length; i++) {
      await client.query(`
        INSERT INTO inventory (product_id, quantity_in_stock, reorder_level, supplier_name, supplier_phone)
        VALUES ($1, $2, $3, $4, $5)
        ON CONFLICT (product_id) DO NOTHING
      `, [
        productIds[i],
        stockLevels[i]  || 0,
        reorderLevels[i] || 10,
        'Supplier Ghana Ltd',
        '0302123456',
      ])
    }

    // ── 4. Customers ──────────────────────────────────────────────────────
    console.log('  👥 Creating customers…')
    await client.query(`
      INSERT INTO customers (name, phone, email, address, loyalty_points, total_spent) VALUES
        ('Kwame Asante',    '0244123456', 'kwame@gmail.com',   'Accra, East Legon',    120, 1240.50),
        ('Ama Boateng',     '0551234567', 'ama@yahoo.com',     'Kumasi, Adum',         843, 8432.00),
        ('Kofi Mensah',     '0271234567', NULL,                'Accra, Tema',           32,  320.75),
        ('Abena Sarpong',   '0201234567', 'abena@outlook.com', 'Accra, Spintex',       561, 5610.00),
        ('Yaw Darko',       '0261234567', NULL,                'Cape Coast',            19,  190.25),
        ('Akosua Frimpong', '0241234567', 'akosua@gmail.com',  'Accra, Madina',        200, 2000.00),
        ('Kweku Agyeman',   '0208765432', NULL,                'Takoradi',              45,  450.00)
      ON CONFLICT (phone) DO NOTHING
    `)

    // ── 5. Sample sales ───────────────────────────────────────────────────
    console.log('  🧾 Creating sample sales…')

    // Get IDs we just inserted
    const userRes     = await client.query(`SELECT id FROM users WHERE email = 'admin@store.com'`)
    const cashierRes  = await client.query(`SELECT id FROM users WHERE email = 'kwabena@store.com'`)
    const customer1   = await client.query(`SELECT id FROM customers WHERE phone = '0244123456'`)
    const adminId     = userRes.rows[0]?.id as number
    const cashierId   = cashierRes.rows[0]?.id as number
    const custId      = customer1.rows[0]?.id as number

    if (adminId && productIds.length >= 5) {
      // Sale 1 — cash
      const sale1 = await client.query(`
        INSERT INTO sales (transaction_code, user_id, customer_id, subtotal, discount_amount, tax_amount, total_amount, payment_method, status, created_at)
        VALUES ('TXN-20240410-0001', $1, $2, 28.00, 0, 4.20, 32.20, 'cash', 'completed', NOW() - INTERVAL '2 hours')
        RETURNING id
      `, [cashierId || adminId, custId || null])

      await client.query(`
        INSERT INTO sale_items (sale_id, product_id, product_name, quantity, unit_price, discount, line_total)
        VALUES
          ($1, $2, 'Milo 400g',    2, 12.00, 0, 24.00),
          ($1, $3, 'Mentos Roll',  1,  3.50, 0,  3.50),
          ($1, $4, 'Tom Tom Candy',1,  0.50, 0,  0.50)
      `, [sale1.rows[0].id, productIds[0], productIds[7], productIds[8]])

      await client.query(`
        INSERT INTO payments (sale_id, amount_paid, amount_tendered, change_given, method, status, verified_at)
        VALUES ($1, 32.20, 50.00, 17.80, 'cash', 'success', NOW() - INTERVAL '2 hours')
      `, [sale1.rows[0].id])

      // Sale 2 — mobile money
      const sale2 = await client.query(`
        INSERT INTO sales (transaction_code, user_id, subtotal, discount_amount, tax_amount, total_amount, payment_method, status, created_at)
        VALUES ('TXN-20240410-0002', $1, 32.00, 0, 4.80, 36.80, 'momo', 'completed', NOW() - INTERVAL '1 hour')
        RETURNING id
      `, [adminId])

      await client.query(`
        INSERT INTO sale_items (sale_id, product_id, product_name, quantity, unit_price, discount, line_total)
        VALUES
          ($1, $2, 'Fanta 500ml',   4, 7.00, 0, 28.00),
          ($1, $3, 'Tom Tom Candy', 4, 1.00, 0,  4.00)
      `, [sale2.rows[0].id, productIds[1], productIds[8]])

      await client.query(`
        INSERT INTO payments (sale_id, paystack_ref, amount_paid, method, status, verified_at)
        VALUES ($1, 'PSK_TEST_DEMO_001', 36.80, 'momo', 'success', NOW() - INTERVAL '1 hour')
      `, [sale2.rows[0].id])
    }

    await client.query('COMMIT')

    console.log('\n✅ Seed complete! Demo credentials:')
    console.log('   Admin   : admin@store.com   / password123')
    console.log('   Manager : esi@store.com     / password123')
    console.log('   Cashier : kwabena@store.com / password123\n')

  } catch (err) {
    await client.query('ROLLBACK')
    console.error('❌ Seed failed:', (err as Error).message)
    throw err
  } finally {
    client.release()
    await pool.end()
  }
}

seed().catch(err => {
  console.error(err)
  process.exit(1)
})
