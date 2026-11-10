-- Bảng lưu trữ đơn đặt hàng COD cho website UHi (uhi.vn)
CREATE TABLE IF NOT EXISTS uhi_orders (
  id TEXT PRIMARY KEY,
  request_id TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  address TEXT NOT NULL,
  note TEXT DEFAULT '',
  items JSONB NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending_quote'
);

CREATE INDEX IF NOT EXISTS idx_uhi_orders_created_at ON uhi_orders (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_uhi_orders_phone ON uhi_orders (phone);
CREATE INDEX IF NOT EXISTS idx_uhi_orders_request_id ON uhi_orders (request_id);

-- Enable RLS
ALTER TABLE uhi_orders ENABLE ROW LEVEL SECURITY;

-- Allow insert from anon/authenticated with valid payload
CREATE POLICY "Allow public insert to uhi_orders" ON uhi_orders
  FOR INSERT TO anon, authenticated
  WITH CHECK (true);

-- Only service_role can select/update/delete orders
CREATE POLICY "Allow service_role full access to uhi_orders" ON uhi_orders
  FOR ALL TO service_role
  USING (true)
  WITH CHECK (true);
