/**
 * Blog landing page data, source of truth for what appears on /blog/.
 *
 * Posts that already have a real markdown file in src/content/posts/ carry their
 * canonical slug href so read-time is calculated from the body. Posts without a
 * real page yet link to the most relevant existing route (category hub or
 * portfolio), no broken links.
 *
 * Adding a new post:
 *   1. Add an entry here with `section`, `thumbnailVariant`, `topic`, `industry`.
 *   2. Create the markdown file at src/content/posts/<slug>.md, it auto-appears.
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
  /** Used for topic filter, maps to the topic-filter dropdown values. */
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
    id: 'cs-gymshark-influencer-data',
    slug: 'cs-gymshark-influencer-data',
    title: 'How Gymshark Found Influencers Nobody Else Was Looking For',
    excerpt:
      'Ben Francis started Gymshark with no marketing budget. He looked at one number bigger brands ignored, engagement rate, and used it to find the fitness influencers who actually converted.',
    section: 'case-studies',
    category: 'Ecommerce',
    topic: 'Paid Marketing',
    industry: 'Ecommerce',
    sourceLabel: 'Brand strategy',
    date: 'Jun 27, 2026',
    readTimeFallback: '7 min read',
    thumbnailVariant: 'gymshark-influencer',
    href: '/cs-gymshark-influencer-data/',
  },
  {
    id: 'cs-airbnb-photography-test',
    slug: 'cs-airbnb-photography-test',
    title: 'How a Borrowed Camera and One Week of Data Saved Airbnb',
    excerpt:
      'In 2009, Airbnb was flat. Brian Chesky flew to New York, borrowed a camera, and photographed host listings himself. Revenue doubled that week.',
    section: 'case-studies',
    category: 'Hospitality',
    topic: 'Experimentation',
    industry: 'Hospitality',
    sourceLabel: 'Brand strategy',
    date: 'Jun 27, 2026',
    readTimeFallback: '7 min read',
    thumbnailVariant: 'airbnb-photography',
    href: '/cs-airbnb-photography-test/',
  },
  {
    id: 'cs-bed-bath-beyond-ltv',
    slug: 'cs-bed-bath-beyond-ltv',
    title: "The Coupon That Ate Bed Bath & Beyond's Best Customers",
    excerpt:
      'Bed Bath & Beyond mailed hundreds of millions of coupons a year with no segmentation. When they finally tried to stop, they had already trained their highest-value customers to wait.',
    section: 'case-studies',
    category: 'Ecommerce',
    topic: 'Marketing Analytics',
    industry: 'Ecommerce',
    sourceLabel: 'Public business story',
    date: 'Jun 27, 2026',
    readTimeFallback: '8 min read',
    thumbnailVariant: 'bed-bath-coupon',
    href: '/cs-bed-bath-beyond-ltv/',
  },
  {
    id: 'cs-moviepass-unit-economics',
    slug: 'cs-moviepass-unit-economics',
    title: "MoviePass Had 3 Million Subscribers and Still Didn't Know What They Cost",
    excerpt:
      'MoviePass built its pricing model on an assumption about user behaviour that it never tested. The assumption was wrong, and the company burned through tens of millions of dollars per month.',
    section: 'case-studies',
    category: 'SaaS',
    topic: 'Strategy & Growth',
    industry: 'SaaS',
    sourceLabel: 'Public business story',
    date: 'Jun 24, 2026',
    readTimeFallback: '7 min read',
    thumbnailVariant: 'moviepass-uniteconomics',
    href: '/cs-moviepass-unit-economics/',
  },
  {
    id: 'cs-blockbuster-data-blindspot',
    slug: 'cs-blockbuster-data-blindspot',
    title: 'Blockbuster Had the Data. They Just Optimised the Wrong Thing.',
    excerpt:
      'At its peak, Blockbuster had 60 million customer transaction records and $800 million a year in late fee revenue. They used the data to protect the fees. Netflix used theirs to eliminate them.',
    section: 'case-studies',
    category: 'Big Tech',
    topic: 'Strategy & Growth',
    industry: 'Big Tech',
    sourceLabel: 'Public business story',
    date: 'Jun 24, 2026',
    readTimeFallback: '8 min read',
    thumbnailVariant: 'blockbuster-netflix',
    href: '/cs-blockbuster-data-blindspot/',
  },
];
