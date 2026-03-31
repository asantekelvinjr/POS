-- Migration 004: Create sales table
CREATE TABLE IF NOT EXISTS sales (
  id               SERIAL PRIMARY KEY,
  transaction_code VARCHAR(30)     NOT NULL UNIQUE,
  user_id          INTEGER         NOT NULL REFERENCES users(id),
  customer_id      INTEGER                  REFERENCES customers(id) ON DELETE SET NULL,
  subtotal         NUMERIC(12, 2)  NOT NULL CHECK (subtotal >= 0),
  discount_amount  NUMERIC(10, 2)  NOT NULL DEFAULT 0 CHECK (discount_amount >= 0),
  tax_amount       NUMERIC(10, 2)  NOT NULL DEFAULT 0 CHECK (tax_amount >= 0),
  total_amount     NUMERIC(12, 2)  NOT NULL CHECK (total_amount >= 0),
  payment_method   VARCHAR(20)     NOT NULL
                     CHECK (payment_method IN ('cash', 'momo', 'card')),
  status           VARCHAR(20)     NOT NULL DEFAULT 'completed'
                     CHECK (status IN ('completed', 'refunded', 'pending')),
  notes            TEXT,
  created_at       TIMESTAMPTZ     NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_sales_user_id     ON sales (user_id);
CREATE INDEX IF NOT EXISTS idx_sales_customer_id ON sales (customer_id);
CREATE INDEX IF NOT EXISTS idx_sales_created_at  ON sales (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_sales_status      ON sales (status);
CREATE INDEX IF NOT EXISTS idx_sales_txn_code    ON sales (transaction_code);
