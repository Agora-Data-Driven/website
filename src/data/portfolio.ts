/**
 * Portfolio content — real case studies and competition placements from the
 * live site (/agora-portfolio/ and the case-study-* / competition* pages).
 * Slugs preserved 1:1. Metrics are quoted only where the live site stated them;
 * where the live case study was qualitative, we do not invent numbers.
 */

export interface CaseStudy {
  slug: string;
  cardTitle: string;
  title: string;
  client: string;
  tag: string;
  summary: string;
  heroImage: string;
  sections: { heading: string; body: string[] }[];
  metrics?: { value: string; label: string }[];
}

export interface Competition {
  slug: string;
  cardTitle: string;
  title: string;
  placement: string;
  category: string;
  event: string;
  summary: string;
  heroImage: string;
  body: string[];
}

export const caseStudies: CaseStudy[] = [
  {
    slug: 'case-study-sabbathspawellnesshub',
    cardTitle: 'Service-Based & Membership',
    title: 'Service-Based & Membership: Sabbath Spa & Wellness Hub',
    client: 'Sabbath Spa & Wellness Hub',
    tag: 'Spa & Wellness',
    summary:
      'Content strategy, refined brand messaging, and geo-targeted ads turned an off-highway spa into a membership growth story.',
    heroImage: '/placeholders/cover-1.svg',
    sections: [
      {
        heading: 'Background & Context',
        body: [
          'Sabbath is a service-based spa offering massage, nail, and beauty services alongside a noodle bar and coffee. It serves young professionals, busy parents, and wellness-focused individuals through tiered memberships (Basic, Gold, Platinum, and VIP).',
        ],
      },
      {
        heading: 'Challenges & Pain Points',
        body: [
          'An off-highway location meant minimal walk-in traffic, and the business depended heavily on social media without converting consistently. There was no cohesive brand storytelling or targeted messaging, and engagement stayed low despite genuinely strong services.',
        ],
      },
      {
        heading: 'The Solution',
        body: [
          'We built a content strategy and managed social media around a branded content calendar, refined the brand messaging and visual direction, and launched geo-targeted Facebook and Instagram ads to reach the local audience. Membership-focused promotional campaigns gave people a clear reason to sign up.',
        ],
      },
      {
        heading: 'Results & Impact',
        body: [
          'Within six weeks the spa saw a sharp lift in inbound interest and bookings, along with steady growth in higher-tier membership sign-ups.',
        ],
      },
    ],
    metrics: [
      { value: '100%', label: 'increase in monthly social media inquiries (first 6 weeks)' },
      { value: '40%', label: 'increase in actual bookings' },
      { value: '200+', label: 'new followers per month' },
    ],
  },
  {
    slug: 'case-study-community-events',
    cardTitle: 'Community Events',
    title: 'Community Events: DAPAT BAYAN',
    client: 'DAPAT BAYAN',
    tag: 'Events & Civic',
    summary:
      'Campaign materials and targeted social activity built awareness for a community-events initiative, with results showing within two weeks.',
    heroImage: '/placeholders/cover-2.svg',
    sections: [
      {
        heading: 'Background & Context',
        body: [
          'DAPAT BAYAN is a community-events initiative that needed to build awareness and turnout across its audience.',
        ],
      },
      {
        heading: 'Challenges & Pain Points',
        body: [
          'Reaching and engaging the right local audience consistently, with cohesive messaging across campaign materials and social channels.',
        ],
      },
      {
        heading: 'The Solution',
        body: [
          'We produced a coordinated wave of campaign materials and ran targeted social activity to drive awareness and engagement around the events.',
        ],
      },
      {
        heading: 'Results & Impact',
        body: [
          'Results began surfacing as early as two weeks after the first wave of campaign materials went live, with consistent upward trends observed over the following 60 days.',
        ],
      },
    ],
  },
  {
    slug: 'case-study-digital-products',
    cardTitle: 'Digital Products',
    title: 'Digital Products: Legal Resources for Entrepreneurs',
    client: 'Confidential (digital products)',
    tag: 'Digital Products',
    summary:
      'Full-funnel marketing and analytics for a digital-product business selling legal resources to entrepreneurs and small business owners.',
    heroImage: '/placeholders/cover-3.svg',
    sections: [
      {
        heading: 'Background & Context',
        body: [
          'A digital-product business offering legal resources to entrepreneurs and small business owners wanted to grow sales and reach its audience more reliably.',
        ],
      },
      {
        heading: 'Challenges & Pain Points',
        body: [
          'Turning interest into a dependable flow of leads and conversions for digital products, with clear messaging that built buyer confidence.',
        ],
      },
      {
        heading: 'The Solution',
        body: [
          'We applied full-funnel marketing and analytics—sharpening positioning, supporting the funnel across channels, and tracking performance to guide decisions.',
        ],
      },
      {
        heading: 'Results & Impact',
        body: [
          'The business saw a significant improvement in performance: a steadier flow of leads, more conversions, and greater confidence in its marketing.',
        ],
      },
    ],
  },
];

export const competitions: Competition[] = [
  {
    slug: 'competition1',
    cardTitle: 'Marketing Analytics',
    title: 'Marketing Analytics — 2nd Place out of 2,459',
    placement: '2nd Place / 2,459 participants',
    category: 'Marketing Analytics',
    event: 'Codebasics Resume Project Challenge #9',
    summary:
      'Analyzed 10,000 survey responses for a beverage brand (CodeX) to deliver clear, decision-ready marketing insights.',
    heroImage: '/placeholders/cover-3.svg',
    body: [
      'In the Codebasics Resume Project Challenge #9, we placed 2nd out of 2,459 participants in the Marketing Analytics category.',
      'The brief: analyze 10,000 survey responses for the beverage brand CodeX and turn them into clear marketing insights. We focused on translating the raw survey data into findings a marketing team could actually act on—segments, preferences, and the messaging implications behind them.',
    ],
  },
  {
    slug: 'competition2',
    cardTitle: 'Operations Analytics',
    title: 'Operations Analytics — 1st Place, Cash Prize',
    placement: '1st Place · Cash prize recipient',
    category: 'Operations Analytics',
    event: 'DataCamp Datalab — Predicting Industrial Machine Downtime (Level 3)',
    summary:
      'Cleaned and analyzed industrial operations data to surface bottlenecks and cost-optimization opportunities with Python.',
    heroImage: '/placeholders/cover-2.svg',
    body: [
      'In DataCamp Datalab’s global "Predicting industrial machine downtime: Level 3" competition, we placed 1st and received the cash prize in the Operations Analytics category.',
      'The work balanced technical depth with business relevance: dataset cleaning, exploratory analysis, and business-insight generation using Python (pandas, seaborn, and matplotlib), ending in strategic recommendations focused on operational efficiency and cost optimization.',
    ],
  },
];
