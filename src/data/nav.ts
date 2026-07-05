/** Navigation model. Slugs match the live site 1:1 for SEO continuity. */
export interface NavItem {
  label: string;
  href: string;
  external?: boolean;
  children?: NavItem[];
}

/**
 * AGORA Mastery Engine, a separate Cloud Run app (project `agora-data-driven`).
 * `skillMasteryUrl` is the live app origin; we embed it (iframe) on the internal
 * `skillMasteryPath` page rather than linking out, so nav points at the path.
 * On its own `mastery.agoradatadriven.com` custom domain (Cloud Run domain mapping,
 * CNAME → ghs.googlehosted.com) so it's same-site with this site: the shared
 * `.agoradatadriven.com` ag_sso cookie flows into the iframe — no second sign-in.
 */
export const skillMasteryUrl = 'https://mastery.agoradatadriven.com';
export const skillMasteryPath = '/skill-mastery/';

export const mainNav: NavItem[] = [
  { label: 'Home', href: '/' },
  {
    label: 'Portfolio',
    href: '/agora-portfolio/',
    children: [
      { label: 'Marketing & Analytics', href: '/agora-portfolio/' },
      { label: 'Web Development', href: 'https://webdev.agoradatadriven.com/', external: true },
      { label: 'Skill Mastery', href: skillMasteryPath },
    ],
  },
  {
    label: 'Tools & Insights',
    href: '/skill-tests/',
    children: [
      { label: 'Skill Tests', href: '/skill-tests/' },
      { label: 'Blog', href: '/blog/' },
    ],
  },
  // "LED Wall" points to the real flagship article slug (preserved for SEO).
  { label: 'LED Wall', href: '/building-an-authentic-brand-identity/' },
];

export const footerNav: NavItem[] = [
  { label: 'Home', href: '/' },
  { label: 'Portfolio', href: '/agora-portfolio/' },
  { label: 'Skill Tests', href: '/skill-tests/' },
  { label: 'Blog', href: '/blog/' },
  { label: 'LED Wall', href: '/building-an-authentic-brand-identity/' },
  { label: 'Skill Mastery', href: skillMasteryPath },
];

export const legalNav: NavItem[] = [
  { label: 'Terms & Conditions', href: '/terms/' },
  { label: 'Privacy Policy', href: '/privacy/' },
];
