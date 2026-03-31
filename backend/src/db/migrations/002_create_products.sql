-- Migration 002: Create products table
CREATE TABLE IF NOT EXISTS products (
  id          SERIAL PRIMARY KEY,
  name        VARCHAR(200)    NOT NULL,
  category    VARCHAR(100)    NOT NULL,
  price       NUMERIC(10, 2)  NOT NULL CHECK (price >= 0),
  cost_price  NUMERIC(10, 2)           CHECK (cost_price >= 0),
  barcode     VARCHAR(100)    UNIQUE,
  description TEXT,
  image_url   TEXT,
  is_active   BOOLEAN         NOT NULL DEFAULT true,
  created_at  TIMESTAMPTZ     NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_products_barcode   ON products (barcode);
CREATE INDEX IF NOT EXISTS idx_products_category  ON products (category);
CREATE INDEX IF NOT EXISTS idx_products_active    ON products (is_active);
CREATE INDEX IF NOT EXISTS idx_products_name      ON products USING gin(to_tsvector('english', name));
