/**
 * Blog post text editor.
 *   GET  /api/edit/post?slug=<slug>  -> { ok, title, excerpt, body }  (raw markdown fields)
 *   POST /api/edit/post              -> commit title/excerpt/body back to src/content/posts/<slug>.md
 *
 * Admin-only. Editing the RAW markdown (not the rendered HTML) keeps saves lossless and preserves all
 * other frontmatter (publishDate, category, heroImage, …). The push to main auto-deploys, so the
 * edited copy is live in a few minutes.
 */
import type { APIRoute } from 'astro';
import { isAdminRequest } from '@lib/sso';
import { ghGetFile, ghPutText, githubToken } from '@lib/github';

function json(obj: object, status = 200): Response {
  return new Response(JSON.stringify(obj), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

const slugOk = (s: string): boolean => /^[a-z0-9-]+$/.test(s);
const postPath = (slug: string): string => `src/content/posts/${slug}.md`;

function splitFrontmatter(md: string): { fm: string; body: string } | null {
  const m = md.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  return m ? { fm: m[1], body: m[2] } : null;
}

function fmGet(fm: string, key: string): string {
  const m = fm.match(new RegExp(`^${key}:[ \\t]*(.*)$`, 'm'));
  if (!m) return '';
  let v = m[1].trim();
  if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'")))
    v = v.slice(1, -1);
  return v;
}

function yamlQuote(s: string): string {
  return '"' + s.replace(/\\/g, '\\\\').replace(/"/g, '\\"') + '"';
}

function fmSet(fm: string, key: string, value: string): string {
  const re = new RegExp(`^${key}:[ \\t]*.*$`, 'm');
  const line = `${key}: ${yamlQuote(value)}`;
  return re.test(fm) ? fm.replace(re, line) : `${fm}\n${line}`;
}

export const GET: APIRoute = async ({ request, url }) => {
  if (!isAdminRequest(request)) return json({ ok: false, error: 'Unauthorized' }, 403);
  const slug = (url.searchParams.get('slug') ?? '').trim();
  if (!slugOk(slug)) return json({ ok: false, error: 'bad slug' }, 400);
  const token = githubToken();
  if (!token) return json({ ok: false, error: 'GITHUB_TOKEN not configured' }, 500);
  try {
    const file = await ghGetFile(token, postPath(slug));
    if (!file) return json({ ok: false, error: 'post not found' }, 404);
    const parts = splitFrontmatter(file.text);
    if (!parts) return json({ ok: false, error: 'unparseable post' }, 500);
    return json({
      ok: true,
      title: fmGet(parts.fm, 'title'),
      excerpt: fmGet(parts.fm, 'excerpt'),
      body: parts.body.trim(),
    });
  } catch (err) {
    return json({ ok: false, error: err instanceof Error ? err.message : String(err) }, 500);
  }
};

export const POST: APIRoute = async ({ request }) => {
  if (!isAdminRequest(request)) return json({ ok: false, error: 'Unauthorized' }, 403);
  const token = githubToken();
  if (!token) return json({ ok: false, error: 'GITHUB_TOKEN not configured' }, 500);

  let payload: { slug?: string; title?: string; excerpt?: string; body?: string };
  try {
    payload = (await request.json()) as typeof payload;
  } catch {
    return json({ ok: false, error: 'invalid JSON' }, 400);
  }
  const slug = (payload.slug ?? '').trim();
  if (!slugOk(slug)) return json({ ok: false, error: 'bad slug' }, 400);

  try {
    const file = await ghGetFile(token, postPath(slug));
    if (!file) return json({ ok: false, error: 'post not found' }, 404);
    const parts = splitFrontmatter(file.text);
    if (!parts) return json({ ok: false, error: 'unparseable post' }, 500);

    let fm = parts.fm;
    if (typeof payload.title === 'string' && payload.title.trim())
      fm = fmSet(fm, 'title', payload.title.trim());
    if (typeof payload.excerpt === 'string') fm = fmSet(fm, 'excerpt', payload.excerpt.trim());
    const body = typeof payload.body === 'string' ? payload.body.trim() : parts.body.trim();

    const md = `---\n${fm}\n---\n\n${body}\n`;
    await ghPutText(token, postPath(slug), md, `edit: update post ${slug}`);
    return json({ ok: true });
  } catch (err) {
    return json({ ok: false, error: err instanceof Error ? err.message : String(err) }, 500);
  }
};
