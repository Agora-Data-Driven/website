/** Navigation model. Slugs match the live site 1:1 for SEO continuity. */
export interface NavItem {
  label: string;
  href: string;
  external?: boolean;
  children?: NavItem[];
}

export const mainNav: NavItem[] = [
  { label: 'Home', href: '/' },
  {
    label: 'Portfolio',
    href: '/agora-portfolio/',
    children: [
      { label: 'Marketing & Analytics', href: '/agora-portfolio/' },
      { label: 'Web Development', href: 'https://webdev.agoradatadriven.com/', external: true },
    ],
  },
  { label: 'Blog', href: '/blog/' },
  // "LED Wall" points to the real flagship article slug (preserved for SEO).
  { label: 'LED Wall', href: '/building-an-authentic-brand-identity/' },
];

export const footerNav: NavItem[] = [
  { label: 'Home', href: '/' },
  { label: 'Portfolio', href: '/agora-portfolio/' },
  { label: 'Blog', href: '/blog/' },
  { label: 'LED Wall', href: '/building-an-authentic-brand-identity/' },
];

export const legalNav: NavItem[] = [
  { label: 'Terms & Conditions', href: '/terms/' },
  { label: 'Privacy Policy', href: '/privacy/' },
];
