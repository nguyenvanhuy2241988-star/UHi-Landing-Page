import crypto from 'crypto';

const getSecret = () => process.env.UHI_ADMIN_PASSWORD || process.env.ADMIN_SECRET || 'UHi-Secure-Admin-LYHU-2026';

export function createSessionToken(username = 'admin') {
  const secret = getSecret();
  const timestamp = Date.now();
  const expiresAt = timestamp + 12 * 60 * 60 * 1000; // 12 hours
  const payload = Buffer.from(JSON.stringify({ u: username, t: timestamp, exp: expiresAt })).toString('base64url');
  const signature = crypto.createHmac('sha256', secret).update(payload).digest('base64url');
  return `${payload}.${signature}`;
}

export function verifySessionToken(token) {
  if (!token || typeof token !== 'string') return null;
  const parts = token.split('.');
  if (parts.length !== 2) return null;
  const [payloadB64, signature] = parts;

  const secret = getSecret();
  const expectedSignature = crypto.createHmac('sha256', secret).update(payloadB64).digest('base64url');
  if (signature !== expectedSignature) return null;

  try {
    const data = JSON.parse(Buffer.from(payloadB64, 'base64url').toString('utf8'));
    if (Date.now() > data.exp) return null; // expired
    return data;
  } catch {
    return null;
  }
}
