export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('Set-Cookie', 'uhi_admin_token=; Path=/; HttpOnly; SameSite=Strict; Max-Age=0');
  return res.status(200).json({ ok: true, message: 'Đã đăng xuất' });
}
