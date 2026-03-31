# PayPoint POS — Backend

Express.js + Node.js REST API with PostgreSQL database and Paystack payment integration.

## Tech Stack

| Layer | Technology |
|---|---|
| Runtime | Node.js 20+ |
| Framework | Express.js 4 |
| Language | TypeScript 5 |
| Database | PostgreSQL 14+ |
| ORM | Raw SQL via `node-postgres` (pg) |
| Auth | JWT (jsonwebtoken) + bcryptjs |
| Validation | Zod |
| Payments | Paystack REST API |
| Dev server | tsx (watch mode) |

## Quick Start

### Prerequisites
- Node.js 20+
- PostgreSQL 14+ running locally
- A free [Paystack](https://paystack.com) account for payment keys

### 1. Install dependencies
```bash
npm install
```

### 2. Set up environment
```bash
cp .env .env.local   # or just edit .env directly
```

Open `.env` and fill in:
```
DB_HOST=localhost
DB_PORT=5432
DB_NAME=pos_db
DB_USER=postgres
DB_PASSWORD=yourpassword
JWT_SECRET=any_long_random_string
PAYSTACK_SECRET_KEY=sk_test_...
```

### 3. Create the database
```bash
# In psql or pgAdmin:
CREATE DATABASE pos_db;
```

### 4. Run migrations
```bash
npm run migrate
```
This creates all 7 tables: `users`, `products`, `customers`, `sales`, `sale_items`, `inventory`, `payments`.

### 5. Seed with demo data
```bash
npm run seed
```
Creates 5 staff accounts, 20 Ghanaian products, 7 customers, and 2 sample sales.

### 6. Start the dev server
```bash
npm run dev
```

Server runs at `http://localhost:4000`

---

## API Reference

All endpoints are prefixed with `/api`. Protected routes require:
```
Authorization: Bearer <jwt_token>
```

### Auth
| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/api/auth/login` | Public | Login, returns JWT |
| GET  | `/api/auth/me` | All | Get current user |
| POST | `/api/auth/logout` | All | Logout (client clears token) |
| PUT  | `/api/auth/change-password` | All | Change own password |

### Products
| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET  | `/api/products` | All | List all (supports `?search=` `?barcode=`) |
| GET  | `/api/products/:id` | All | Get by ID |
| POST | `/api/products` | Manager+ | Create product + inventory |
| PUT  | `/api/products/:id` | Manager+ | Update product |
| DELETE | `/api/products/:id` | Manager+ | Soft delete |

### Inventory
| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/api/inventory` | Manager+ | All stock levels |
| GET | `/api/inventory/low-stock` | Manager+ | Items at/below reorder level |
| GET | `/api/inventory/out-of-stock` | Manager+ | Items at 0 |
| PUT | `/api/inventory/product/:id/adjust` | Manager+ | Set new stock quantity |

### Sales
| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/api/sales` | All | Create sale (deducts stock) |
| GET  | `/api/sales` | Manager+ | List sales (supports date filters) |
| GET  | `/api/sales/:id` | Manager+ | Get sale with items |
| GET  | `/api/sales/summary/daily` | Manager+ | Today's totals |
| GET  | `/api/sales/summary/weekly` | Manager+ | Last 7 days by day |

### Payments
| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/api/payments/verify` | All | Verify Paystack ref + create sale |
| POST | `/api/payments/initialize` | Manager+ | Init server-side transaction |

### Customers
| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET  | `/api/customers` | All | List (supports `?search=`) |
| GET  | `/api/customers/:id` | All | Get by ID |
| GET  | `/api/customers/:id/history` | All | Purchase history |
| POST | `/api/customers` | Manager+ | Create customer |
| PUT  | `/api/customers/:id` | Manager+ | Update customer |

### Reports (Manager/Admin only)
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/reports/daily` | Today's summary |
| GET | `/api/reports/weekly` | Last 7 days by day |
| GET | `/api/reports/monthly` | By month (`?year=&month=`) |
| GET | `/api/reports/top-products` | Top sellers (`?days=7&limit=10`) |
| GET | `/api/reports/cashier-performance` | Per-cashier stats |
| GET | `/api/reports/payment-breakdown` | Cash vs MoMo vs Card |
| GET | `/api/reports/inventory` | Full inventory report |
| GET | `/api/reports/summary` | Revenue summary by date range |

### Users (Admin only)
| Method | Endpoint | Description |
|---|---|---|
| GET    | `/api/users` | List all staff |
| POST   | `/api/users` | Create staff account |
| PUT    | `/api/users/:id` | Update role/status |
| PUT    | `/api/users/:id/reset-password` | Reset password |
| DELETE | `/api/users/:id` | Deactivate account |

---

## Paystack Flow

### Cash payment
```
Frontend → POST /api/sales
  { items, paymentMethod: "cash", amountTendered: 50.00 }
← { saleId, transactionCode, total, change }
```

### Mobile Money / Card payment
```
1. Frontend opens Paystack popup
2. Customer pays on Paystack
3. Paystack returns reference to frontend
4. Frontend → POST /api/payments/verify
     { reference, items, customerId? }
   ← { saleId, transactionCode, total }
```

---

## Project Structure

```
src/
├── app.ts              ← Express app (middleware + routes)
├── server.ts           ← Entry point (DB check + listen)
├── config/
│   ├── db.ts           ← PostgreSQL pool + query helpers
│   ├── paystack.ts     ← Paystack axios client
│   └── env.ts          ← Environment validation
├── middleware/
│   ├── auth.ts         ← JWT verify, generateToken
│   ├── rbac.ts         ← Role-based access (adminOnly, managerPlus, allRoles)
│   ├── errorHandler.ts ← Global error handler + AppError class
│   └── rateLimiter.ts  ← express-rate-limit
├── routes/             ← 8 route files (thin, just wiring)
├── controllers/        ← 8 controllers (HTTP in/out, Zod validation)
├── services/           ← 6 services (business logic)
├── models/             ← 6 models (raw SQL queries)
├── types/index.ts      ← Shared TypeScript types
└── db/
    ├── migrate.ts      ← Migration runner
    ├── migrations/     ← 7 ordered SQL files
    └── seeds/seed.ts   ← Demo data
```

## Demo Login Credentials (after seeding)

| Role | Email | Password |
|---|---|---|
| Admin | admin@store.com | password123 |
| Manager | esi@store.com | password123 |
| Cashier | kwabena@store.com | password123 |

## Connecting to the Frontend

In the frontend's `.env.local`, set:
```
NEXT_PUBLIC_API_URL=http://localhost:4000/api
NEXT_PUBLIC_USE_MOCK=false
```
