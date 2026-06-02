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

-- If the table already exists from an older version, run this to add the missing column:
-- ALTER TABLE orders ADD COLUMN IF NOT EXISTS payment_status TEXT NOT NULL DEFAULT 'unpaid';

-- ============================================
-- Staff Users Table (for owner + worker logins)
-- Supports password changes from owner dashboard
-- ============================================

CREATE TABLE IF NOT EXISTS staff_users (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('owner', 'worker')),
  name TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_staff_users_email ON staff_users(email);
CREATE INDEX IF NOT EXISTS idx_staff_users_role ON staff_users(role);

COMMENT ON TABLE staff_users IS 'Staff authentication accounts (owner and workers) with hashed passwords';
