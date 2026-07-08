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

## Commits

- Logical, incremental commits per phase/section (see docs/PLAN.md §9). Conventional style (`feat:`, `chore:`, `content:`, `fix:`).
- **Do not commit/push unless asked.** Ask before any destructive or irreversible action.

## Workflow guardrails

- Explore → plan → **get sign-off** → build incrementally. Run the dev server and verify each page renders + is responsive before moving on.
- Definition of done: all real pages rebuilt (responsive, AA, cohesive), template content gone, blog on Markdown, SEO essentials in place, redirect map provided, Lighthouse ≥90 across the board, clean README.
