# Agora Data Driven — Website

Marketing site + blog for **Agora Data Driven**, a data-driven marketing & analytics agency. Rebuilt from WordPress as a fast, maintainable coded site.

- **Framework:** [Astro](https://astro.build) (SSR via the Node adapter) + TypeScript
- **Styling:** Tailwind CSS v4 (design tokens in `src/styles/global.css`)
- **Content:** Markdown/MDX via Astro Content Collections
- **Hosting:** Google Cloud Run (container) via Cloud Build + Artifact Registry

See [PLAN.md](PLAN.md) for the build plan and [CLAUDE.md](CLAUDE.md) for conventions.

## Prerequisites

- **Node.js ≥ 20** (use the version in `.nvmrc`)
- npm (bundled with Node)
- For deploys: the [`gcloud` CLI](https://cloud.google.com/sdk/docs/install) authenticated to project `agora-data-driven`

## Local development

```bash
npm install        # install dependencies
npm run dev        # start the dev server → http://localhost:4321
```

Other scripts:

```bash
npm run build      # production build → dist/ (server + client)
npm run start      # run the built server (node ./dist/server/entry.mjs)
npm run check      # astro type-check
npm run lint       # eslint + prettier --check
npm run format     # prettier --write
```

## Project structure

```
src/
  layouts/      page shells (BaseLayout, …)
  components/   UI components (Header, Footer, Button, Container, SEO, …)
  content/      Markdown collections: posts/ · caseStudies/ · competitions/
  data/         structured data: site.ts · nav.ts · cta.ts · testimonials.ts · …
  pages/        routes (slugs preserved 1:1 from the old WordPress site)
  styles/       global.css — Tailwind import + design tokens (@theme)
  assets/       images optimized by astro:assets
public/         static passthrough (robots.txt, favicon, …)
```

## Adding a blog post

1. Create `src/content/posts/<slug>.md` (the file name becomes the URL slug).
2. Add frontmatter:

   ```yaml
   ---
   title: 'Your Post Title'
   publishDate: 2026-06-21
   excerpt: 'One–two sentence summary used on cards and meta description.'
   heroImage: '../../assets/posts/your-image.jpg'
   heroAlt: 'Describe the image for screen readers.'
   category: 'Marketing'
   ---
   ```

3. Write the body in Markdown. Run `npm run dev` — the post appears on `/blog/` and at `/<slug>/`.

## Deploy to Google Cloud Run

The `Dockerfile` builds a standalone Node server. Cloud Build builds the image remotely (no local Docker needed):

```bash
gcloud config set project agora-data-driven

gcloud run deploy agora-data-driven \
  --source . \
  --region us-central1 \
  --allow-unauthenticated
```

Cloud Run injects `PORT` (8080); the Astro Node adapter binds to `HOST=0.0.0.0` and that port automatically. Map the custom domain (`agoradatadriven.com`) via **Cloud Run → Manage custom domains** once verified.

> First deploy in a new project may prompt to enable the Cloud Run, Cloud Build, and Artifact Registry APIs — accept to continue.
