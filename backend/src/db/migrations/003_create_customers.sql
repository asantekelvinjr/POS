-- Migration 003: Create customers table
CREATE TABLE IF NOT EXISTS customers (
  id             SERIAL PRIMARY KEY,
  name           VARCHAR(100)    NOT NULL,
  phone          VARCHAR(20)     UNIQUE,
  email          VARCHAR(150)    UNIQUE,
  address        TEXT,
  loyalty_points INTEGER         NOT NULL DEFAULT 0 CHECK (loyalty_points >= 0),
  total_spent    NUMERIC(12, 2)  NOT NULL DEFAULT 0,
  created_at     TIMESTAMPTZ     NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_customers_phone  ON customers (phone);
CREATE INDEX IF NOT EXISTS idx_customers_email  ON customers (email);
CREATE INDEX IF NOT EXISTS idx_customers_name   ON customers (name);
