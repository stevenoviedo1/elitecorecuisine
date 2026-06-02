-- ============================================
-- EliteCore Cuisine - Orders Table
-- Run this in Supabase SQL Editor
-- ============================================

CREATE TABLE IF NOT EXISTS orders (
  id TEXT PRIMARY KEY,
  items JSONB NOT NULL,
  customer JSONB NOT NULL,
  total NUMERIC NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  payment_status TEXT NOT NULL DEFAULT 'unpaid',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ,
  cancellation_reason TEXT
);

-- Indexes for fast dashboard queries
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at DESC);

-- Optional: Enable Row Level Security later if you want
-- ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

COMMENT ON TABLE orders IS 'Restaurant orders for EliteCore Cuisine';

-- If the table already exists from an older version (without payment_status column),
-- run this to add the missing column:
ALTER TABLE orders ADD COLUMN IF NOT EXISTS payment_status TEXT NOT NULL DEFAULT 'unpaid';