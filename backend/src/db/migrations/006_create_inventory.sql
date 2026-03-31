-- Migration 006: Create inventory table
CREATE TABLE IF NOT EXISTS inventory (
  id                  SERIAL PRIMARY KEY,
  product_id          INTEGER         NOT NULL UNIQUE REFERENCES products(id) ON DELETE CASCADE,
  quantity_in_stock   INTEGER         NOT NULL DEFAULT 0 CHECK (quantity_in_stock >= 0),
  reorder_level       INTEGER         NOT NULL DEFAULT 10 CHECK (reorder_level >= 0),
  supplier_name       VARCHAR(150),
  supplier_phone      VARCHAR(20),
  last_restocked_at   TIMESTAMPTZ,
  updated_at          TIMESTAMPTZ     NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_inventory_product_id    ON inventory (product_id);
CREATE INDEX IF NOT EXISTS idx_inventory_qty           ON inventory (quantity_in_stock);
CREATE INDEX IF NOT EXISTS idx_inventory_low_stock     ON inventory (quantity_in_stock, reorder_level);
