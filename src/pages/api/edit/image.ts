/**
 * POST /api/edit/image  — replace ANY image on the site (generalizes /api/update-hero).
 *
 * Admin-only (ag_sso super-admin). Takes the on-page image URL + a new file, and commits the file to
 * its source path in the repo (`public/<path>`). The push to main triggers the deploy workflow, so
 * the new image is live in a few minutes; the editor swaps it in immediately for the admin's preview.
 *
 * multipart/form-data: { path: string (the <img> src, e.g. "/sabbath.webp"), image: File }
 * Returns JSON: { ok, path?, committed?, error? }
 */
import type { APIRoute } from 'astro';
import { isAdminRequest } from '@lib/sso';
import { ghGetSha, ghPutFile, githubToken } from '@lib/github';

const IMAGE_EXT = new Set(['png', 'jpg', 'jpeg', 'webp', 'gif', 'avif', 'svg']);
const MAX_BYTES = 5 * 1024 * 1024;

function json(obj: object, status = 200): Response {
  return new Response(JSON.stringify(obj), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

/** Map an on-page image URL to its repo source path, or null if it isn't an editable public asset. */
function repoPathFor(src: string): string | null {
  if (!src.startsWith('/')) return null; // only same-origin absolute paths
  const clean = src.split('?')[0].split('#')[0];
  if (clean.includes('..')) return null;
  if (clean.startsWith('/_astro/')) return null; // build-hashed (astro:assets) — no stable source
  const ext = clean.split('.').pop()?.toLowerCase() ?? '';
  if (!IMAGE_EXT.has(ext)) return null;
  return 'public' + clean; // /sabbath.webp -> public/sabbath.webp
}

export const POST: APIRoute = async ({ request }) => {
  if (!isAdminRequest(request)) return json({ ok: false, error: 'Unauthorized' }, 403);
  const token = githubToken();
  if (!token) return json({ ok: false, error: 'GITHUB_TOKEN not configured' }, 500);

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return json({ ok: false, error: 'Invalid form data' }, 400);
  }
  const src = String(form.get('path') ?? '').trim();
  const file = form.get('image');
  const repoPath = repoPathFor(src);
  if (!repoPath) {
    return json(
      { ok: false, error: 'This image can’t be edited (only site images can be replaced).' },
      400,
    );
  }
  if (!(file instanceof File) || file.size === 0)
    return json({ ok: false, error: 'image is required' }, 400);
  if (file.size > MAX_BYTES) return json({ ok: false, error: 'Image must be under 5 MB' }, 400);

  try {
    const bytes = Buffer.from(await file.arrayBuffer());
    const sha = await ghGetSha(token, repoPath);
    await ghPutFile(
      token,
      repoPath,
      bytes.toString('base64'),
      `edit: replace image ${repoPath}`,
      sha,
    );
    return json({ ok: true, path: src, committed: repoPath });
  } catch (err) {
    return json({ ok: false, error: err instanceof Error ? err.message : String(err) }, 500);
  }
};
