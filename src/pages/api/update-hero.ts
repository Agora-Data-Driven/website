/**
 * POST /api/update-hero
 * Admin-only endpoint to replace the hero image of a blog post.
 *
 * Commits the new image to `public/blog-images/<slug>.<ext>` via the GitHub
 * Contents API, then patches the post's `heroImage` frontmatter to point at it.
 * The push to `main` triggers the deploy workflow, so the change is live in a
 * few minutes.
 *
 * The uploaded file keeps its REAL extension. (This route used to save every
 * upload as `.png` regardless of format, so a JPEG or WebP was committed under
 * a lying filename — browsers sniff it, but Astro/CDN content-type handling and
 * the editor's "Replace" path matching both key off the extension.) When the
 * format changes we also delete the old file so a post never has two heroes.
 *
 * Expects multipart/form-data: { slug: string, image: File }
 * Returns JSON: { ok: boolean, path?: string, error?: string }
 */

import type { APIRoute } from 'astro';
import { isAdminRequest } from '@lib/sso';
import { ghGetFile, ghGetSha, ghPutFile, ghDeleteFile, githubToken } from '@lib/github';

const MAX_BYTES = 5 * 1024 * 1024;

/** mime → the extension we commit under. Anything else is rejected. */
const EXT_BY_MIME: Record<string, string> = {
  'image/png': 'png',
  'image/jpeg': 'jpg',
  'image/webp': 'webp',
  'image/avif': 'avif',
};
const ALL_EXTS = ['png', 'jpg', 'jpeg', 'webp', 'avif'];

function json(obj: object, status = 200): Response {
  return new Response(JSON.stringify(obj), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

/** Extension from the mime type, falling back to the filename's own suffix. */
function extensionFor(file: File): string | null {
  const byMime = EXT_BY_MIME[file.type?.toLowerCase() ?? ''];
  if (byMime) return byMime;
  const suffix = file.name.split('.').pop()?.toLowerCase() ?? '';
  if (suffix === 'jpeg') return 'jpg';
  return ALL_EXTS.includes(suffix) ? suffix : null;
}

export const POST: APIRoute = async ({ request }) => {
  if (!isAdminRequest(request)) return json({ ok: false, error: 'Unauthorized' }, 403);

  const token = githubToken();
  if (!token) return json({ ok: false, error: 'GITHUB_TOKEN not configured' }, 500);

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return json({ ok: false, error: 'Invalid form data' }, 400);
  }

  const slug = String(formData.get('slug') ?? '')
    .trim()
    .replace(/[^a-z0-9-]/g, '');
  const imageFile = formData.get('image');

  if (!slug) return json({ ok: false, error: 'slug is required' }, 400);
  if (!(imageFile instanceof File) || imageFile.size === 0)
    return json({ ok: false, error: 'image is required' }, 400);
  if (imageFile.size > MAX_BYTES)
    return json({ ok: false, error: 'Image must be under 5 MB' }, 400);

  const ext = extensionFor(imageFile);
  if (!ext)
    return json({ ok: false, error: 'Please upload a PNG, JPG, WebP, or AVIF image.' }, 400);

  const imgPath = `public/blog-images/${slug}.${ext}`;
  const publicPath = `/blog-images/${slug}.${ext}`;

  try {
    // 1. Commit the image under its true extension.
    const bytes = Buffer.from(await imageFile.arrayBuffer());
    const existingSha = await ghGetSha(token, imgPath);
    await ghPutFile(
      token,
      imgPath,
      bytes.toString('base64'),
      `assets: hero image for ${slug}`,
      existingSha,
    );

    // 2. Point the post's frontmatter at it.
    const mdPath = `src/content/posts/${slug}.md`;
    const md = await ghGetFile(token, mdPath);
    if (!md) return json({ ok: false, error: `No post found at ${mdPath}` }, 404);

    const patched = /^heroImage:/m.test(md.text)
      ? md.text.replace(/^heroImage:.*$/m, `heroImage: '${publicPath}'`)
      : md.text.replace(/^(publishDate:.*)$/m, `$1\nheroImage: '${publicPath}'`);

    if (patched !== md.text) {
      await ghPutFile(
        token,
        mdPath,
        Buffer.from(patched, 'utf8').toString('base64'),
        `content: update hero image for ${slug}`,
        md.sha,
      );
    }

    // 3. Clean up a stale hero left behind by a format change (e.g. .png -> .webp).
    //    Best-effort: a failure here must not fail an otherwise-successful save.
    for (const stale of ALL_EXTS.filter((e) => e !== ext)) {
      const stalePath = `public/blog-images/${slug}.${stale}`;
      try {
        const sha = await ghGetSha(token, stalePath);
        if (sha) await ghDeleteFile(token, stalePath, `assets: drop stale hero ${stalePath}`, sha);
      } catch {
        /* ignore */
      }
    }

    return json({ ok: true, path: publicPath });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return json({ ok: false, error: msg }, 500);
  }
};
