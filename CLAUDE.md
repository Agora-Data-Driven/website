# CLAUDE.md — Agora Data Driven Website

Project conventions for this repo. Read alongside [docs/PLAN.md](docs/PLAN.md) (archived build plan: audit, sitemap, content model, phases).

## What this is

Marketing + blog site for **Agora Data Driven**, a data-driven marketing & analytics agency. Goal: build trust and drive visitors to the Upwork agency page (clients) and `apply.agoradatadriven.com` (hiring). Replaces a WordPress/Elementor site. Aesthetic: Upwork-inspired — clean, airy, green accent, conversion-focused.

## Stack

- **Astro** (SSR — `output: 'server'` via `@astrojs/node` standalone; pages opt into static with `export const prerender = true`) + **TypeScript** (strict) + **Tailwind CSS v4**.
- Default to **zero JS**. The interactive pieces (mobile nav, FAQ accordion, testimonial slider) are built with CSS / native HTML, not framework islands.
- Content via **Astro Content Collections** (Markdown/MDX + zod-validated frontmatter).
- Lint/format: **ESLint + Prettier**. Images: **`astro:assets`**.
- **SSR via `@astrojs/node`** (standalone), containerized and deployed to **GCP Cloud Run** via Cloud Build + Artifact Registry. gcloud project: `agora-data-driven`. Local Docker optional (Cloud Build builds remotely).
- **GCP structure & rules:** before running any `gcloud`/`bq` against the cloud estate, read **[docs/GCP.md](docs/GCP.md)** — it documents the two-org layout, what's active vs archived, billing, access limits, and the safety rules (always `--project`, archive-don't-delete, soft-delete recovery).

## Commands

```
npm install        # install dependencies (use `npm ci` for a clean, locked install)
npm run dev        # local dev server → http://localhost:4321
npm run build      # production build → dist/ (server + client)
npm run start      # run the built SSR server (node ./dist/server/entry.mjs)
npm run preview    # alias of start — runs the built server (build first)
npm run check      # astro type-check
npm run lint       # eslint . && prettier --check .
npm run format     # prettier --write .
npm run deploy     # build remotely + deploy to Cloud Run (manual; same as the CD workflow)
```

## In-page website editor (admin-only)

A logged-in portal super-admin can edit the live site in place. Auth is the shared `ag_sso` cookie
(super-admin = `clients` includes `*`), checked in `src/lib/sso.ts`. Enter edit mode with `?edit=1`
(remembered in an `ag_edit` cookie; `?edit=0` exits); `src/components/AdminEditor.astro` (in
`BaseLayout`) renders the toolbar + client logic. It only works on **server-rendered** pages (the home
page and blog posts are SSR; flip a page's `prerender` to `false` to make it editable).

- **Images:** hover any site image → **Replace** → `POST /api/edit/image` commits it to `public/<path>`
  (generalizes the older `/api/update-hero`). Build-hashed `/_astro/*` images aren't editable.
- **Blog text:** on a post, **Edit text** loads the raw markdown → `POST /api/edit/post` commits
  `src/content/posts/<slug>.md` (lossless; preserves frontmatter).
- **Publish:** every save commits to `main` via the GitHub Contents API (`src/lib/github.ts`, token
  `GITHUB_TOKEN`=`SEO_GITHUB_TOKEN`). **`.github/workflows/deploy.yml`** then auto-deploys to Cloud Run
  via **Workload Identity** (SA `github-deployer@`, no key) — so a save is live in a few minutes.
- **Google sign-in** for the editor is issued centrally by the portal; a login there mints the
  `ag_sso` cookie this site trusts. It's OPT-IN — until the portal's OAuth client exists, admins reach
  edit mode via a portal session.

## Folder structure

```
src/
  layouts/      BaseLayout, CaseStudyLayout, PostLayout
  components/   global + shared components (.astro); home sections in components/home
  content/      posts/  (the only Markdown collection; case studies & competitions are .astro pages)
  data/         site.ts · testimonials.ts · certifications.ts · faqs.ts · nav.ts · cta.ts · portfolio.ts
  pages/        route files (slugs preserved from live site)
  styles/       global.css — Tailwind v4 import + design tokens (@theme)
  assets/       optimized images processed by astro:assets
public/         static passthrough (robots.txt, favicon.svg, agora-logo.png, Credly/)
docs/           PLAN.md (archived build plan)
scripts/        setup + startday bootstrap scripts (PowerShell + bash)
```

## Conventions

- **TypeScript everywhere**, `strict: true`. No `any` without reason.
- **Design tokens only** — colors/spacing/type/radius come from the `@theme` block in `src/styles/global.css` (Tailwind v4; there is no `tailwind.config` file). No hard-coded hex or magic px in components.
- **Components are presentational + typed props.** No duplication; extract shared UI (`Button`, `Card`, `Container`, `SectionHeading`).
- **Accessibility (WCAG AA) is non-negotiable:** semantic HTML, one `<h1>`/page, alt text on every image, visible focus states, keyboard-operable nav/accordion/slider, AA contrast, `prefers-reduced-motion` respected.
- **SEO per page:** every route sets title, meta description, canonical, OG/Twitter via the `SEO` component. Posts emit `BlogPosting` JSON-LD; site emits `Organization`.
- **URLs/slugs are preserved** from the live site (see docs/PLAN.md §3/§6). Do not rename a slug without adding a 301.

## Canonical CTAs (single source of truth → `src/data/cta.ts`)

- Become a client → `https://www.upwork.com/agencies/1818954484693860352/`
- Join the Team → `https://apply.agoradatadriven.com`
- Custom quote → same Upwork agency URL (routes to Upwork; no contact form).

## Content rules

- **Use only real content** from the live site. **Never fabricate** names, logos, metrics, or testimonials. Missing info → list under "NEEDS INPUT" in docs/PLAN.md, don't invent.
- **Do not reproduce** template cruft: kitpapa.net/brighture links, fake pricing tiers, "Potato Logics," duplicated sections, dead `#` links.

## Adding a blog post

1. Create `src/content/posts/<slug>.md`.
2. Frontmatter: `title, slug, publishDate, excerpt, heroImage, heroAlt, category` (+ optional `updatedDate`, `draft`).
3. Hero image → `public/blog-images/<slug>.webp`, referenced as `heroImage: '/blog-images/<slug>.webp'`.
   **One file per post, never a shared path** — the in-page editor's "Replace" commits to the image's own
   source path, so two posts sharing a hero would overwrite each other. It must live in `public/` (not
   `src/assets/`) because build-hashed `/_astro/*` images aren't editable. `heroImage` is optional: omit
   it and the card/hero fall back to the branded `BlogThumbnail` SVG, then add a photo later via the editor.
   Provenance for the current photos (all CC0/public-domain) is in `docs/blog-image-sources.json`.
4. Write body in Markdown. `npm run dev` to preview; it auto-appears on `/blog/` and at its slug.

Cards, category hubs, and "keep reading" rows all render the same `PostCard.astro` from the `CardData`
shape in `src/lib/posts.ts` — add a surface there, not a new card.

## Deploy

Two paths, both landing on Cloud Run service `agora-data-driven` in **`asia-southeast1`**:

| Path | Trigger |
|---|---|
| **Automatic** (normal) | Push to `main` → `.github/workflows/deploy.yml` → Workload Identity (SA `github-deployer@`, no key) |
| **Manual** | `npm run deploy` — `gcloud run deploy … --source .` with `SSO_SECRET` + `GITHUB_TOKEN` secrets |

> ⚠️ `npm run deploy` passes `--update-secrets`. Both secrets must stay on the command, or the
> in-page editor and SSO break.

> ⚠️ **Region is `asia-southeast1`.** The Mastery Engine and seo-pipeline are `us-central1`.

The in-page editor writes commits to `main`, so **an admin clicking Save triggers a production
deploy** a few minutes later. Treat every editor-facing change as production-affecting.

## SSR vs prerender — this decision matters

`output: 'server'`. Pages opt into static with `export const prerender = true`.

**A page must be SSR (`prerender = false`) to be editable in-place**, because the editor reads
the `ag_sso` admin cookie at request time. Currently SSR: `index.astro`, `[slug].astro` (blog
posts). Everything else is prerendered.

Prerendered pages can still show admin UI, but it must be **injected client-side** after a
`fetch('/api/me')` — that's exactly why [`src/pages/api/me.ts`](src/pages/api/me.ts) exists as an
on-demand endpoint. See the Create-Blog panel in `blog/index.astro`.

## API routes

| Route | Purpose |
|---|---|
| `api/me.ts` | Current identity — callable from prerendered pages |
| `api/notes-quiz.ts` | **Skill Tests** — BYO-notes quiz generation (`src/lib/gemini.ts`) |
| `api/edit/image.ts` | Replace any site image → commits to `public/<path>` |
| `api/edit/post.ts` | GET/POST raw post markdown → commits `src/content/posts/<slug>.md` |
| `api/edit/create-blog.ts` | Create a new post from the blog index |
| `api/update-hero.ts` | Legacy, superseded by `edit/image.ts` |

Shared libs: `src/lib/` — `sso.ts` (auth), `github.ts` (Contents API commits), `posts.ts`
(`CardData`), `gemini.ts`, `env.ts`.

## Gotchas

### 🔴 Content is cut off on mobile instead of scrolling

`body { overflow-x: clip }` ([global.css:87](src/styles/global.css#L87)) is deliberate — it stops
sideways scrolling while keeping the sticky header working (`hidden` would break it). The side
effect: **anything wider than the viewport is silently cut off, not scrollable.**

The usual culprit is a bare `grid` with long unbroken content, which sizes to `max-content` and
blows out. Fix at the source:
- add `grid-cols-1` (or explicit columns) rather than relying on the default,
- add `min-w-0` on flex/grid children that contain long text,
- give wide elements (tables, code blocks) their own `overflow-x: auto` wrapper — the prose table
  rule at [global.css:271](src/styles/global.css#L271) is the pattern.

**Always check a new section at 360px wide.**

### 🔴 A POST to an API route 403s

Astro's `checkOrigin` CSRF guard **only inspects form-ish content types**
(`multipart/form-data`, `application/x-www-form-urlencoded`). Sending files as multipart trips it.

**Send JSON with base64 payloads instead** — that's why `api/notes-quiz.ts` takes JSON
([notes-quiz.ts:13](src/pages/api/notes-quiz.ts#L13)) and `skill-tests.astro` base64-encodes files
client-side. **Do not disable `checkOrigin` to work around this.**

### 🟡 An image can't be replaced by the editor

Build-hashed `/_astro/*` images aren't editable. Editable images must live in `public/`, and
**one file per post** — two posts sharing a hero path would overwrite each other.

### 🟡 A renamed slug breaks SEO

URLs are preserved from the old WordPress site. Renaming a slug requires a 301 in
`astro.config.mjs → redirects`. One key per source — Astro normalises trailing slashes, so listing
both `/x` and `/x/` collides.

### 🟡 Tailwind has no config file

Tailwind v4. All tokens live in the `@theme` block in `src/styles/global.css`. There is no
`tailwind.config.js` — don't create one.

## Verify your change

```
npm run check      # astro type-check (TS strict)
npm run lint       # eslint + prettier --check
npm run build      # the real gate — catches content-collection + SSR errors
npm run dev        # then check the page at 360px AND desktop
```

**Run `npm run build` before pushing.** A push to `main` auto-deploys, so a build error becomes a
failed production deploy.

## Never do this

| ❌ | Why |
|---|---|
| Create `tailwind.config.js` | v4 — tokens live in `@theme` in `global.css`. |
| Disable Astro's `checkOrigin` | Send JSON+base64 instead. |
| Rename a slug without a 301 | Breaks preserved SEO URLs. |
| Hard-code a hex or magic px | Design tokens only. |
| Share a `heroImage` path between posts | The editor's Replace would overwrite both. |
| Make a page prerendered when it needs the admin cookie | Editor silently stops working. |
| Fabricate testimonials, metrics, logos, names | Real content only — see Content rules. |
| Use `us-central1` | This service is **`asia-southeast1`**. |

## Commits

- Logical, incremental commits per phase/section (see docs/PLAN.md §9). Conventional style (`feat:`, `chore:`, `content:`, `fix:`).
- **Do not commit/push unless asked.** Ask before any destructive or irreversible action.
- Pushing to `main` deploys. There is no staging environment.

## Workflow guardrails

- Explore → plan → **get sign-off** → build incrementally. Run the dev server and verify each page renders + is responsive before moving on.
- Definition of done: all real pages rebuilt (responsive, AA, cohesive), template content gone, blog on Markdown, SEO essentials in place, redirect map provided, Lighthouse ≥90 across the board, clean README.

## Related repos

- [`../seo-pipeline`](../seo-pipeline) **auto-publishes blog posts into this repo** via the GitHub
  API (`src/content/posts/`), then triggers this site's deploy. If posts appear that nobody wrote
  by hand, that's the pipeline.
- The `/web-development` page was ported from the retired standalone `Web-port` React app; its
  assets live in `public/web-development/`.
