/**
 * Shared blog-post helpers used by /blog/, the category hubs, and PostLayout.
 *
 * Three surfaces were each re-deriving the same things (hero image, read time,
 * "more like this"), and each rendered a slightly different card. This module
 * is the single source of truth; `CardData` is the one shape `PostCard.astro`
 * renders, so a curated entry from `blogData.ts` and a raw markdown post are
 * indistinguishable to the UI.
 */
import type { CollectionEntry } from 'astro:content';

export type Post = CollectionEntry<'posts'>;

/** Everything `PostCard.astro` needs, whatever the source. */
export interface CardData {
  href: string;
  title: string;
  excerpt: string;
  /** Silo / display category shown on the badge. */
  category: string;
  /** 'Case Study' | 'The Data Files' — optional kind badge. */
  kindLabel?: string;
  /** Pre-formatted, e.g. "Jun 27, 2026". */
  date: string;
  readTime: string;
  /** Real hero photograph. Absent → the branded SVG thumbnail is used. */
  image?: string;
  imageAlt?: string;
  thumbVariant: string;
  /** Filter facets used by the /blog/ search + dropdowns. */
  topic: string;
  industry: string;
}

/** Default brand SVG thumbnail per silo, for posts with no hero photo. */
const THUMB_BY_CATEGORY: Record<string, string> = {
  'Marketing Analytics': 'dashboard-metrics',
  'Paid Marketing': 'channel-launch',
  'Organic Growth': 'content-engine',
  'Strategy & Growth': 'email-retargeting',
  'Careers & Skill-Building': 'course-review',
};

export const thumbVariant = (category: string): string =>
  THUMB_BY_CATEGORY[category] ?? 'attribution-flow';

/**
 * Per-post hero photo path. Every post gets its OWN file under
 * `/blog-images/<slug>.webp` so the in-page admin editor's "Replace" can swap
 * one post's photo without touching any other post — the old shared
 * `/placeholders/cover-N.svg` heroes were aliased across many posts, so
 * replacing one would have replaced them all.
 *
 * Returns `undefined` when the post has no real photo, letting callers fall
 * back to the brand `BlogThumbnail` SVG. That keeps future posts working with
 * zero setup: publish the markdown, add a photo later via the editor.
 */
export function postImage(post: Post): string | undefined {
  const hero = post.data.heroImage?.trim();
  if (!hero) return undefined;
  if (hero.startsWith('/placeholders/')) return undefined; // shared stand-in, not a real photo
  return hero;
}

/** Alt text for `postImage` — never empty when an image is rendered. */
export const postImageAlt = (post: Post): string => post.data.heroAlt?.trim() || post.data.title;

/** Read time from the body, in whole minutes (220 wpm), min 1. */
export function readTime(post: Post): string {
  const words = (post.body ?? '').trim().split(/\s+/).filter(Boolean).length;
  return `${Math.max(1, Math.ceil(words / 220))} min read`;
}

export const formatDate = (d: Date): string =>
  d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });

/** Kind badge for a post, matching the /blog/ carousel vocabulary. */
export function kindLabel(post: Post): string | undefined {
  if (post.data.type === 'case-study') return 'Case Study';
  if (post.data.type === 'data-file') return 'The Data Files';
  return undefined;
}

/** Markdown post → the card shape the UI renders. */
export function cardFromPost(post: Post): CardData {
  return {
    href: `/${post.id}/`,
    title: post.data.title,
    excerpt: post.data.excerpt,
    category: post.data.category,
    kindLabel: kindLabel(post),
    date: formatDate(post.data.publishDate),
    readTime: readTime(post),
    image: postImage(post),
    imageAlt: postImageAlt(post),
    thumbVariant: thumbVariant(post.data.category),
    topic: post.data.category,
    industry: post.data.industry ?? 'All industries',
  };
}

/**
 * Rank other posts by how related they are to `post`, most related first.
 *
 * Score: same silo (+3) · same content kind (+2) · same industry (+1), then
 * newest-first as the tie-break. It deliberately falls back to the whole
 * collection rather than returning fewer than `limit` — most silos start with
 * one or two articles, and an article with an empty "related" row looks broken.
 */
export function relatedPosts(post: Post, all: Post[], limit = 3): Post[] {
  const score = (p: Post): number =>
    (p.data.category === post.data.category ? 3 : 0) +
    (p.data.type === post.data.type ? 2 : 0) +
    (p.data.industry && p.data.industry === post.data.industry ? 1 : 0);

  return all
    .filter((p) => p.id !== post.id && !p.data.draft)
    .sort(
      (a, b) => score(b) - score(a) || b.data.publishDate.getTime() - a.data.publishDate.getTime(),
    )
    .slice(0, limit);
}
