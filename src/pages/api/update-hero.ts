/**
 * POST /api/update-hero
 * Admin-only endpoint to replace the hero image of a blog post.
 * Validates the ag_sso cookie (superadmin only), commits the new image to
 * public/blog-images/{slug}.png via the GitHub Contents API, then patches the
 * frontmatter heroImage field in the markdown file.
 *
 * Expects multipart/form-data: { slug: string, image: File }
 * Returns JSON: { ok: boolean, error?: string }
 */

import type { APIRoute } from 'astro';
import { createHmac } from 'crypto';
import { serverEnv } from '@lib/env';

const SSO_SECRET = serverEnv('SSO_SECRET');
const GITHUB_TOKEN = serverEnv('GITHUB_TOKEN');
const GITHUB_REPO = 'Agora-Data-Driven/website';
const GITHUB_BRANCH = 'main';

function isAdminSso(cookieHeader: string | null): boolean {
  if (!SSO_SECRET || !cookieHeader) return false;
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
    const expected = createHmac('sha256', SSO_SECRET)
      .update(payloadB64, 'ascii')
      .digest('base64url');
    if (sig !== expected) return false;
    const pad = '='.repeat((4 - (payloadB64.length % 4)) % 4);
    const payload = JSON.parse(Buffer.from(payloadB64 + pad, 'base64').toString('utf8'));
    if (!payload.exp || Date.now() / 1000 > payload.exp) return false;
    return Array.isArray(payload.clients) && payload.clients.includes('*');
  } catch {
    return false;
  }
}

async function ghGet(path: string): Promise<{ sha?: string } | null> {
  const res = await fetch(
    `https://api.github.com/repos/${GITHUB_REPO}/contents/${path}?ref=${GITHUB_BRANCH}`,
    {
      headers: {
        Authorization: `Bearer ${GITHUB_TOKEN}`,
        Accept: 'application/vnd.github+json',
        'X-GitHub-Api-Version': '2022-11-28',
      },
    },
  );
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`GitHub GET ${path} → ${res.status}`);
  return res.json();
}

async function ghPut(
  path: string,
  contentB64: string,
  message: string,
  sha?: string,
): Promise<void> {
  const body: Record<string, string> = { message, content: contentB64, branch: GITHUB_BRANCH };
  if (sha) body.sha = sha;
  const res = await fetch(`https://api.github.com/repos/${GITHUB_REPO}/contents/${path}`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${GITHUB_TOKEN}`,
      Accept: 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`GitHub PUT ${path} → ${res.status}: ${text}`);
  }
}

export const POST: APIRoute = async ({ request }) => {
  const json = (obj: object, status = 200) =>
    new Response(JSON.stringify(obj), {
      status,
      headers: { 'Content-Type': 'application/json' },
    });

  if (!isAdminSso(request.headers.get('cookie'))) {
    return json({ ok: false, error: 'Unauthorized' }, 403);
  }
  if (!GITHUB_TOKEN) {
    return json({ ok: false, error: 'GITHUB_TOKEN not configured' }, 500);
  }

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return json({ ok: false, error: 'Invalid form data' }, 400);
  }

  const slug = String(formData.get('slug') ?? '')
    .trim()
    .replace(/[^a-z0-9-]/g, '');
  const imageFile = formData.get('image') as File | null;

  if (!slug) return json({ ok: false, error: 'slug is required' }, 400);
  if (!imageFile || imageFile.size === 0)
    return json({ ok: false, error: 'image is required' }, 400);
  if (imageFile.size > 5 * 1024 * 1024)
    return json({ ok: false, error: 'Image must be under 5 MB' }, 400);

  try {
    // 1. Commit the image to public/blog-images/{slug}.png
    const imgPath = `public/blog-images/${slug}.png`;
    const imgBytes = Buffer.from(await imageFile.arrayBuffer());
    const imgB64 = imgBytes.toString('base64');
    const existingImg = await ghGet(imgPath);
    await ghPut(imgPath, imgB64, `assets: hero image for ${slug}`, existingImg?.sha);

    // 2. Patch the markdown frontmatter heroImage field
    const mdPath = `src/content/posts/${slug}.md`;
    const mdMeta = await ghGet(mdPath);
    if (mdMeta && 'content' in mdMeta) {
      const rawB64 = (mdMeta as { content: string }).content.replace(/\n/g, '');
      const mdText = Buffer.from(rawB64, 'base64').toString('utf8');
      let patched: string;
      if (/^heroImage:/m.test(mdText)) {
        patched = mdText.replace(
          /^heroImage:.*$/m,
          `heroImage: "/${imgPath.replace('public/', '')}"`,
        );
      } else {
        // Insert after publishDate line (or after first --- block opening)
        patched = mdText.replace(
          /^(publishDate:.*$)/m,
          `$1\nheroImage: "/blog-images/${slug}.png"\nheroAlt: "${slug.replace(/-/g, ' ')}"`,
        );
      }
      if (patched !== mdText) {
        const patchedB64 = Buffer.from(patched, 'utf8').toString('base64');
        await ghPut(mdPath, patchedB64, `content: update hero image for ${slug}`, mdMeta.sha);
      }
    }

    return json({ ok: true, path: `/blog-images/${slug}.png` });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return json({ ok: false, error: msg }, 500);
  }
};
