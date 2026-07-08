/**
 * GitHub Contents-API helpers — the website editor's "Save" writes changes straight to the repo
 * (`Agora-Data-Driven/website`, branch `main`). A push to `main` triggers the deploy workflow
 * (`.github/workflows/deploy.yml`, Workload Identity → Cloud Run), so a save publishes live in a few
 * minutes. This keeps every edit version-controlled (the model we chose over an ephemeral store).
 *
 * Auth: a fine-grained PAT in `GITHUB_TOKEN` (Secret Manager `SEO_GITHUB_TOKEN`). Absent → editing
 * is disabled and the APIs return a clear error, never a crash.
 */
import { serverEnv } from '@lib/env';

const GITHUB_REPO = 'Agora-Data-Driven/website';
const GITHUB_BRANCH = 'main';
const API = 'https://api.github.com';

export function githubToken(): string {
  return serverEnv('GITHUB_TOKEN');
}

function headers(token: string): Record<string, string> {
  return {
    Authorization: `Bearer ${token}`,
    Accept: 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
  };
}

/** Fetch a file's metadata (sha) + text content, or null if it doesn't exist. */
export async function ghGetFile(
  token: string,
  path: string,
): Promise<{ sha: string; text: string } | null> {
  const res = await fetch(`${API}/repos/${GITHUB_REPO}/contents/${path}?ref=${GITHUB_BRANCH}`, {
    headers: headers(token),
  });
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`GitHub GET ${path} -> ${res.status}`);
  const data = (await res.json()) as { sha: string; content?: string };
  const text = data.content
    ? Buffer.from(data.content.replace(/\n/g, ''), 'base64').toString('utf8')
    : '';
  return { sha: data.sha, text };
}

/** Fetch just the sha of a path (for overwriting a binary file), or undefined if absent. */
export async function ghGetSha(token: string, path: string): Promise<string | undefined> {
  const res = await fetch(`${API}/repos/${GITHUB_REPO}/contents/${path}?ref=${GITHUB_BRANCH}`, {
    headers: headers(token),
  });
  if (res.status === 404) return undefined;
  if (!res.ok) throw new Error(`GitHub GET ${path} -> ${res.status}`);
  const data = (await res.json()) as { sha: string };
  return data.sha;
}

/** Create or update a file (content is base64). Throws with the GitHub message on failure. */
export async function ghPutFile(
  token: string,
  path: string,
  contentB64: string,
  message: string,
  sha?: string,
): Promise<void> {
  const body: Record<string, string> = { message, content: contentB64, branch: GITHUB_BRANCH };
  if (sha) body.sha = sha;
  const res = await fetch(`${API}/repos/${GITHUB_REPO}/contents/${path}`, {
    method: 'PUT',
    headers: { ...headers(token), 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`GitHub PUT ${path} -> ${res.status}: ${text}`);
  }
}

/** Delete a file. `sha` must be the file's current blob sha (see `ghGetSha`). */
export async function ghDeleteFile(
  token: string,
  path: string,
  message: string,
  sha: string,
): Promise<void> {
  const res = await fetch(`${API}/repos/${GITHUB_REPO}/contents/${path}`, {
    method: 'DELETE',
    headers: { ...headers(token), 'Content-Type': 'application/json' },
    body: JSON.stringify({ message, sha, branch: GITHUB_BRANCH }),
  });
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`GitHub DELETE ${path} -> ${res.status}: ${text}`);
  }
}

/** Commit UTF-8 text to a path (create or overwrite). */
export async function ghPutText(
  token: string,
  path: string,
  text: string,
  message: string,
): Promise<void> {
  const existing = await ghGetFile(token, path);
  await ghPutFile(
    token,
    path,
    Buffer.from(text, 'utf8').toString('base64'),
    message,
    existing?.sha,
  );
}
