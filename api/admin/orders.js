import { verifySessionToken, isAuthConfigured } from './_auth.js';

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');

  if (!isAuthConfigured()) {
    return res.status(503).json({
      error: 'admin_not_configured',
      message: 'Tính năng quản trị chưa được cấu hình biến môi trường UHI_ADMIN_PASSWORD.'
    });
  }

  // 1. Extract session token from HttpOnly cookie (or Authorization header for API testing)
  let token = null;
  const cookieHeader = req.headers.cookie || '';
  const match = cookieHeader.match(/(?:^|;\s*)uhi_admin_token=([^;]+)/);
  if (match) {
    token = match[1];
  } else if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
    token = req.headers.authorization.substring(7).trim();
  }

  // 2. Verify token
  const session = verifySessionToken(token);
  if (!session) {
    return res.status(401).json({
      error: 'unauthorized',
      message: 'Phiên làm việc đã hết hạn hoặc chưa đăng nhập. Vui lòng đăng nhập lại.'
    });
  }

  // 3. Database connection
  const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    return res.status(200).json({
      message: 'Chưa cấu hình SUPABASE_SERVICE_ROLE_KEY trên server để đọc dữ liệu đơn hàng.',
      results: []
    });
  }

  const dbHeaders = {
    'apikey': supabaseKey,
    'Authorization': `Bearer ${supabaseKey}`,
    'Content-Type': 'application/json'
  };

  try {
    if (req.method === 'GET') {
      const dbRes = await fetch(
        `${supabaseUrl}/rest/v1/uhi_orders?select=id,request_id,created_at,name,phone,address,note,items,status&order=created_at.desc&limit=200`,
        { headers: dbHeaders }
      );
      if (!dbRes.ok) {
        const errText = await dbRes.text();
        console.error('Supabase fetch orders error:', dbRes.status, errText);
        return res.status(500).json({ error: 'db_query_failed', message: 'Không thể tải danh sách đơn từ cơ sở dữ liệu' });
      }
      const data = await dbRes.json();
      return res.status(200).json(data || []);
    } else if (req.method === 'PATCH') {
      const body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
      const { id, status } = body;
      if (!id || !['pending_quote', 'confirmed', 'shipped', 'completed', 'cancelled'].includes(status)) {
        return res.status(400).json({ error: 'invalid_status', message: 'Trạng thái đơn không hợp lệ' });
      }

      const updateRes = await fetch(
        `${supabaseUrl}/rest/v1/uhi_orders?id=eq.${encodeURIComponent(id)}`,
        {
          method: 'PATCH',
          headers: {
            ...dbHeaders,
            'Prefer': 'return=minimal'
          },
          body: JSON.stringify({ status })
        }
      );

      if (!updateRes.ok) {
        return res.status(500).json({ error: 'update_failed', message: 'Cập nhật trạng thái thất bại' });
      }
      return res.status(200).json({ ok: true, message: 'Đã cập nhật trạng thái đơn thành công' });
    } else {
      return res.status(405).json({ error: 'method_not_allowed', message: 'Chỉ chấp nhận GET và PATCH' });
    }
  } catch (err) {
    console.error('Admin orders API exception:', err);
    return res.status(500).json({ error: 'server_error', message: err.message });
  }
}
