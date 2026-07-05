/**
 * GET /api/me — who is the current visitor (from the shared ag_sso cookie), for the site header.
 *
 * On-demand endpoint so it works on EVERY page, including prerendered ones (the header script fetches
 * it client-side and swaps the "Login" button for the user's name + an "Edit this page" button for
 * admins). Returns { authed, email, name, admin }. Never throws — anonymous → { authed:false }.
 */
import type { APIRoute } from 'astro';
export const prerender = false;
import { ssoIdentity } from '@lib/sso';
import { serverEnv } from '@lib/env';

/** Pretty display name from an email local part: "ian.fernandez" -> "Ian Fernandez". */
function displayName(email: string): string {
  const local = email.split('@')[0] || email;
  const words = local
    .split(/[._-]+/)
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1));
  return words.join(' ') || email;
}

export const GET: APIRoute = ({ request }) => {
  const id = ssoIdentity(request.headers.get('cookie'), serverEnv('SSO_SECRET'));
  const body = id
    ? { authed: true, email: id.email, name: displayName(id.email), admin: id.admin }
    : { authed: false };
  return new Response(JSON.stringify(body), {
    status: 200,
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
  });
};
