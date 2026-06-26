// @ts-check
import { defineConfig } from 'astro/config';
import node from '@astrojs/node';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

// Canonical production URL. Used for sitemap, canonical tags, and OG URLs.
const SITE = 'https://agoradatadriven.com';

// https://astro.build/config
export default defineConfig({
  site: SITE,
  // SEO redirects (old WordPress URLs -> new). 301 by default.
  redirects: {
    '/category/blog': '/blog/',
    '/category/blog/': '/blog/',
    '/data-analytics-reporting': '/agora-portfolio/',
    '/data-analytics-reporting/': '/agora-portfolio/',
  },
  // Full-stack output for GCP Cloud Run. Content pages opt into prerendering
  // with `export const prerender = true` for static-fast delivery; the Node
  // server provides headroom for future dynamic routes.
  output: 'server',
  adapter: node({ mode: 'standalone' }),
  integrations: [mdx(), sitemap()],
  vite: {
    // @tailwindcss/vite is typed against a different bundled Vite version than
    // Astro's, so the plugin type doesn't line up even though it works at
    // runtime. Cast to sidestep the type-only version skew.
    plugins: [/** @type {any} */ (tailwindcss())],
  },
  image: {
    // Allow remote optimization of legacy WordPress media during migration.
    domains: ['agoradatadriven.com'],
  },
});
