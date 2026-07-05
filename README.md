# Agora Data Driven — Website

Marketing site + blog for **Agora Data Driven**, a data-driven marketing & analytics agency. Rebuilt from WordPress as a fast, maintainable coded site.

- **Framework:** [Astro](https://astro.build) (SSR via the Node adapter) + TypeScript
- **Styling:** Tailwind CSS v4 (design tokens in `src/styles/global.css`)
- **Content:** Markdown via Astro Content Collections
- **Hosting:** Google Cloud Run (container) via Cloud Build + Artifact Registry

See [docs/PLAN.md](docs/PLAN.md) for the original build plan and [CLAUDE.md](CLAUDE.md) for conventions.

## Quick start

```bash
git clone https://github.com/Agora-Data-Driven/website.git website
cd website
```

**New machine?** Run the one-time bootstrap for your OS. It installs Node.js, the
gcloud CLI, and the GitHub CLI (if missing), logs you into Google Cloud **and**
GitHub via your browser, installs dependencies, and launches the dev server:

```powershell
# Windows (PowerShell). A UAC prompt may appear during installs — click Yes.
powershell -ExecutionPolicy Bypass -File .\scripts\setup.ps1
```

```bash
# macOS / Linux
bash ./scripts/setup.sh
```

> `-ExecutionPolicy Bypass` is needed only because the script isn't code-signed.
> It's a first-party script in this repo — read it before running if you like.

**Already set up?** Each work day, run `startday`. It makes sure your Google Cloud
and GitHub logins are ready (opening a browser link — never a password prompt),
pulls the latest `main`, installs any new dependencies, then starts the dev server:

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\startday.ps1
```

```bash
bash ./scripts/startday.sh
```

> This is a **Node** project — the local dependency environment is `node_modules/`
> (created by `npm install`). There is no Python `venv`.

## Prerequisites

- **Node.js ≥ 22** (the version pinned in `.nvmrc`; production runs Node 22)
- npm (bundled with Node)
- For deploys: the [`gcloud` CLI](https://cloud.google.com/sdk/docs/install) authenticated to project `agora-data-driven`
- For pushing to GitHub: the [`gh` CLI](https://cli.github.com/) authenticated (the bootstrap scripts set this up)

## Local development

```bash
npm install        # install dependencies (use `npm ci` for a clean, locked install)
npm run dev        # start the dev server → http://localhost:4321
```

Other scripts:

```bash
npm run build      # production build → dist/ (server + client)
npm run start      # run the built server (node ./dist/server/entry.mjs)
npm run check      # astro type-check
npm run lint       # eslint + prettier --check
npm run format     # prettier --write
npm run deploy     # build remotely + deploy to Cloud Run (prints the live URL)
```

## Project structure

```
src/
  layouts/      page shells (BaseLayout, CaseStudyLayout, PostLayout)
  components/   UI components (Header, Footer, Button, Container, SEO, …); home sections in components/home
  content/      posts/ — the Markdown blog collection (case studies & competitions are .astro pages)
  data/         structured data: site.ts · nav.ts · cta.ts · testimonials.ts · …
  pages/        routes (slugs preserved 1:1 from the old WordPress site)
  styles/       global.css — Tailwind v4 import + design tokens (@theme)
  assets/       images optimized by astro:assets
public/         static passthrough (robots.txt, favicon.svg, agora-logo.png, Credly/)
docs/           PLAN.md — archived build plan
scripts/        setup + startday bootstrap scripts (PowerShell + bash)
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

The `Dockerfile` builds a standalone Node server; Cloud Build builds the image remotely (no local Docker needed). The canonical command is wrapped in an npm script so the project + region live in exactly one place:

```bash
npm run deploy
# = gcloud run deploy agora-data-driven --source . \
#     --project agora-data-driven --region australia-southeast1 \
#     --allow-unauthenticated
```

Cloud Run injects `PORT` (8080); the Astro Node adapter binds to `HOST=0.0.0.0` and that port automatically. Map the custom domain (`agoradatadriven.com`) via **Cloud Run → Manage custom domains** once verified.

> First deploy in a new project may prompt to enable the Cloud Run, Cloud Build, and Artifact Registry APIs — accept to continue.
