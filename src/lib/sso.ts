/**
 * Shared portal SSO helpers.
 *
 * The portal (platform-dash) mints a `.agoradatadriven.com`-scoped `ag_sso` cookie on login: a
 * base64url JSON payload + "." + HMAC-SHA256(payload, SSO_SECRET). Because the website is served on
 * `agoradatadriven.com`, that cookie rides along, so a logged-in portal user is known here too.
 * A super-admin is any payload whose `clients` list includes "*". Fail-closed on anything odd.
 */
import { createHmac } from 'crypto';

interface SsoPayload {
  sub?: string;
  clients?: unknown;
  exp?: number;
}

/** Verify the `ag_sso` cookie and return its payload, or null. */
export function ssoPayload(cookieHeader: string | null, secret: string): SsoPayload | null {
  if (!secret || !cookieHeader) return null;
  try {
    const cookies = Object.fromEntries(
      cookieHeader.split(';').map((c) => {
        const [k, ...v] = c.trim().split('=');
        return [k.trim(), v.join('=')];
      }),
    );
    const raw = cookies['ag_sso'];
    if (!raw) return null;
    const dot = raw.lastIndexOf('.');
    if (dot < 1) return null;
    const payloadB64 = raw.slice(0, dot);
    const sig = raw.slice(dot + 1);
    const expected = createHmac('sha256', secret).update(payloadB64, 'ascii').digest('base64url');
    if (sig !== expected) return null;
    const pad = '='.repeat((4 - (payloadB64.length % 4)) % 4);
    const payload = JSON.parse(
      Buffer.from(payloadB64 + pad, 'base64').toString('utf8'),
    ) as SsoPayload;
    if (!payload.exp || Date.now() / 1000 > payload.exp) return null;
    return payload;
  } catch {
    return null;
  }
}

/** True iff the cookie is a valid super-admin session (clients includes "*"). */
export function isSsoAdmin(cookieHeader: string | null, secret: string): boolean {
  const p = ssoPayload(cookieHeader, secret);
  return !!p && Array.isArray(p.clients) && p.clients.includes('*');
}

export interface SsoIdentity {
  email: string;
  admin: boolean;
}

/** The signed-in identity (email + admin flag), or null. */
export function ssoIdentity(cookieHeader: string | null, secret: string): SsoIdentity | null {
  const p = ssoPayload(cookieHeader, secret);
  if (!p || !p.sub) return null;
  return { email: String(p.sub), admin: Array.isArray(p.clients) && p.clients.includes('*') };
}

/** Convenience: is the current request from a logged-in portal super-admin? */
export function isAdminRequest(request: Request): boolean {
  const secret = import.meta.env.SSO_SECRET ?? '';
  return isSsoAdmin(request.headers.get('cookie'), secret);
}
