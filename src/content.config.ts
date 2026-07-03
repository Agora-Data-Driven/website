import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';
import { siloNames, FALLBACK_CATEGORY } from './data/categories';

// Blog posts, Markdown migrated from the WordPress site. File name = URL slug
// (preserved 1:1 for SEO; posts render at the site root, e.g. /<slug>/).
const posts = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/posts' }),
  schema: z.object({
    title: z.string(),
    publishDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    excerpt: z.string(),
    heroImage: z.string().optional(),
    heroAlt: z.string().optional(),
    // Controlled to the silo taxonomy in src/data/categories.ts. `.catch` keeps
    // an out-of-vocabulary value (e.g. from the auto SEO pipeline) from failing
    // the build, it falls back to a safe bucket instead. Re-tag when noticed.
    category: z.enum(siloNames).catch(FALLBACK_CATEGORY),
    // 'case-study' posts are surfaced under Portfolio, not in the blog silos.
    type: z.enum(['post', 'case-study']).default('post'),
    draft: z.boolean().default(false),
    // Optional industry tag for filtering (e.g. 'E-commerce', 'Local Business', 'B2B').
    industry: z.string().optional(),
  }),
});

export const collections = { posts };
