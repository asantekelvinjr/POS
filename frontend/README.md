# PayPoint POS — Frontend

Modern Point of Sale system built with **Next.js 15**, **Tailwind CSS v4**, and **Paystack** payments. Designed for Ghanaian businesses.

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15 (App Router) |
| Styling | Tailwind CSS v4 + CSS custom properties |
| State | Zustand v5 |
| Payments | Paystack (Mobile Money, Card, Cash) |
| Language | TypeScript |
| Fonts | Plus Jakarta Sans · Syne · JetBrains Mono |

## Colour System

All colours live in `src/app/globals.css` as CSS custom properties and are mapped to Tailwind utility classes:

| Class | Usage |
|---|---|
| `text-primary` / `bg-surface` | Main text and card backgrounds |
| `text-accent` / `bg-accent` | Emerald green — CTAs, active states |
| `text-highlight` / `bg-highlight` | Amber — warnings, low stock |
| `text-danger` / `bg-danger` | Red — errors, delete actions |
| `text-success` / `bg-success` | Green — confirmed, in-stock |
| `text-info` / `bg-info` | Blue — info badges, payment method |
| `text-muted` | Placeholder and hint text |
| `bg-base` | Page background (slate-50 / near-black) |
| `bg-sidebar` | Dark sidebar (both light and dark modes) |

Dark mode is toggled by adding/removing the `dark` class on `<html>`.

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Copy env and fill in your keys
cp .env.local.example .env.local

# 3. Start development server (mock data enabled by default)
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### Default login (mock mode)
- **Email:** `admin@store.com`
- **Password:** `admin123`

## Project Structure

```
src/
├── app/
│   ├── (auth)/login/          # Login page (no sidebar)
│   ├── (cashier)/pos/         # POS screen + receipt
│   └── (admin)/               # Dashboard, products, inventory…
│       ├── layout.tsx          ← Sidebar + Navbar shell
│       ├── dashboard/
│       ├── products/
│       ├── inventory/
│       ├── customers/
│       ├── reports/
│       └── users/
├── components/
│   ├── ui/                    # Button, Input, Modal, Badge, Table
│   ├── pos/                   # Cart, ProductSearch, BarcodeInput, PaymentModal
│   ├── products/              # ProductTable, ProductForm
│   ├── inventory/             # StockTable, LowStockAlert
│   ├── reports/               # SalesChart, SalesSummary
│   ├── Sidebar.tsx
│   ├── Navbar.tsx
│   └── ProtectedRoute.tsx
├── store/
│   ├── authStore.ts           # JWT + user (persisted to localStorage)
│   └── cartStore.ts           # Cart items + totals (in-memory)
├── hooks/
│   ├── useAuth.ts
│   ├── useCart.ts
│   ├── useProducts.ts
│   └── useInventory.ts
├── lib/
│   ├── api.ts                 # Fetch wrapper with auth headers
│   ├── auth.ts                # JWT decode/expiry helpers
│   ├── paystack.ts            # Paystack popup initialisation
│   └── utils.ts               # Formatting, VAT calc, validators
└── types/
    ├── product.ts
    ├── sale.ts
    ├── user.ts
    └── customer.ts
```

## Connecting to the Backend

1. Set `NEXT_PUBLIC_USE_MOCK=false` in `.env.local`
2. Set `NEXT_PUBLIC_API_URL=http://localhost:4000/api`
3. Start your Express backend on port 4000

All API calls go through `src/lib/api.ts` which automatically attaches the JWT token from localStorage.

## Paystack Integration

1. Create a free account at [paystack.com](https://paystack.com)
2. Copy your **test public key** from the dashboard
3. Set `NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY=pk_test_...` in `.env.local`

Supported payment channels in Ghana:
- **MTN Mobile Money**
- **Vodafone Cash**
- **AirtelTigo Money**
- **Debit/Credit Card**
- **Cash** (handled locally, no Paystack)

## Ghana VAT

VAT is calculated at **15%** (NHIL + GETFund levy combined). The rate is set in `src/lib/utils.ts` via `computeVAT()` and in `src/hooks/useCart.ts`.
