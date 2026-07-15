/**
 * POST /api/notes-quiz — build a quiz from the learner's OWN material.
 *
 * Powers the "Quiz from my notes" flow on /skill-tests/. Gated behind the shared
 * portal login (`ag_sso`): any signed-in user may generate, anonymous visitors
 * get 401 (the page then prompts them to sign in). JSON body:
 *   text?         string                              — pasted material
 *   files?        {name,mime,dataBase64}[]            — uploaded docs (PDF / image / text)
 *   count?        number                              — number of questions (1-30, default 8)
 *   difficulty?   string                              — 'auto' | 'core' | 'balanced' | 'challenge'
 *   extraContext? string                              — optional free-text steer for the AI
 *
 * JSON (not multipart) on purpose: Astro's checkOrigin CSRF guard only inspects
 * form content-types, and behind Cloud Run's TLS-terminating proxy it computes
 * the request URL as http:// while the browser sends an https:// Origin, so a
 * genuine same-origin form POST is wrongly rejected (403). application/json is
 * not a CSRF-"simple" content-type, so it is exempt from that check AND is itself
 * CSRF-safe (cross-origin JSON POSTs require a CORS preflight). Site-wide
 * checkOrigin stays ON.
 *
 * PDFs and images are transcribed by Gemini's multimodal reading; text/markdown
 * files are decoded directly. Returns { ok, questions[], count, sourceLabel,
 * notes[] } where each question is { id, question, options, correctIndex,
 * explanation } — the exact shape the Skill Tests overlay renders.
 */
import type { APIRoute } from 'astro';
export const prerender = false;

import { ssoIdentity } from '@lib/sso';
import { serverEnv } from '@lib/env';
import { generateQuizFromContent, extractDocumentText } from '@lib/gemini';

const MAX_FILES = 12;
const MAX_FILE_BYTES = 16 * 1024 * 1024; // 16 MB per file
const MAX_CHARS = 120_000; // total prompt material cap

// Files decoded as UTF-8 directly (no model call needed).
const TEXT_MIME = /^text\/|application\/(json|xml|x-yaml|yaml|markdown|rtf|csv|javascript|typescript)/i;
const TEXT_EXT = /\.(txt|text|md|markdown|mdown|csv|tsv|json|ya?ml|log|html?|xml|tex|rst|org|py|js|ts|java|c|cpp|cs|go|rb|rs|sql|sh|css)$/i;
// Files Gemini reads natively (transcribe to text): PDFs and images.
const DOC_MIME = /^(application\/pdf|image\/(png|jpe?g|webp|gif|heic|heif))/i;
const DOC_EXT = /\.(pdf|png|jpe?g|webp|gif|heic|heif)$/i;

// Light in-memory per-user rate limit (cost guard, not security; per instance).
const RL_WINDOW_MS = 60_000;
const RL_MAX = 12;
const hits = new Map<string, { count: number; resetAt: number }>();
function rateLimited(key: string): boolean {
  const now = Date.now();
  const rec = hits.get(key);
  if (!rec || now > rec.resetAt) {
    hits.set(key, { count: 1, resetAt: now + RL_WINDOW_MS });
    return false;
  }
  if (rec.count >= RL_MAX) return true;
  rec.count++;
  return false;
}

function json(obj: object, status = 200): Response {
  return new Response(JSON.stringify(obj), {
    status,
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
  });
}

export const POST: APIRoute = async ({ request }) => {
  // --- auth: any signed-in portal user ---
  const id = ssoIdentity(request.headers.get('cookie'), serverEnv('SSO_SECRET'));
  if (!id) return json({ ok: false, error: 'Please sign in to Mastery Mode to generate a quiz from your notes.' }, 401);

  if (rateLimited(id.email.toLowerCase())) {
    return json({ ok: false, error: 'You are generating quizzes very quickly. Give it a minute and try again.' }, 429);
  }

  interface UploadFile {
    name?: unknown;
    mime?: unknown;
    dataBase64?: unknown;
  }
  let body: { text?: unknown; files?: unknown; count?: unknown; difficulty?: unknown; extraContext?: unknown };
  try {
    body = await request.json();
  } catch {
    return json({ ok: false, error: 'Invalid JSON body' }, 400);
  }

  const count = Math.min(30, Math.max(1, parseInt(String(body.count ?? '8'), 10) || 8));
  const difficultyRaw = String(body.difficulty ?? 'auto');
  const difficulty = ['core', 'balanced', 'challenge'].includes(difficultyRaw) ? difficultyRaw : 'auto';
  const extraContext = String(body.extraContext ?? '').slice(0, 1200);

  const sources: { label: string; text: string }[] = [];
  const notes: string[] = [];
  const names: string[] = [];

  const pasted = String(body.text ?? '').trim();
  if (pasted) sources.push({ label: 'Pasted text', text: pasted });

  const files = (Array.isArray(body.files) ? (body.files as UploadFile[]) : []).slice(0, MAX_FILES);
  for (const file of files) {
    const name = String(file?.name ?? 'file').slice(0, 200);
    const mime = String(file?.mime ?? '').toLowerCase();
    const dataBase64 = String(file?.dataBase64 ?? '');
    if (!dataBase64) {
      notes.push(`${name}: empty file, skipped`);
      continue;
    }
    // Rough decoded-size guard from the base64 length (4 chars ≈ 3 bytes).
    if (dataBase64.length * 0.75 > MAX_FILE_BYTES) {
      notes.push(`${name}: too large (max 16 MB), skipped`);
      continue;
    }
    try {
      const buf = Buffer.from(dataBase64, 'base64');
      if (TEXT_MIME.test(mime) || TEXT_EXT.test(name)) {
        const text = buf.toString('utf8').trim();
        if (text) {
          sources.push({ label: name, text });
          names.push(name);
        } else notes.push(`${name}: no readable text, skipped`);
      } else if (DOC_MIME.test(mime) || DOC_EXT.test(name)) {
        const mimeType = mime && DOC_MIME.test(mime) ? mime : /\.pdf$/i.test(name) ? 'application/pdf' : 'image/png';
        const text = await extractDocumentText({ mimeType, dataBase64, name });
        if (text) {
          sources.push({ label: name, text });
          names.push(name);
        } else notes.push(`${name}: nothing readable was found, skipped`);
      } else {
        notes.push(`${name}: unsupported file type (use PDF, an image, or a text/markdown file), skipped`);
      }
    } catch (e) {
      notes.push(`${name}: could not read it (${e instanceof Error ? e.message : String(e)})`);
    }
  }

  if (!sources.length) {
    return json(
      { ok: false, error: 'No usable material. Paste some text or upload a PDF, image, or text/markdown file.', notes },
      400,
    );
  }

  let combined = sources.map((s) => `### SOURCE: ${s.label}\n${s.text}`).join('\n\n');
  if (combined.length > MAX_CHARS) combined = combined.slice(0, MAX_CHARS);

  const sourceLabel =
    names.length === 1 ? names[0].replace(/\.[a-z0-9]+$/i, '') : names.length ? 'Your uploads' : 'Your notes';

  try {
    const generated = await generateQuizFromContent({ content: combined, extraContext, count, difficulty });
    const questions = generated.map((q, i) => ({
      id: `note-${i + 1}`,
      question: q.question,
      options: q.options,
      correctIndex: q.correctIndex,
      explanation: q.explanation,
    }));
    return json({ ok: true, questions, count: questions.length, sourceLabel, notes });
  } catch (e) {
    return json({ ok: false, error: e instanceof Error ? e.message : String(e) }, 500);
  }
};
