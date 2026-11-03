// ─────────────────────────────────────────────
// TOOLty Admin Authentication & Session Security
// Strict Master Credentials & Web Crypto JWT Verification
// ─────────────────────────────────────────────

export const ALLOWED_ADMIN_EMAILS = [
  'zunnorain7@gmail.com',
  'zunnorainrajpoot7@gmail.com',
  ...(process.env.ADMIN_EMAIL ? [process.env.ADMIN_EMAIL.trim().toLowerCase()] : []),
];

export const MASTER_ADMIN_CREDENTIALS = {
  email: process.env.ADMIN_EMAIL || 'zunnorain7@gmail.com',
  password: process.env.ADMIN_PASSWORD || 'Rajpoot786$$',
  allowedEmails: ALLOWED_ADMIN_EMAILS,
};

const JWT_SECRET = process.env.ADMIN_JWT_SECRET || 'toolty_enterprise_admin_secret_jwt_2026_secure';
export const ADMIN_COOKIE_NAME = 'admin_session';

// Helper to convert string to BufferSource
function strToBuffer(str: string): BufferSource {
  const encoded = new TextEncoder().encode(str);
  return encoded.buffer as ArrayBuffer;
}

// Helper to base64url encode
function base64UrlEncode(str: string): string {
  if (typeof Buffer !== 'undefined') {
    return Buffer.from(str)
      .toString('base64')
      .replace(/=/g, '')
      .replace(/\+/g, '-')
      .replace(/\//g, '_');
  }
  return btoa(str)
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
}

// Helper to base64url decode
function base64UrlDecode(str: string): string {
  let base64 = str.replace(/-/g, '+').replace(/_/g, '/');
  while (base64.length % 4) {
    base64 += '=';
  }
  if (typeof Buffer !== 'undefined') {
    return Buffer.from(base64, 'base64').toString('utf8');
  }
  return atob(base64);
}

async function getCryptoKey(): Promise<CryptoKey> {
  return crypto.subtle.importKey(
    'raw',
    strToBuffer(JWT_SECRET),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign', 'verify']
  );
}

/**
 * Creates a signed JWT session token for authenticated admin
 */
export async function createAdminSessionToken(email: string = MASTER_ADMIN_CREDENTIALS.email): Promise<string> {
  const header = base64UrlEncode(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const payload = base64UrlEncode(
    JSON.stringify({
      email,
      role: 'admin',
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60, // 7 days
    })
  );

  const unsignedToken = `${header}.${payload}`;
  const key = await getCryptoKey();
  const signatureBuffer = await crypto.subtle.sign('HMAC', key, strToBuffer(unsignedToken));

  const signature = base64UrlEncode(
    String.fromCharCode(...new Uint8Array(signatureBuffer))
  );

  return `${unsignedToken}.${signature}`;
}

/**
 * Verifies a JWT session token in Edge and Node runtimes
 */
export async function verifyAdminSessionToken(token?: string | null): Promise<{ valid: boolean; email?: string }> {
  if (!token || typeof token !== 'string') {
    return { valid: false };
  }

  const parts = token.split('.');
  if (parts.length !== 3) {
    return { valid: false };
  }

  const [header, payload, signature] = parts;
  const unsignedToken = `${header}.${payload}`;

  try {
    const key = await getCryptoKey();
    const expectedSigBuffer = await crypto.subtle.sign('HMAC', key, strToBuffer(unsignedToken));
    const expectedSig = base64UrlEncode(
      String.fromCharCode(...new Uint8Array(expectedSigBuffer))
    );

    if (signature !== expectedSig) {
      return { valid: false };
    }

    const decodedPayload = JSON.parse(base64UrlDecode(payload));
    const now = Math.floor(Date.now() / 1000);

    if (decodedPayload.exp && decodedPayload.exp < now) {
      return { valid: false };
    }

    if (decodedPayload.role !== 'admin') {
      return { valid: false };
    }

    return { valid: true, email: decodedPayload.email };
  } catch {
    return { valid: false };
  }
}
