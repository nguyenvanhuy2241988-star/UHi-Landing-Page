import { createSessionToken } from './_auth.js';

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'method_not_allowed', message: 'Chỉ chấp nhận phương thức POST' });
  }

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
    const { password, username } = body;

    const expectedPassword = process.env.UHI_ADMIN_PASSWORD || 'UHi2026@Admin!';

    if (!password || password !== expectedPassword) {
      return res.status(401).json({
        error: 'invalid_credentials',
        message: 'Mật khẩu quản trị không chính xác.'
      });
    }

    const token = createSessionToken(username || 'admin');
    
    // Set HTTP-only cookie
    res.setHeader('Set-Cookie', `uhi_admin_token=${token}; Path=/; HttpOnly; SameSite=Strict; Max-Age=43200`);

    return res.status(200).json({
      ok: true,
      token,
      message: 'Đăng nhập thành công'
    });
  } catch (err) {
    console.error('Admin login error:', err);
    return res.status(500).json({ error: 'server_error', message: 'Lỗi máy chủ trong quá trình xác thực' });
  }
}
