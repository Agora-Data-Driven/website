/**
 * Runtime server env access.
 *
 * IMPORTANT: Astro/Vite inlines `import.meta.env.X` at BUILD time. Secrets mounted at RUNTIME
 * (Cloud Run `--set-secrets`, e.g. SSO_SECRET / GITHUB_TOKEN) are NOT present during the build, so
 * reading them via `import.meta.env` yields an empty string in production — which silently breaks
 * every SSO/admin check. On the Node SSR server we must read `process.env` at request time instead.
 * Falls back to `import.meta.env` so a value set in a local `.env` still works during `astro dev`.
 */
export function serverEnv(name: string): string {
  const fromProcess = typeof process !== 'undefined' && process.env ? process.env[name] : undefined;
  if (fromProcess) return fromProcess;
  const meta = import.meta.env as unknown as Record<string, string | undefined>;
  return meta[name] ?? '';
}
