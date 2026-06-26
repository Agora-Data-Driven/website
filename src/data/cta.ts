/**
 * Canonical calls-to-action. Real destinations preserved from the live site.
 * Reference these everywhere instead of hard-coding URLs.
 */
export interface Cta {
  label: string;
  href: string;
  external: boolean;
}

const UPWORK_AGENCY = 'https://www.upwork.com/agencies/1818954484693860352/';

export const cta = {
  /** Primary conversion: drives prospective clients to the Upwork agency page. */
  becomeClient: {
    label: 'Become a client',
    href: UPWORK_AGENCY,
    external: true,
  },
  /** Hiring funnel. */
  joinTeam: {
    label: 'Join the Team',
    href: 'https://apply.agoradatadriven.com',
    external: true,
  },
  /** Existing-client sign-in to the Agora portal. */
  clientLogin: {
    label: 'Client Log in',
    href: 'https://portal.agoradatadriven.com/login',
    external: true,
  },
  /** Replaces the old fake pricing tiers — routes to Upwork for a custom quote. */
  customQuote: {
    label: 'Get a custom quote',
    href: UPWORK_AGENCY,
    external: true,
  },
} satisfies Record<string, Cta>;
