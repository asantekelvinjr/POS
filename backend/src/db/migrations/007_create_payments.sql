-- Migration 007: Create payments table
CREATE TABLE IF NOT EXISTS payments (
  id               SERIAL PRIMARY KEY,
  sale_id          INTEGER         NOT NULL REFERENCES sales(id) ON DELETE CASCADE,
  paystack_ref     VARCHAR(100)    UNIQUE,
  amount_paid      NUMERIC(12, 2)  NOT NULL,
  amount_tendered  NUMERIC(12, 2),   -- cash only: how much customer gave
  change_given     NUMERIC(10, 2),   -- cash only: change returned
  method           VARCHAR(20)     NOT NULL
                     CHECK (method IN ('cash', 'momo', 'card')),
  status           VARCHAR(20)     NOT NULL DEFAULT 'pending'
                     CHECK (status IN ('success', 'failed', 'pending')),
  verified_at      TIMESTAMPTZ,
  created_at       TIMESTAMPTZ     NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_payments_sale_id      ON payments (sale_id);
CREATE INDEX IF NOT EXISTS idx_payments_paystack_ref ON payments (paystack_ref);
CREATE INDEX IF NOT EXISTS idx_payments_status       ON payments (status);
