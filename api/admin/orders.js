export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');

  // Verify server-side admin secret
  const adminKey = req.headers['x-admin-key'] || req.query.key;
  const configuredKey = process.env.UHI_ADMIN_KEY;

  if (!configuredKey || adminKey !== configuredKey) {
    return res.status(401).json({
      error: 'unauthorized',
      message: 'Yêu cầu khóa quản trị hợp lệ qua header X-Admin-Key hoặc tham số ?key=...'
    });
  }

  const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    return res.status(200).json({
      message: 'Các yêu cầu đặt hàng COD hiện đang được gửi an toàn trực tiếp về email điều hành lyhu.vn@gmail.com. Hãy cấu hình SUPABASE_URL và SUPABASE_SERVICE_ROLE_KEY trên Vercel để hiển thị dữ liệu tập trung tại trang này.',
      results: []
    });
  }

  try {
    if (req.method === 'GET') {
      const response = await fetch(`${supabaseUrl}/rest/v1/orders?select=id,created_at,name,phone,address,note,items,status&order=created_at.desc&limit=200`, {
        headers: {
          'apikey': supabaseKey,
          'Authorization': `Bearer ${supabaseKey}`
        }
      });
      if (!response.ok) {
        throw new Error(`Supabase query failed: ${response.status}`);
      }
      const data = await response.json();
      return res.status(200).json(data || []);
    } else if (req.method === 'PATCH') {
      const { id, status } = req.body || {};
      if (!id || !['pending_quote', 'confirmed', 'shipped', 'completed', 'cancelled'].includes(status)) {
        return res.status(400).json({ error: 'invalid_status' });
      }
      const response = await fetch(`${supabaseUrl}/rest/v1/orders?id=eq.${id}`, {
        method: 'PATCH',
        headers: {
          'apikey': supabaseKey,
          'Authorization': `Bearer ${supabaseKey}`,
          'Content-Type': 'application/json',
          'Prefer': 'return=minimal'
        },
        body: JSON.stringify({ status })
      });
      if (!response.ok) {
        throw new Error(`Supabase update failed: ${response.status}`);
      }
      return res.status(200).json({ ok: true });
    } else {
      return res.status(405).json({ error: 'method_not_allowed' });
    }
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
