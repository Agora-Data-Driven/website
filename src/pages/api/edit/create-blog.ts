/**
 * POST /api/edit/create-blog — write a new blog post with the SEO pipeline.
 *   body: { topic?: string }  ->  { ok, topic, execution }
 *
 * Admin-only. Fires the `seo-pipeline-daily` Cloud Run Job, which runs the full 0-9 chain (brief ->
 * draft -> adversarial proofread -> grounded fact-check -> interlink -> metadata -> publish). If it
 * clears every quality gate the pipeline commits the post to src/content/posts/ and this site
 * auto-deploys, so it's live in a few minutes. If a gate rejects it, nothing is published — by design.
 *
 * The `topic` field is OPTIONAL:
 *   - given  -> we first run it through Gemini (topicFromDescription) to turn a rough idea into a
 *               concrete, searchable keyword, then run the job with `--topic "<keyword>"`.
 *   - blank  -> we run the job with NO overrides, so the pipeline picks from its own curated,
 *               keyword-researched topic queue (respecting the daily volume cap).
 *
 * The job is async: this returns as soon as the execution is created, not when the post exists.
 * Auth to the Cloud Run API uses the site's own service account token from the metadata server — no
 * key material. That SA needs run.jobs.run + run.jobs.runWithOverrides on the job.
 */
import type { APIRoute } from 'astro';
export const prerender = false;
import { isAdminRequest } from '@lib/sso';
import { topicFromDescription } from '@lib/gemini';

const PROJECT = 'agora-data-driven';
const REGION = 'us-central1';
const JOB = 'seo-pipeline-daily';
const MAX_TOPIC_LEN = 200;

const METADATA_TOKEN_URL =
  'http://metadata.google.internal/computeMetadata/v1/instance/service-accounts/default/token';

function json(obj: object, status = 200): Response {
  return new Response(JSON.stringify(obj), {
    status,
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
  });
}

/** Access token for the Cloud Run job-runner, from the Cloud Run metadata server. */
async function accessToken(): Promise<string | null> {
  try {
    const res = await fetch(METADATA_TOKEN_URL, { headers: { 'Metadata-Flavor': 'Google' } });
    if (!res.ok) return null;
    const data = (await res.json()) as { access_token?: string };
    return data.access_token ?? null;
  } catch {
    return null;
  }
}

export const POST: APIRoute = async ({ request }) => {
  if (!isAdminRequest(request)) return json({ ok: false, error: 'Unauthorized' }, 403);

  let payload: { topic?: string };
  try {
    payload = (await request.json()) as typeof payload;
  } catch {
    return json({ ok: false, error: 'invalid JSON' }, 400);
  }

  const rawTopic = (payload.topic ?? '').trim().replace(/\s+/g, ' ').slice(0, MAX_TOPIC_LEN);

  // Optional topic: if the admin typed an idea, normalise it to a searchable keyword via Gemini;
  // if they left it blank, run with no override so the pipeline works its own curated queue.
  let topic = '';
  if (rawTopic) {
    try {
      topic = (await topicFromDescription(rawTopic)).trim();
    } catch {
      topic = rawTopic; // never block on the transform — fall back to the raw idea
    }
    if (!topic) topic = rawTopic;
  }

  const token = await accessToken();
  if (!token) return json({ ok: false, error: 'Could not authenticate to Cloud Run' }, 500);

  // Args are appended to the image ENTRYPOINT (`python -m seo_pipeline.main`): with a topic this runs
  // the single-article path; with none the pipeline runs its scheduled-style queue sweep.
  const body = topic ? { overrides: { containerOverrides: [{ args: ['--topic', topic] }] } } : {};

  try {
    const res = await fetch(
      `https://run.googleapis.com/v2/projects/${PROJECT}/locations/${REGION}/jobs/${JOB}:run`,
      {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      },
    );
    const data = (await res.json()) as {
      metadata?: { name?: string };
      name?: string;
      error?: { message?: string };
    };
    if (!res.ok) {
      return json(
        { ok: false, error: data.error?.message ?? `Cloud Run returned ${res.status}` },
        502,
      );
    }
    // v2 :run returns a long-running operation; the execution id is on its metadata.
    const execution = data.metadata?.name?.split('/').pop() ?? data.name?.split('/').pop() ?? '';
    return json({ ok: true, topic, execution });
  } catch (err) {
    return json({ ok: false, error: err instanceof Error ? err.message : String(err) }, 500);
  }
};
