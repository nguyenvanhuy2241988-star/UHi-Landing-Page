import crypto from 'crypto';

// CRITICAL: Absolutely NO hardcoded fallback secrets.
// If process.env.UHI_ADMIN_PASSWORD is not configured, admin operations must be locked.
function getSecret() {
  const secret = process.env.UHI_ADMIN_PASSWORD;
  if (!secret || typeof secret !== 'string' || secret.trim().length === 0) {
    return null;
  }
  return secret.trim();
}

export function isAuthConfigured() {
  return getSecret() !== null;
}

export function createSessionToken(username = 'admin', customTtlMs = null) {
  const secret = getSecret();
  if (!secret) return null;

  const timestamp = Date.now();
  const ttl = customTtlMs !== null ? customTtlMs : 12 * 60 * 60 * 1000; // 12 hours default
  const expiresAt = timestamp + ttl;

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
  if (!secret) return null;

  const expectedSignature = crypto.createHmac('sha256', secret).update(payloadB64).digest('base64url');
  if (signature !== expectedSignature) return null;

  try {
    const data = JSON.parse(Buffer.from(payloadB64, 'base64url').toString('utf8'));
    if (Date.now() > data.exp) return null; // Token expired
    return data;
  } catch {
    return null;
  }
}
