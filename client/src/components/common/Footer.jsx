import { Link } from 'react-router-dom';
import SolvedLogo from './SolvedLogo';
import NewsletterSubscribe from './NewsletterSubscribe';

const LinkedInIcon = ({ size = 17 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
    <rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/>
  </svg>
);

const TwitterIcon = ({ size = 17 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.737-8.835L1.254 2.25H8.08l4.253 5.622 5.911-5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
);

const InstagramIcon = ({ size = 17 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" fill="none" stroke="currentColor" strokeWidth="2"/>
    <circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" strokeWidth="2"/>
    <circle cx="17.5" cy="6.5" r="1.5"/>
  </svg>
);


const COMPANY_LINKS = [
  { label: 'About us', to: '/about' },
  { label: 'Services', to: '/services' },
  { label: 'Industries', to: '/industries' },
  { label: 'Experience', to: '/experience' },
  { label: 'Insights', to: '/insights' },
];

const JURISDICTION_LINKS = [
  { label: 'Greece', to: '/jurisdictions/greece' },
  { label: 'Netherlands', to: '/jurisdictions/netherlands' },
  { label: 'Cyprus', to: '/jurisdictions/cyprus' },
];

const SOCIAL_LINKS = [
  {
    label: 'LinkedIn',
    href: 'https://linkedin.com',
    icon: LinkedInIcon,
  },
  {
    label: 'X (Twitter)',
    href: 'https://twitter.com',
    icon: TwitterIcon,
  },
  {
    label: 'Instagram',
    href: 'https://instagram.com',
    icon: InstagramIcon,
  },
];

const LEGAL_LINKS = [
  { label: 'Privacy Policy', to: '/privacy-policy' },
  { label: 'Terms of Service', to: '/terms-of-service' },
  { label: 'Cookie Policy', to: '/cookie-policy' },
];

function FooterLinkGroup({ title, links }) {
  return (
    <div>
      <h3 className="text-gold text-xs font-semibold uppercase tracking-[0.18em] mb-5">
        {title}
      </h3>
      <ul className="space-y-3">
        {links.map(({ label, to }) => (
          <li key={to}>
            <Link
              to={to}
              className="text-cream/60 text-sm hover:text-gold transition-colors duration-200 focus:outline-none focus-visible:text-gold"
            >
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function Footer() {
  return (
    <footer className="bg-midnight border-t border-white/10" aria-label="Site footer">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main footer content */}
        <div className="py-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8">
          {/* Brand column */}
          <div className="lg:col-span-2">
            <Link
              to="/"
              className="inline-flex items-center gap-3 group focus:outline-none focus-visible:ring-2 focus-visible:ring-gold rounded-sm mb-5"
              aria-label="Solved Financial Services — Home"
            >
              <SolvedLogo height={60} />
            </Link>

            <p className="text-cream/55 text-sm leading-relaxed max-w-xs mt-4">
              Expert financial and corporate advisory across key European jurisdictions.
              Empowering businesses with clarity, structure, and strategic insight.
            </p>

            {/* Social icons */}
            <div className="flex items-center gap-3 mt-6">
              {SOCIAL_LINKS.map(({ label, href, icon: Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-9 h-9 flex items-center justify-center rounded-sm border border-white/15
                    text-cream/60 hover:text-gold hover:border-gold/50 hover:bg-gold/5
                    transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold"
                >
                  <Icon size={17} />
                </a>
              ))}
            </div>
          </div>

          {/* Company links */}
          <FooterLinkGroup title="Company" links={COMPANY_LINKS} />

          {/* Jurisdictions links */}
          <FooterLinkGroup title="Jurisdictions" links={JURISDICTION_LINKS} />

          {/* Newsletter subscribe */}
          <NewsletterSubscribe />
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/10 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-cream/40 text-xs tracking-wide">
            &copy; 2026 Solved Financial Services. All rights reserved.
          </p>

          <nav className="flex items-center gap-5 flex-wrap justify-center" aria-label="Legal links">
            {LEGAL_LINKS.map(({ label, to }) => (
              <Link
                key={to}
                to={to}
                className="text-cream/40 text-xs hover:text-gold/80 transition-colors duration-200 focus:outline-none focus-visible:text-gold"
              >
                {label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </footer>
  );
}
