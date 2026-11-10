-- ====================================================================
-- Bảng lưu trữ đơn đặt hàng COD cho website UHi (uhi.vn)
-- BẢO MẬT: Chỉ cho phép backend (service_role) đọc và ghi.
-- Tuyệt đối KHÔNG cấp quyền ghi trực tiếp cho anon hay authenticated.
-- ====================================================================

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

-- Chỉ mục tối ưu truy vấn theo thời gian, số điện thoại và request_id
CREATE INDEX IF NOT EXISTS idx_uhi_orders_created_at ON uhi_orders (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_uhi_orders_phone ON uhi_orders (phone);
CREATE INDEX IF NOT EXISTS idx_uhi_orders_request_id ON uhi_orders (request_id);

-- Bật Row Level Security (RLS)
ALTER TABLE uhi_orders ENABLE ROW LEVEL SECURITY;

-- Thu hồi toàn bộ quyền từ anon và authenticated để chống bypass API backend
REVOKE ALL ON TABLE uhi_orders FROM anon, authenticated;

-- Xóa các policy cũ nếu có
DROP POLICY IF EXISTS "Allow public insert to uhi_orders" ON uhi_orders;
DROP POLICY IF EXISTS "Allow service_role full access to uhi_orders" ON uhi_orders;
DROP POLICY IF EXISTS "Service role full access" ON uhi_orders;

-- CHỈ DUY NHẤT service_role (Backend API) có toàn quyền thao tác
CREATE POLICY "Service role full access" ON uhi_orders
  FOR ALL TO service_role
  USING (true)
  WITH CHECK (true);
