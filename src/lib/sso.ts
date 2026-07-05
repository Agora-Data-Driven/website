/**
 * Shared portal SSO admin check.
 *
 * The portal (platform-dash) mints a `.agoradatadriven.com`-scoped `ag_sso` cookie on login: a
 * base64url JSON payload + "." + HMAC-SHA256(payload, SSO_SECRET). Because the website is served on
 * `agoradatadriven.com`, that cookie rides along, so a logged-in portal admin is trusted here too.
 * A super-admin is any payload whose `clients` list includes "*". Fail-closed on anything odd.
 *
 * This is the single source of truth for that check — PostLayout, CaseStudyLayout, the edit APIs and
 * the middleware all import it (previously each re-implemented it).
 */
import { createHmac } from 'crypto';

export function isSsoAdmin(cookieHeader: string | null, secret: string): boolean {
  if (!secret || !cookieHeader) return false;
  try {
    const cookies = Object.fromEntries(
      cookieHeader.split(';').map((c) => {
        const [k, ...v] = c.trim().split('=');
        return [k.trim(), v.join('=')];
      }),
    );
    const raw = cookies['ag_sso'];
    if (!raw) return false;
    const dot = raw.lastIndexOf('.');
    if (dot < 1) return false;
    const payloadB64 = raw.slice(0, dot);
    const sig = raw.slice(dot + 1);
    const expected = createHmac('sha256', secret).update(payloadB64, 'ascii').digest('base64url');
    if (sig !== expected) return false;
    const pad = '='.repeat((4 - (payloadB64.length % 4)) % 4);
    const payload = JSON.parse(Buffer.from(payloadB64 + pad, 'base64').toString('utf8')) as {
      exp?: number;
      clients?: unknown;
    };
    if (!payload.exp || Date.now() / 1000 > payload.exp) return false;
    return Array.isArray(payload.clients) && payload.clients.includes('*');
  } catch {
    return false;
  }
}

/** Convenience: is the current request from a logged-in portal super-admin? */
export function isAdminRequest(request: Request): boolean {
  const secret = import.meta.env.SSO_SECRET ?? '';
  return isSsoAdmin(request.headers.get('cookie'), secret);
}
