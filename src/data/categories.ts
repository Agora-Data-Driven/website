/**
 * Blog silo taxonomy, the single source of truth for content categories.
 *
 * These are intent-distinct topic silos (an SEO "topic cluster" model): each one
 * is a crawlable hub page at /blog/category/<slug>/ that links to its posts and
 * back. Most silos serve prospective CLIENTS (convert → Upwork); one serves the
 * TALENT audience (convert → apply.agoradatadriven.com + the Skill Mastery app).
 *
 * `name` is also the value stored in each post's `category` frontmatter, so the
 * names here are the controlled vocabulary enforced by the content schema
 * (src/content.config.ts). When adding a silo, add it here first.
 */
export type Audience = 'clients' | 'talent';

export interface Silo {
  /** Display name + the exact value used in post frontmatter `category`. */
  name: string;
  /** URL slug → /blog/category/<slug>/ */
  slug: string;
  /** Which audience this silo serves (drives the hub-page CTA). */
  audience: Audience;
  /** One-line hub-page subtitle. */
  tagline: string;
  /** Meta description for the hub page (~150 chars). */
  metaDescription: string;
}

export const silos = [
  {
    name: 'Marketing Analytics',
    slug: 'marketing-analytics',
    audience: 'clients',
    tagline: 'Measurement, attribution, and turning data into decisions you can act on.',
    metaDescription:
      'Marketing analytics insights from Agora Data Driven, measurement, attribution, dashboards, and turning data into decisions that grow your business.',
  },
  {
    name: 'Paid Marketing',
    slug: 'paid-marketing',
    audience: 'clients',
    tagline: 'Meta and Google ads, full-funnel paid media, and more from every dollar of spend.',
    metaDescription:
      'Paid marketing insights from Agora Data Driven, Meta and Google ads, full-funnel paid media, and getting more results from every dollar of ad spend.',
  },
  {
    name: 'Organic Growth',
    slug: 'organic-growth',
    audience: 'clients',
    tagline: 'SEO, content, social, and video that compound into durable, lower-cost growth.',
    metaDescription:
      'Organic growth insights from Agora Data Driven, SEO, content, social, and video strategy that compounds into durable, lower-cost growth over time.',
  },
  {
    name: 'Strategy & Growth',
    slug: 'strategy-growth',
    audience: 'clients',
    tagline: 'Full-funnel strategy, positioning, and launches that move past the sales plateau.',
    metaDescription:
      'Marketing strategy and growth insights from Agora Data Driven, full-funnel strategy, positioning, and product launches that break the sales plateau.',
  },
  {
    name: 'Careers & Skill-Building',
    slug: 'careers-skill-building',
    audience: 'talent',
    tagline: 'Build data, analytics, and marketing skills, and a career with Agora.',
    metaDescription:
      'Career and skill-building guides for aspiring data scientists, marketers, and virtual assistants, learn the skills Agora Data Driven hires and trains for.',
  },
] as const satisfies readonly Silo[];

export type SiloName = (typeof silos)[number]['name'];

/** Controlled vocabulary for the content schema (z.enum needs a non-empty tuple). */
export const siloNames = silos.map((s) => s.name) as [SiloName, ...SiloName[]];

/**
 * Fallback bucket if a post (e.g. one published by the auto SEO pipeline) ever
 * carries a category outside the controlled list. Keeps the build from failing
 * and the post from disappearing; re-tag it to the right silo when noticed.
 */
export const FALLBACK_CATEGORY: SiloName = 'Strategy & Growth';

export const getSilo = (name: string): Silo | undefined => silos.find((s) => s.name === name);
export const getSiloBySlug = (slug: string): Silo | undefined => silos.find((s) => s.slug === slug);
