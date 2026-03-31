-- Migration 005: Create sale_items table
CREATE TABLE IF NOT EXISTS sale_items (
  id           SERIAL PRIMARY KEY,
  sale_id      INTEGER         NOT NULL REFERENCES sales(id) ON DELETE CASCADE,
  product_id   INTEGER         NOT NULL REFERENCES products(id),
  product_name VARCHAR(200)    NOT NULL,  -- snapshot at time of sale
  quantity     INTEGER         NOT NULL CHECK (quantity > 0),
  unit_price   NUMERIC(10, 2)  NOT NULL CHECK (unit_price >= 0),
  discount     NUMERIC(10, 2)  NOT NULL DEFAULT 0,
  line_total   NUMERIC(12, 2)  NOT NULL CHECK (line_total >= 0)
);

CREATE INDEX IF NOT EXISTS idx_sale_items_sale_id    ON sale_items (sale_id);
CREATE INDEX IF NOT EXISTS idx_sale_items_product_id ON sale_items (product_id);
