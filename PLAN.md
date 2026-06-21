# Agora Data Driven — Rebuild Plan

> Rebuild of **agoradatadriven.com** (WordPress + Elementor) as a clean, fast, maintainable coded site in an Upwork-inspired aesthetic. This document is the build contract: audit findings, stack, sitemap, content model, redirect map, design tokens, and phase order. **Status: awaiting approval before scaffolding.**

---

## 1. Audit — what's actually on the live site

Crawled via `wp-sitemap.xml`. The site has **14 real URLs** plus template cruft injected by the Elementor demo.

### 1.1 Page inventory

| # | Live URL | Type | Real / Junk | Notes |
|---|----------|------|-------------|-------|
| 1 | `/` | Home | **Mixed** | Real hero, certs, testimonials, FAQ, blog feed. **Junk:** template portfolio + fake pricing (kitpapa.net/brighture demo links). |
| 2 | `/blog/` | Blog index | **Real** | Lists 6 posts. No intro copy, no pagination. |
| 3 | `/agora-portfolio/` | Portfolio | **Real** | Case studies, competitions, web-dev — this is the *good* portfolio (homepage portfolio is the junk one). |
| 4 | `/building-an-authentic-brand-identity/` | Post | **Real — flagship** | This **is** the "LED Wall" nav item. Title: *"From Display to Demand: Marketing Our LED Wall."* Dated Dec 2, 2024. Slug must be preserved. |
| 5 | `/how-we-helped-more-than-double-our-clients-weekly-sales-through-full-funnel-marketing/` | Post | **Real** | Case-study-style post, updated Jun 13 2026 (newest). |
| 6 | `/how-video-marketing-boosts-engagement-and-sales/` | Post | **Real** | May 30 2025. |
| 7 | `/how-to-launch-a-product-online-a-marketing-agencys-guide-for-entrepreneurs/` | Post | **Real** | May 30 2025. |
| 8 | `/why-consistent-content-is-the-key-to-long-term-growth/` | Post | **Real** | May 30 2025. |
| 9 | `/digital-advertising-myths-that-are-holding-your-business-back/` | Post | **Real** | May 30 2025. |
| 10 | `/case-study-sabbathspawellnesshub/` | Page | **Real** | Spa & wellness. Structured: Background / Challenges / Solution / Results. Has metrics. |
| 11 | `/case-study-community-events/` | Page | **Real** | Community events case study (same structure). |
| 12 | `/case-study-digital-products/` | Page | **Real** | Digital products case study (same structure). |
| 13 | `/competition1/` | Page | **Real** | Codebasics Resume Project Challenge #9 — *2nd of 2,459*, Marketing Analytics. |
| 14 | `/competition2/` | Page | **Real** | *1st place, cash prize* — Operations Analytics. |
| — | `/category/blog/` | Category archive | Real (WP-generated) | Redirect to `/blog/`. |
| — | `webdev.agoradatadriven.com` | External subdomain | Out of scope | Separate web-dev portfolio site. Linked from Portfolio submenu. **Decision needed** (see §10). |

### 1.2 Navigation & primary CTAs (real — keep)

- **Nav:** Home · Portfolio (▸ Marketing & Analytics, ▸ Web Development → `webdev.agoradatadriven.com`) · Blog · LED Wall (→ post #4).
- **"Become a client!"** → `https://www.upwork.com/agencies/1818954484693860352/`
- **"Join the Team"** → `https://apply.agoradatadriven.com`

### 1.3 Asset & content inventory (real — migrate)

- **Brand:** Agora logo (several variants under `/wp-content/uploads/2025/04/`). We'll consolidate to one clean SVG/PNG.
- **Certifications:** 11 Credly badges with real verification URLs (Intuit Bookkeeping, IBM Data Science series, Media Buying Pro, etc.). Badges #9/#10 share a URL (dupe) and #11 is missing the `/public_url` suffix — flagged below.
- **Testimonials:** 6, sourced from Upwork, **anonymous** (no names/companies on the live site). Wording captured verbatim. Will **not** invent names/logos.
- **FAQ:** 5 real Q&As (cost, differentiation, examples, how-to-start, timeline). Q5's answer is duplicated from a generic line — flagged.
- **Case studies:** 3 (Sabbath Spa, Community Events, Digital Products) with real metrics (e.g. Sabbath: *"100% increase in monthly social media inquiries within 6 weeks," "40% increase in bookings," "200+ new followers/month"*).
- **Competitions:** 2 real placements with images.
- **Blog hero images:** mix of real photos and AI-generated (`Gemini_Generated_Image_*`, `unnamed.webp`).

### 1.4 Template/placeholder cruft (DO NOT reproduce)

| Item | Where | Action |
|------|-------|--------|
| Fake pricing tiers ($19/$29/$39 Silver/Gold/Platinum) → `kitpapa.net/brighture/contact/` | Home | **Replace** with a single "Get a custom quote" CTA (FAQ confirms custom quotes only). |
| "Explore our Portfolio" demo grid (Branded Visions, Digital Gallery, etc.) → `kitpapa.net/brighture/gallery/` | Home | **Remove.** Replace with a teaser linking to the real `/portfolio/` page. |
| "Latest Portfolio" button → `kitpapa.net/brighture/services/` | Home | **Remove.** |
| Duplicate "Data Analytics & Reporting /02" + 3 cards all → `/data-analytics-reporting/` (broken) | Home | **Remove** (page doesn't exist as real content). |
| Footer Terms & Privacy → `#` (dead) | All | **Stub** real pages or drop from footer (see §10). |
| 7 unidentified "client logos" on Portfolio trust strip (no alt, no link) | Portfolio | **Flag** — NEEDS INPUT (which clients? permission to show?). |
| "Job Success Rate 0%" badge | Portfolio | Looks like a broken/placeholder value — **flag**, pull real Upwork stat. |

---

## 2. Stack decision

**Recommendation: Astro + TypeScript + Tailwind CSS** (confirming the brief's primary rec).

- **Astro** ships zero JS by default → best-in-class SEO + Core Web Vitals for a marketing/blog site. **Content Collections** are a perfect fit for migrating WP posts to type-safe Markdown/MDX with validated frontmatter.
- **Tailwind** with centralized design tokens (`theme.extend`) → no magic values.
- **Interactive islands** (React or vanilla) only where needed: mobile nav, FAQ accordion, testimonial slider, pricing/quote toggle.
- **SSR via `@astrojs/node`**, containerized and deployed to **GCP Cloud Run** (full-stack headroom; no dynamic feature is needed today since the quote CTA routes to Upwork).
- **Tooling:** TypeScript (strict), ESLint + Prettier, `@astrojs/sitemap`, `astro:assets`; `Dockerfile` + Cloud Build for deploy. Cloud Build builds the image remotely, so local Docker is optional.

Next.js is the documented alternative *only* if app features (auth, dashboards, client portal) are coming. Nothing in the audit needs them. Recommend Astro.

---

## 3. Target sitemap (new site)

Slugs preserved 1:1 with the live site for SEO. Blog posts stay at the **root** (WP flat permalink), not under `/blog/`, to avoid redirects.

```
/                                  Home
/agora-portfolio/                  Portfolio (real case studies + competitions)
/blog/                             Blog index (all 6 posts, paginated-ready)
/building-an-authentic-brand-identity/   LED Wall flagship post (nav: "LED Wall")
/how-we-helped-more-than-double-our-clients-weekly-sales-through-full-funnel-marketing/
/how-video-marketing-boosts-engagement-and-sales/
/how-to-launch-a-product-online-a-marketing-agencys-guide-for-entrepreneurs/
/why-consistent-content-is-the-key-to-long-term-growth/
/digital-advertising-myths-that-are-holding-your-business-back/
/case-study-sabbathspawellnesshub/     Case study detail
/case-study-community-events/          Case study detail
/case-study-digital-products/          Case study detail
/competition1/                          Competition detail
/competition2/                          Competition detail
/category/blog/                         → 301 redirect to /blog/
  (new) /privacy/  /terms/             Stub legal pages (pending §10 decision)
```

External (unchanged, open in new tab): Upwork agency, `apply.agoradatadriven.com`, `webdev.agoradatadriven.com`, Credly badges.

---

## 4. Component list

**Layout / global**
- `BaseLayout.astro` — `<head>`, SEO meta, JSON-LD slot, skip-link, fonts.
- `Header.astro` + `MobileNav` island — sticky nav, dropdown Portfolio menu, two CTAs.
- `Footer.astro` — Pages nav, logo, legal links, copyright.
- `SEO.astro` — title/description/canonical/OG/Twitter per page.
- `JsonLd.astro` — Organization (site-wide) + BlogPosting (posts).

**Home sections**
- `Hero.astro` (headline, value prop, dual CTA, optional brand video — see NEEDS INPUT).
- `CertificationsStrip.astro` (Credly badges, external verify links).
- `Testimonials` island (6 quotes, slider on mobile, Upwork attribution).
- `WhyUs` / value props.
- `PortfolioTeaser.astro` (real case-study cards → `/agora-portfolio/`).
- `FaqAccordion` island (5 Q&As).
- `QuoteCta.astro` ("Get a custom quote" → Upwork; replaces fake pricing).
- `FinalCta.astro` ("Data Driven Success Starts Today!").

**Shared / content**
- `Card.astro`, `Button.astro` (primary/secondary/ghost variants), `Badge.astro`, `SectionHeading.astro`, `Container.astro`.
- `PostCard.astro` (blog index + "Latest from Blog").
- `CaseStudyCard.astro`, `CompetitionCard.astro`.
- `Prose.astro` wrapper for Markdown article bodies.
- `CaseStudyLayout.astro` (Background / Challenges / Solution / Results template).

---

## 5. Content model (Astro Content Collections)

```
src/content/
  posts/              # 6 blog posts (.md / .mdx)
  caseStudies/        # 3 case studies
  competitions/       # 2 competitions
src/data/             # structured, non-article content (TS/JSON)
  testimonials.ts     # 6 quotes (+ source: "Upwork")
  certifications.ts   # 11 Credly badges {name, url, image}
  faqs.ts             # 5 Q&A
  nav.ts / cta.ts     # nav items + canonical CTA URLs
```

**`posts` frontmatter schema (zod):**
```ts
{ title, slug (preserve), publishDate, updatedDate?, excerpt,
  heroImage, heroAlt, author? ("Agora Data Driven"), category, draft? }
```

**`caseStudies` frontmatter:**
```ts
{ title, client, slug, summary, heroImage, services[], metrics[],
  sections: {background, challenges, solution, results} }
```

**`competitions` frontmatter:**
```ts
{ title, placement, event, slug, heroImage, summary, body }
```

---

## 6. Redirect map (`old → new`)

Because slugs are preserved, redirects are minimal. Provided as a host-agnostic table; on Cloud Run (SSR) these are handled via Astro's `redirects` config / middleware (301).

| Old URL | New URL | Code | Reason |
|---------|---------|------|--------|
| `/category/blog/` | `/blog/` | 301 | Consolidate WP category archive. |
| `/data-analytics-reporting/` | `/agora-portfolio/` | 301 | Broken template target → real portfolio. |
| `kitpapa.net/brighture/*` | — | n/a | External junk, not our domain; just removed from markup. |
| All 14 real URLs | unchanged | — | **No redirect needed** (1:1 slug preservation). |

WP system URLs (`/wp-admin`, `/wp-sitemap*.xml`, `/wp-content/*`) die with WordPress; our new `sitemap-index.xml` + `robots.txt` replace them. Old image URLs (`/wp-content/uploads/...`) will be flagged if any indexed page deep-links them.

---

## 7. SEO & migration safety

- Per-page `<title>`, meta description, canonical, OG + Twitter cards (`SEO.astro`).
- `@astrojs/sitemap` → `sitemap-index.xml`; hand-written `robots.txt` (drop WP rules, point to new sitemap).
- JSON-LD: `Organization` site-wide; `BlogPosting` per post; `BreadcrumbList` where useful.
- `astro:assets` → responsive WebP/AVIF, lazy loading, explicit width/height (no CLS).
- Preserve slugs (done in §3). Add a 404 page.
- Target Lighthouse ≥ 90 on all four categories (achievable with Astro static + optimized images).

---

## 8. Design tokens (Upwork-inspired)

Defined once in `tailwind.config` + CSS vars. Anchored by Upwork's confident green on near-black ink with airy neutrals.

```
Color
  brand.green   #14A800   (primary / CTAs — Upwork green)
  brand.greenHi #108A00   (hover/pressed)
  brand.tint    #E4FFE0   (soft green background wash)
  ink           #001E00   (headings — Upwork's signature dark green-black)
  body          #5E6D55 / #2B3328  (body text, muted)
  neutral.50–900           (gray scale for surfaces/borders)
  surface       #FFFFFF   bg #F7F9F7   border #E4EBE4
Type
  Sans: Inter (or system stack fallback) — modern, legible.
  Scale: 12 / 14 / 16 / 18 / 20 / 24 / 30 / 36 / 48 / 60 (rem-based).
Radius: sm 6 · md 10 · lg 16 · pill 999
Shadow: subtle card elevation (low-spread, soft).
Spacing: 4px base; section rhythm 80–120px desktop / 48–64px mobile.
Motion: 150–250ms ease; reduced-motion respected. No parallax/jank.
```

Final palette gets locked via the **artifact-design** skill at scaffold time (brainstorm → critique → commit) before any component is built.

---

## 9. Phase order

1. **Scaffold** — Astro + TS (strict) + Tailwind + ESLint/Prettier; folder structure; design tokens; `BaseLayout`, `Header`, `Footer`, `Button`, `Container`. Dev server up. *(Commit: chore: scaffold)*
2. **Content migration** — port 6 posts + 3 case studies + 2 competitions to Markdown with frontmatter; load testimonials/certs/FAQ as data. *(Commit per content type)*
3. **Home** — build all sections with real content; kill pricing/portfolio junk. Verify responsive.
4. **Blog** — index + post template + LED Wall; prose styling; reading experience.
5. **Portfolio** — portfolio page + case-study + competition detail templates.
6. **Legal/misc** — privacy/terms stubs (pending §10), 404.
7. **SEO pass** — sitemap, robots, JSON-LD, per-page meta, redirect map file.
8. **QA** — a11y (AA), responsive breakpoints, Lighthouse ≥90, broken-link sweep, README.

Each phase: run dev server, verify render + responsiveness, commit logically. Nothing destructive — this is a greenfield directory.

---

## 10. Resolved decisions ✅ (approved 2026-06-21)

1. **Stack** — **Astro + TypeScript + Tailwind.** ✅
2. **Hosting** — **GCP Cloud Run** (full-stack). Astro SSR via `@astrojs/node`, containerized (`Dockerfile`), deployed with **Cloud Build** + **Artifact Registry**. Active gcloud project: `agora-data-driven`. ✅
3. **"Get a custom quote" CTA** — **routes to the Upwork agency page** (no backend/contact form). ✅
4. **Web Development submenu** — keep `webdev.agoradatadriven.com` as an external link (separate property, opens in new tab). *(default)*
5. **Legal pages** — **stub `/privacy` + `/terms`** with placeholder copy the client fills in later; footer links go live. ✅

---

## 11. NEEDS INPUT (real content I couldn't verify — won't fabricate)

- **Brand video:** the brief mentions a hero "brand video," but **no video embed exists on the live homepage.** Provide the video (YouTube/Vimeo/MP4) if it should be featured, else I'll omit it.
- **Exact hero headline:** live markup renders *"Analytics Powered Marketing for Real…"* (the word "Results" appears styled/animated and didn't extract cleanly). Confirm final wording — assuming **"Analytics Powered Marketing for Real Results."**
- **Testimonial attribution:** keep as anonymous "Upwork client," or add real names/companies/avatars (with permission)?
- **Certifications cleanup:** badge #11 (Media Buying Pro) URL is missing `/public_url`; badges #9 & #10 share one URL. Confirm the correct/complete Credly list + badge images.
- **Portfolio "trust" logos:** 7 client logos with no names — identify them (and confirm permission), or I'll drop the strip.
- **Upwork "Job Success Rate"** shows **0%** on the live site (clearly wrong/placeholder) — supply the real figure (e.g. JSS %, Top Rated, total earned) or I'll omit the stat.
- **Real portfolio media** to replace any remaining demo imagery, if available.

---

*Next step after approval: Phase 1 scaffold. I will not scaffold until you sign off on this plan and the §10 decisions.*
