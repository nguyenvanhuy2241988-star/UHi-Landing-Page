import { createSessionToken, isAuthConfigured } from './_auth.js';

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'method_not_allowed', message: 'Chỉ chấp nhận phương thức POST' });
  }

  // 1. Check if admin password is configured in environment
  if (!isAuthConfigured()) {
    return res.status(503).json({
      error: 'admin_not_configured',
      message: 'Tính năng quản trị chưa được cấu hình biến môi trường UHI_ADMIN_PASSWORD trên server.'
    });
  }

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
    const { password, username } = body;

    const expectedPassword = process.env.UHI_ADMIN_PASSWORD;

    // 2. Validate password (strict comparison)
    if (!password || password !== expectedPassword) {
      return res.status(401).json({
        error: 'invalid_credentials',
        message: 'Mật khẩu quản trị không chính xác.'
      });
    }

    // 3. Issue secure session token
    const token = createSessionToken(username || 'admin');
    if (!token) {
      return res.status(500).json({ error: 'token_generation_failed', message: 'Không thể khởi tạo phiên làm việc.' });
    }

    // 4. Set HttpOnly, Secure, SameSite=Strict cookie
    res.setHeader('Set-Cookie', `uhi_admin_token=${token}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=43200`);

    // 5. DO NOT expose token in JSON body
    return res.status(200).json({
      ok: true,
      message: 'Đăng nhập thành công'
    });

  } catch (err) {
    console.error('Admin login error:', err);
    return res.status(500).json({ error: 'server_error', message: 'Lỗi máy chủ trong quá trình xác thực' });
  }
}
