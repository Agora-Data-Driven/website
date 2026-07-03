/** Navigation model. Slugs match the live site 1:1 for SEO continuity. */
export interface NavItem {
  label: string;
  href: string;
  external?: boolean;
  children?: NavItem[];
}

/**
 * AGORA Mastery Engine — a separate Cloud Run app (project `agora-data-driven`).
 * `skillMasteryUrl` is the live app origin; we embed it (iframe) on the internal
 * `skillMasteryPath` page rather than linking out, so nav points at the path.
 * TODO: swap the origin for https://mastery.agoradatadriven.com once a Cloud Run
 * domain mapping + DNS record are set up (matches the webdev./apply. pattern).
 */
export const skillMasteryUrl = 'https://mastery-engine-c732u7m57a-uc.a.run.app';
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
  { label: 'Blog', href: '/blog/' },
  { label: 'Tools & Insights', href: '/tools/' },
  // "LED Wall" points to the real flagship article slug (preserved for SEO).
  { label: 'LED Wall', href: '/building-an-authentic-brand-identity/' },
];

export const footerNav: NavItem[] = [
  { label: 'Home', href: '/' },
  { label: 'Portfolio', href: '/agora-portfolio/' },
  { label: 'Blog', href: '/blog/' },
  { label: 'Tools & Insights', href: '/tools/' },
  { label: 'LED Wall', href: '/building-an-authentic-brand-identity/' },
  { label: 'Skill Mastery', href: skillMasteryPath },
];

export const legalNav: NavItem[] = [
  { label: 'Terms & Conditions', href: '/terms/' },
  { label: 'Privacy Policy', href: '/privacy/' },
];
