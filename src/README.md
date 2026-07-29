# src/ — the whole site

Everything that renders agoradatadriven.com: Astro routes, components, layouts, the Markdown blog
collection, typed site data, and the Tailwind v4 design tokens. `output: 'server'` (SSR) — pages
opt into static with `export const prerender = true`; only the home page and blog posts stay SSR
so the in-page editor works. Read [../AGENTS.md](../AGENTS.md) before editing — its gotchas are real.

## File map

| Path                                   | What it is                                                                                                                                                                                                                                                                                                                                                                                    |
| -------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [pages/](pages/)                       | Route files. **Slugs are preserved 1:1 from the WordPress-era site** — renaming one requires a 301 in [../astro.config.mjs](../astro.config.mjs). Blog posts render at the site root via [pages/[slug].astro](pages/); server endpoints in [pages/api/](pages/api/) (see the API table in ../AGENTS.md).                                                                                      |
| [components/](components/)             | Shared presentational components with typed props — `Button`, `Container`, `SEO`, `PostCard`, `AdminEditor` (the in-page editor), `BlogThumbnail` (hero fallback). Homepage sections live in [components/home/](components/home/).                                                                                                                                                            |
| [layouts/](layouts/)                   | Page shells: [BaseLayout.astro](layouts/BaseLayout.astro) (header/footer/SEO/editor toolbar), [PostLayout.astro](layouts/PostLayout.astro), [CaseStudyLayout.astro](layouts/CaseStudyLayout.astro).                                                                                                                                                                                           |
| [lib/](lib/)                           | Shared server code: [sso.ts](lib/sso.ts) (`ag_sso` auth), [github.ts](lib/github.ts) (Contents-API commits for the editor), [posts.ts](lib/posts.ts) (the `CardData` shape every card surface renders), [gemini.ts](lib/gemini.ts) (Skill Tests), [env.ts](lib/env.ts).                                                                                                                       |
| [content/posts/](content/posts/)       | The only Markdown collection — one `.md` per blog post, **file name = URL slug**. Zod schema in [content.config.ts](content.config.ts): `category` is controlled to the silo taxonomy in [data/categories.ts](data/categories.ts) with a `.catch` fallback (pipeline posts with off-vocabulary categories build anyway — re-tag when noticed); `type` is `post` / `case-study` / `data-file`. |
| [data/](data/)                         | Typed structured data: [site.ts](data/site.ts) · [nav.ts](data/nav.ts) · [cta.ts](data/cta.ts) (canonical CTA URLs — single source of truth) · [categories.ts](data/categories.ts) · testimonials / certifications / faqs / portfolio / blogData / quizData.                                                                                                                                  |
| [styles/global.css](styles/global.css) | Tailwind v4 import + **ALL design tokens** in the `@theme` block — there is no `tailwind.config` file, don't create one. ⚠️ **LOAD-BEARING:** `body { overflow-x: clip }` at [global.css:87](styles/global.css#L87) — see DO NOT TOUCH below.                                                                                                                                                 |
| [assets/](assets/)                     | Images optimized by `astro:assets` — build-hashed to `/_astro/*`, so the in-page editor **cannot** replace them. Editor-editable images belong in `../public/`.                                                                                                                                                                                                                               |

## Cookbook

Every recipe ends the same way: `npm run check && npm run lint && npm run build`, then
`npm run dev` and **check the page at 360px wide** (the clip rule silently cuts off overflow —
see DO NOT TOUCH). Deploying = landing the change on `main`: GitHub Actions deploys to Cloud Run
asynchronously (a few minutes) — verify with `gh run list --limit 3`, not by refreshing the site.

### Add a blog post

Two files, nothing else: `content/posts/<slug>.md` (frontmatter per [content.config.ts](content.config.ts))
and optionally `../public/blog-images/<slug>.webp`, referenced as `heroImage: '/blog-images/<slug>.webp'`.
One image file per post, never shared; `public/`, never `assets/`. Omit `heroImage` and the card
falls back to the branded `BlogThumbnail` SVG. Record photo provenance in
[../docs/blog-image-sources.json](../docs/blog-image-sources.json). The post auto-appears on
`/blog/`, its category hub, and at `/<slug>/` — no other file needs touching (`PostCard` renders
everywhere from `lib/posts.ts`'s `CardData`; add a surface there, not a new card).

### Add a page

`pages/<slug>.astro` wrapped in `BaseLayout` with the `SEO` component props set; prerender it
(`export const prerender = true`) unless it must read the admin cookie at request time. Add to
[data/nav.ts](data/nav.ts) if it belongs in the nav. Tokens only — no hard-coded hex/px.

### Add a redirect for a renamed slug

[../astro.config.mjs](../astro.config.mjs) → `redirects` (301 by default). **One key per source** —
Astro normalises trailing slashes, so listing both `/x` and `/x/` collides. Verify by hitting the
old URL in `npm run dev`.

### Change a design token

The `@theme` block in [styles/global.css](styles/global.css) — the ONLY place colors/spacing/type/
radius live. Then eyeball at 360px **and** desktop; a token change touches every page.

### Edit homepage sections

Sections are [components/home/](components/home/)`*.astro` (Hero, ValueProps, StatBand,
Testimonials, PortfolioTeaser, LatestPosts, Certifications, Faq, QuoteCta), composed in
[pages/index.astro](pages/index.astro). The home page is SSR on purpose (in-place editable) —
never flip it to `prerender = true`. New sections are the classic 360px-overflow culprit: bare
`grid` + long content blows out and gets clipped, not scrolled.

## DO NOT TOUCH

- **Preserved slugs without a 301.** Every route slug came over from the old WordPress site for
  SEO; renaming one without a redirect breaks live search rankings.
- **[../docs/blog-image-sources.json](../docs/blog-image-sources.json)** — the provenance record
  proving every post photo is CC0/public-domain. Keep it in step with `public/blog-images/`, never
  delete it.
- **The clip rule** — `body { overflow-x: clip }` at [global.css:87](styles/global.css#L87). It is
  what stops sideways scrolling on mobile while keeping the sticky header alive (`hidden` would
  break it). Fix overflowing sections at the source (`grid-cols-1`, `min-w-0`, an own
  `overflow-x: auto` wrapper — the prose-table rule at [global.css:271](styles/global.css#L271) is
  the pattern); never remove or weaken the rule itself.

## Status (volatile — re-verify, don't trust)

- Live: **https://agoradatadriven.com** — Cloud Run service `agora-data-driven`, `asia-southeast1`.
- Serving revision `agora-data-driven-00064-vgv` (verified 2026-07-29).
