/**
 * Blog landing page data — source of truth for what appears on /blog/.
 *
 * Posts that already have a real markdown file in src/content/posts/ carry their
 * canonical slug href so read-time is calculated from the body. Posts without a
 * real page yet link to the most relevant existing route (category hub or
 * portfolio) — no broken links.
 *
 * Adding a new post:
 *   1. Add an entry here with `section`, `thumbnailVariant`, `topic`, `industry`.
 *   2. Create the markdown file at src/content/posts/<slug>.md — it auto-appears.
 *   3. Update `href` from the placeholder to `/<slug>/`.
 */

export interface BlogPost {
  /** Matches the markdown file id (used for body read-time lookup). */
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  section: 'data-driven-marketing' | 'case-studies';
  /** Display category label shown on the card badge. */
  category: string;
  /** Used for topic filter — maps to the topic-filter dropdown values. */
  topic: string;
  /** Used for industry filter. Use 'All industries' when not industry-specific. */
  industry: string;
  /** Optional source provenance label for case studies. */
  sourceLabel?: string;
  /** Pre-formatted display date string, e.g. 'Jun 27, 2026'. */
  date: string;
  /** Fallback read time string used when no markdown body is available. */
  readTimeFallback: string;
  /** Key for BlogThumbnail variant prop. */
  thumbnailVariant: string;
  /** Destination href. Use real slug when a post page exists. */
  href: string;
  /** The single featured post shown in the hero section. */
  featured?: boolean;
}

/** Controlled topic list for the filter dropdown. */
export const topicOptions = [
  'Marketing Analytics',
  'Paid Marketing',
  'Organic Growth',
  'Strategy & Growth',
  'Attribution',
  'Experimentation',
  'Course Reviews',
  'Guides & How-tos',
] as const;

/** Controlled industry list for the filter dropdown. */
export const industryOptions = [
  'Local Business',
  'Ecommerce',
  'SaaS',
  'Beauty & Wellness',
  'Healthcare',
  'Real Estate',
  'Education',
  'Hospitality',
  'Professional Services',
  'Big Tech',
] as const;

export const blogPosts: BlogPost[] = [
  // ─── Data Driven Marketing ──────────────────────────────────────────────────

  {
    id: 'creative-testing-across-verticals-dooh',
    slug: 'creative-testing-across-verticals-dooh',
    title: 'Creative Testing: DOOH Lessons Across 6 Verticals',
    excerpt:
      "When testing creative across multiple verticals, the channel's constraints matter more than the message's specifics.",
    section: 'data-driven-marketing',
    category: 'Paid Media',
    topic: 'Paid Marketing',
    industry: 'Local Business',
    date: 'Jun 27, 2026',
    readTimeFallback: '7 min read',
    thumbnailVariant: 'creative-testing',
    href: '/creative-testing-across-verticals-dooh/',
    featured: true,
  },
  {
    id: 'attribution-models-compared-spend-to-revenue',
    slug: 'attribution-models-compared-spend-to-revenue',
    title: 'Which Attribution Model Ties Your Ad Spend to Revenue?',
    excerpt:
      "Get attribution wrong and you'll cut the spend that's quietly doing the work while pouring money into the channel that just happened to be last in line.",
    section: 'data-driven-marketing',
    category: 'Attribution',
    topic: 'Marketing Analytics',
    industry: 'All industries',
    date: 'Jun 27, 2026',
    readTimeFallback: '6 min read',
    thumbnailVariant: 'attribution-flow',
    href: '/attribution-models-compared-spend-to-revenue/',
  },
  {
    id: 'how-to-launch-a-new-paid-advertising-channel',
    slug: 'how-to-launch-a-new-paid-advertising-channel',
    title: 'Launch New Paid Advertising Channel: A Framework',
    excerpt:
      'A step-by-step framework to test, learn, and scale new paid channels without turning your budget into guesswork.',
    section: 'data-driven-marketing',
    category: 'Paid Media',
    topic: 'Paid Marketing',
    industry: 'All industries',
    date: 'Jun 27, 2026',
    readTimeFallback: '8 min read',
    thumbnailVariant: 'channel-launch',
    href: '/how-to-launch-a-new-paid-advertising-channel/',
  },
  {
    id: 'server-side-vs-client-side-tracking-ga4',
    slug: 'server-side-vs-client-side-tracking-ga4',
    title: 'Server-Side vs Client-Side Tracking for Accurate GA4',
    excerpt:
      "Client-side tracking is becoming less reliable. Here's when server-side tracking gives you cleaner data and better decisions.",
    section: 'data-driven-marketing',
    category: 'Analytics',
    topic: 'Marketing Analytics',
    industry: 'Ecommerce',
    date: 'Jun 25, 2026',
    readTimeFallback: '7 min read',
    thumbnailVariant: 'server-tracking',
    href: '/server-side-vs-client-side-tracking-ga4/',
  },
  {
    id: 'the-30-day-paid-channel-test-framework',
    slug: 'the-30-day-paid-channel-test-framework',
    title: 'The 30-Day Paid Channel Test Framework',
    excerpt: 'A practical testing structure for validating a paid channel before you scale spend.',
    section: 'data-driven-marketing',
    category: 'Experimentation',
    topic: 'Experimentation',
    industry: 'All industries',
    date: 'Jun 24, 2026',
    readTimeFallback: '9 min read',
    thumbnailVariant: 'experiment-roadmap',
    href: '/blog/category/paid-marketing/',
  },
  {
    id: 'google-data-analytics-certificate-review',
    slug: 'google-data-analytics-certificate-review',
    title: 'Google Data Analytics Certificate Review',
    excerpt:
      "Useful foundations, but not enough by itself for growth work. Here's where the course helps and where it falls short.",
    section: 'data-driven-marketing',
    category: 'Course Review',
    topic: 'Course Reviews',
    industry: 'All industries',
    date: 'Jun 22, 2026',
    readTimeFallback: '10 min read',
    thumbnailVariant: 'course-review',
    href: '/blog/category/marketing-analytics/',
  },
  {
    id: '5-dashboard-metrics-that-predict-growth',
    slug: '5-dashboard-metrics-that-predict-growth',
    title: '5 Dashboard Metrics That Actually Predict Growth',
    excerpt: 'Focus on the signals that matter, not the noise that flatters.',
    section: 'data-driven-marketing',
    category: 'Analytics',
    topic: 'Marketing Analytics',
    industry: 'SaaS',
    date: 'Jun 20, 2026',
    readTimeFallback: '5 min read',
    thumbnailVariant: 'dashboard-metrics',
    href: '/blog/category/marketing-analytics/',
  },
  {
    id: 'retargeting-plus-email-rented-to-owned',
    slug: 'retargeting-plus-email-rented-to-owned',
    title: 'Retargeting + Email: Convert Ad Spend to Owned Revenue',
    excerpt:
      'Stop renting attention. Use retargeting to capture demand and turn paid traffic into owned relationships.',
    section: 'data-driven-marketing',
    category: 'Strategy & Growth',
    topic: 'Strategy & Growth',
    industry: 'Ecommerce',
    date: 'Jun 18, 2026',
    readTimeFallback: '7 min read',
    thumbnailVariant: 'email-retargeting',
    href: '/retargeting-plus-email-rented-to-owned/',
  },

  // ─── Case Studies ────────────────────────────────────────────────────────────

  {
    id: 'cs-spa-booking-decline',
    slug: 'cs-spa-booking-decline',
    title: 'A Spa Closed After 6 Years. The Booking Data Was Already Warning Her.',
    excerpt:
      'A local spa owner blamed rising costs and slow bookings. The deeper problem was visible earlier in retention, offer, and appointment data.',
    section: 'case-studies',
    category: 'Beauty & Wellness',
    topic: 'Marketing Analytics',
    industry: 'Beauty & Wellness',
    sourceLabel: 'Public business story',
    date: 'Jun 26, 2026',
    readTimeFallback: '8 min read',
    thumbnailVariant: 'spa-booking-decline',
    href: '/agora-portfolio/',
  },
  {
    id: 'cs-meta-data-signals',
    slug: 'cs-meta-data-signals',
    title: 'How Meta Turned Better Data Signals Into an Advertising Advantage',
    excerpt:
      "Meta's growth story is not only about scale. It is also about improving data feedback loops, ad ranking, and measurement.",
    section: 'case-studies',
    category: 'Big Tech',
    topic: 'Marketing Analytics',
    industry: 'Big Tech',
    sourceLabel: 'Company strategy',
    date: 'Jun 24, 2026',
    readTimeFallback: '7 min read',
    thumbnailVariant: 'meta-data-signals',
    href: '/agora-portfolio/',
  },
  {
    id: 'cs-shopify-sales-decline',
    slug: 'cs-shopify-sales-decline',
    title: "This Shopify Store Lost 80% of Sales in 30 Days. The Problem Wasn't Just iOS.",
    excerpt:
      'From poor retention loops to overreliance on paid traffic, we break down the compounding mistakes behind the crash.',
    section: 'case-studies',
    category: 'Ecommerce',
    topic: 'Paid Marketing',
    industry: 'Ecommerce',
    sourceLabel: 'Public business story',
    date: 'Jun 22, 2026',
    readTimeFallback: '7 min read',
    thumbnailVariant: 'shopify-sales-decline',
    href: '/agora-portfolio/',
  },
  {
    id: 'cs-saas-churn',
    slug: 'cs-saas-churn',
    title: 'A SaaS Founder Blamed Ads for Churn. The Funnel Told a Different Story.',
    excerpt:
      'The acquisition channel was not the real problem. The activation and retention data revealed the bigger issue.',
    section: 'case-studies',
    category: 'SaaS',
    topic: 'Strategy & Growth',
    industry: 'SaaS',
    sourceLabel: 'Startup breakdown',
    date: 'Jun 20, 2026',
    readTimeFallback: '8 min read',
    thumbnailVariant: 'saas-churn',
    href: '/agora-portfolio/',
  },
  {
    id: 'cs-gym-retention-loop',
    slug: 'cs-gym-retention-loop',
    title: 'A Local Gym Grew Without Paid Ads. Their Retention Loop Did the Work.',
    excerpt:
      'A simple member referral loop and better follow-up system created growth without increasing ad spend.',
    section: 'case-studies',
    category: 'Local Business',
    topic: 'Organic Growth',
    industry: 'Local Business',
    sourceLabel: 'Market observation',
    date: 'Jun 18, 2026',
    readTimeFallback: '6 min read',
    thumbnailVariant: 'gym-retention-loop',
    href: '/agora-portfolio/',
  },
  {
    id: 'cs-restaurant-demand-pattern',
    slug: 'cs-restaurant-demand-pattern',
    title: 'The Restaurant That Filled Weeknights With a Better Offer, Not a Bigger Budget',
    excerpt:
      'The winning move was not more ads. It was understanding demand patterns and packaging the right offer.',
    section: 'case-studies',
    category: 'Hospitality',
    topic: 'Strategy & Growth',
    industry: 'Hospitality',
    sourceLabel: 'Public business story',
    date: 'Jun 16, 2026',
    readTimeFallback: '6 min read',
    thumbnailVariant: 'restaurant-demand-pattern',
    href: '/agora-portfolio/',
  },
  {
    id: 'cs-content-engine',
    slug: 'cs-content-engine',
    title: "Why Duolingo's Growth Looks Chaotic but Is Actually Disciplined",
    excerpt:
      'Behind the viral content is a disciplined understanding of audience behavior, brand memory, and distribution.',
    section: 'case-studies',
    category: 'Consumer Apps',
    topic: 'Organic Growth',
    industry: 'Education',
    sourceLabel: 'Brand strategy',
    date: 'Jun 14, 2026',
    readTimeFallback: '7 min read',
    thumbnailVariant: 'content-engine',
    href: '/agora-portfolio/',
  },
  {
    id: 'cs-skincare-profit-growth',
    slug: 'cs-skincare-profit-growth',
    title: 'DTC Skincare Brand Scaled Profits Without Raising Ad Spend',
    excerpt:
      'Better retention, offer sequencing, and CRO improvements changed the unit economics before scaling spend.',
    section: 'case-studies',
    category: 'Ecommerce',
    topic: 'Strategy & Growth',
    industry: 'Ecommerce',
    sourceLabel: 'Brand breakdown',
    date: 'Jun 12, 2026',
    readTimeFallback: '7 min read',
    thumbnailVariant: 'skincare-profit-growth',
    href: '/agora-portfolio/',
  },
];
