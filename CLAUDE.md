# CLAUDE.md — Agora Data Driven Website

Project conventions for this repo. Read alongside [PLAN.md](PLAN.md) (audit, sitemap, content model, phases).

## What this is
Marketing + blog site for **Agora Data Driven**, a data-driven marketing & analytics agency. Goal: build trust and drive visitors to the Upwork agency page (clients) and `apply.agoradatadriven.com` (hiring). Replaces a WordPress/Elementor site. Aesthetic: Upwork-inspired — clean, airy, green accent, conversion-focused.

## Stack
- **Astro** (static output) + **TypeScript** (strict) + **Tailwind CSS**.
- Interactive **islands** only where needed (mobile nav, FAQ accordion, testimonial slider). Default to zero JS.
- Content via **Astro Content Collections** (Markdown/MDX + zod-validated frontmatter).
- Lint/format: **ESLint + Prettier**. Images: **`astro:assets`**.
- **SSR via `@astrojs/node`** (standalone), containerized and deployed to **GCP Cloud Run** via Cloud Build + Artifact Registry. gcloud project: `agora-data-driven`. Local Docker optional (Cloud Build builds remotely).

## Commands
> Filled in at scaffold. Expected:
```
npm install
npm run dev        # local dev server
npm run build      # production build → dist/
npm run preview    # preview the build
npm run lint       # eslint
npm run format     # prettier --write
```

## Folder structure (target)
```
src/
  layouts/      BaseLayout, CaseStudyLayout, PostLayout
  components/   global + section components (.astro), islands in /islands
  content/      posts/ · caseStudies/ · competitions/   (Markdown collections)
  data/         testimonials.ts · certifications.ts · faqs.ts · nav.ts · cta.ts
  pages/        route files (slugs preserved from live site)
  styles/       global.css (tokens/base)
  assets/       optimized images processed by astro:assets
public/         static passthrough (robots.txt, favicons, _redirects)
```

## Conventions
- **TypeScript everywhere**, `strict: true`. No `any` without reason.
- **Design tokens only** — colors/spacing/type/radius come from `tailwind.config` + CSS vars (see PLAN §8). No hard-coded hex or magic px in components.
- **Components are presentational + typed props.** No duplication; extract shared UI (`Button`, `Card`, `Container`, `SectionHeading`).
- **Accessibility (WCAG AA) is non-negotiable:** semantic HTML, one `<h1>`/page, alt text on every image, visible focus states, keyboard-operable nav/accordion/slider, AA contrast, `prefers-reduced-motion` respected.
- **SEO per page:** every route sets title, meta description, canonical, OG/Twitter via the `SEO` component. Posts emit `BlogPosting` JSON-LD; site emits `Organization`.
- **URLs/slugs are preserved** from the live site (see PLAN §3/§6). Do not rename a slug without adding a 301.

## Canonical CTAs (single source of truth → `src/data/cta.ts`)
- Become a client → `https://www.upwork.com/agencies/1818954484693860352/`
- Join the Team → `https://apply.agoradatadriven.com`
- Custom quote → same Upwork agency URL (routes to Upwork; no contact form).

## Content rules
- **Use only real content** from the live site. **Never fabricate** names, logos, metrics, or testimonials. Missing info → list under "NEEDS INPUT" in PLAN.md, don't invent.
- **Do not reproduce** template cruft: kitpapa.net/brighture links, fake pricing tiers, "Potato Logics," duplicated sections, dead `#` links.

## Adding a blog post
1. Create `src/content/posts/<slug>.md`.
2. Frontmatter: `title, slug, publishDate, excerpt, heroImage, heroAlt, category` (+ optional `updatedDate`, `draft`).
3. Put hero image in `src/assets/`; reference it so `astro:assets` optimizes it.
4. Write body in Markdown. `npm run dev` to preview; it auto-appears on `/blog/` and at its slug.

## Commits
- Logical, incremental commits per phase/section (see PLAN §9). Conventional style (`feat:`, `chore:`, `content:`, `fix:`).
- **Do not commit/push unless asked.** Ask before any destructive or irreversible action.

## Workflow guardrails
- Explore → plan → **get sign-off** → build incrementally. Run the dev server and verify each page renders + is responsive before moving on.
- Definition of done: all real pages rebuilt (responsive, AA, cohesive), template content gone, blog on Markdown, SEO essentials in place, redirect map provided, Lighthouse ≥90 across the board, clean README.
