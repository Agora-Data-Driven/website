/**
 * POST /api/edit/create-blog — write a new blog post with the SEO pipeline.
 *   body: { topic: string }  ->  { ok, execution }
 *
 * Admin-only. Fires the `seo-pipeline-daily` Cloud Run Job with `--topic "<topic>"`, which runs the
 * full 0-9 chain for that one topic (brief -> draft -> adversarial proofread -> grounded fact-check ->
 * interlink -> metadata -> publish). If it clears every quality gate the pipeline commits the post to
 * src/content/posts/ and this site auto-deploys, so it's live in a few minutes. If a gate rejects it,
 * nothing is published — by design (we never force a weak post live).
 *
 * The job is async: this returns as soon as the execution is created, not when the post exists.
 * Auth to the Cloud Run API uses the site's own service account token from the metadata server — no
 * key material, nothing to configure. That SA needs roles/run.invoker on the job.
 */
import type { APIRoute } from 'astro';
export const prerender = false;
import { isAdminRequest } from '@lib/sso';

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

  const topic = (payload.topic ?? '').trim().replace(/\s+/g, ' ');
  if (!topic)
    return json({ ok: false, error: 'Tell the writer what the post should be about' }, 400);
  if (topic.length > MAX_TOPIC_LEN)
    return json({ ok: false, error: `Keep it under ${MAX_TOPIC_LEN} characters` }, 400);

  const token = await accessToken();
  if (!token) return json({ ok: false, error: 'Could not authenticate to Cloud Run' }, 500);

  try {
    const res = await fetch(
      `https://run.googleapis.com/v2/projects/${PROJECT}/locations/${REGION}/jobs/${JOB}:run`,
      {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        // Args are appended to the image ENTRYPOINT (`python -m seo_pipeline.main`), so this runs the
        // single-topic path rather than the scheduled queue sweep.
        body: JSON.stringify({
          overrides: { containerOverrides: [{ args: ['--topic', topic] }] },
        }),
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
    return json({ ok: true, execution });
  } catch (err) {
    return json({ ok: false, error: err instanceof Error ? err.message : String(err) }, 500);
  }
};
