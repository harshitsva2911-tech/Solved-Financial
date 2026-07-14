import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import axios from 'axios';
import { CheckCircle, ArrowRight, Building2, CalendarDays } from 'lucide-react';

import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import FooterCTA from '../components/common/FooterCTA';
import PageHero from '../components/common/PageHero';
import AnimatedSection from '../components/common/AnimatedSection';
import API_BASE from '../utils/config';

const API = API_BASE;

/* â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
   Full fallback data (matches seed.js exactly)
â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
const FALLBACK_JURISDICTIONS = {
  cyprus: {
    _id: 'cy',
    country: 'Cyprus',
    slug: 'cyprus',
    flagCode: 'cy',
    tagline: 'A strategic gateway for international business within the EU.',
    intro:
      'Cyprus offers one of the most business-friendly regulatory environments in Europe, combining a competitive tax framework, strong legal infrastructure, and full EU membership. Solved Financial Services leverages deep local expertise to support businesses establishing or expanding their presence in Cyprus.',
    partnerFirm: null,
    strategyPivot: {
      heading: 'Strategy Pivot',
      points: [
        {
          title: 'Low Corporate Tax',
          description:
            'Cyprus maintains one of the lowest corporate tax rates in the EU at 12.5%, making it highly attractive for holding and trading structures.',
        },
        {
          title: 'EU Compliant',
          description:
            'Full compliance with EU directives ensures access to European markets while maintaining a competitive regulatory environment.',
        },
      ],
    },
    services: [
      {
        title: 'Accounting & Financial Structuring',
        description:
          'Comprehensive accounting services tailored to Cyprus-based entities, including statutory compliance and financial reporting.',
        features: [
          'Statutory financial statements',
          'Regulatory filings',
          'VAT compliance',
          'Corporate tax returns',
        ],
      },
      {
        title: 'Corporate & Financial Structuring',
        description:
          'Strategic structuring of corporate entities to optimise tax efficiency and operational effectiveness within Cyprus.',
        features: [
          'Holding company structures',
          'Tax planning',
          'Shareholder agreements',
          'Group structuring',
        ],
      },
      {
        title: 'CFO & Board Advisory',
        description:
          'Senior financial leadership and strategic advisory for Cyprus-registered entities and their global management teams.',
        features: [
          'Cyprus-specific regulatory guidance',
          'Financial reporting oversight',
          'Board-level presentations',
          'Investor communication',
        ],
      },
      {
        title: 'Company Incorporation',
        description:
          'Full service company formation in Cyprus including nominee services, registered office, and compliance setup.',
        features: [
          'Company registration',
          'Nominee directors',
          'Registered office',
          'Bank account support',
        ],
      },
      {
        title: 'Audit & Assurance Services',
        description:
          'Coordination of statutory audit requirements in accordance with Cyprus regulatory obligations through our local partner network.',
        features: [
          'Audit coordination',
          'Financial due diligence',
          'Regulatory compliance',
          'Audit readiness',
        ],
      },
    ],
  },
  netherlands: {
    _id: 'nl',
    country: 'Netherlands',
    slug: 'netherlands',
    flagCode: 'nl',
    tagline: "Europe's leading gateway for international trade and finance.",
    intro:
      'The Netherlands is renowned for its pro-business environment, sophisticated financial infrastructure, and strategic location at the heart of Europe. It remains the preferred jurisdiction for multinational headquarters, holding structures, and international trading companies.',
    partnerFirm: null,
    strategyPivot: {
      heading: 'Strategy Pivot',
      points: [
        {
          title: 'International Hub',
          description:
            'Amsterdam serves as a major European financial hub with excellent connectivity to global markets and a highly skilled workforce.',
        },
        {
          title: 'Advanced Tax Framework',
          description:
            'The participation exemption, extensive treaty network, and ruling practice make the Netherlands a top choice for international structuring.',
        },
      ],
    },
    services: [
      {
        title: 'Accounting & Financial Administration',
        description:
          'Full-cycle accounting and financial administration for Netherlands-based entities, ensuring Dutch GAAP compliance.',
        features: [
          'Dutch GAAP compliance',
          'Annual accounts preparation',
          'VAT declarations',
          'Payroll administration',
        ],
      },
      {
        title: 'Finance Setup & Structuring',
        description:
          'Establishing robust financial frameworks for newly formed or expanding Netherlands entities.',
        features: [
          'Finance function setup',
          'System implementation',
          'Process documentation',
          'Internal controls',
        ],
      },
      {
        title: 'CFO & Strategic Advisory',
        description:
          'Strategic financial guidance for businesses using the Netherlands as their European base of operations.',
        features: [
          'Holding structure advice',
          'Group financial oversight',
          'Reporting to international boards',
          'Budget & forecast management',
        ],
      },
      {
        title: 'Operations & Performance Advisory',
        description:
          'Financial analysis and performance optimisation for Netherlands-based operational entities.',
        features: [
          'KPI development',
          'Cost analysis',
          'Operational efficiency',
          'Management reporting',
        ],
      },
      {
        title: 'Company Incorporation',
        description:
          'Complete BV incorporation services in the Netherlands, including compliance setup and ongoing administration.',
        features: [
          'BV formation',
          'UBO registration',
          'KVK registration',
          'Opening corporate accounts',
        ],
      },
    ],
  },
  greece: {
    _id: 'gr',
    country: 'Greece',
    slug: 'greece',
    flagCode: 'gr',
    tagline: 'An emerging strategic hub with deep European roots.',
    intro:
      'Greece presents a compelling opportunity for businesses seeking access to South-Eastern European markets. With a modernising regulatory environment, EU membership, and growing technology and shipping sectors, Greece is increasingly attractive for international investment.',
    partnerFirm: {
      name: 'Revival Consulting Services',
      description:
        'Solved Financial Services operates in Greece through its strategic partnership with Revival Consulting Services, a leading Greek advisory firm with extensive expertise in local regulatory compliance, tax advisory, and business establishment services.',
    },
    strategyPivot: {
      heading: 'Strategy Pivot',
      points: [
        {
          title: 'Emerging Market',
          description:
            "Greece's modernising economy and EU membership create attractive conditions for international investors and businesses expanding into South-Eastern Europe.",
        },
        {
          title: 'Strategic Location',
          description:
            "Greece's position as a gateway to the Balkans, Eastern Mediterranean, and Middle East makes it strategically significant for trade and logistics businesses.",
        },
      ],
    },
    services: [
      {
        title: 'Accounting & Compliance Support',
        description:
          'Full compliance accounting for Greek entities, ensuring alignment with Greek GAAP and tax regulations.',
        features: [
          'Greek GAAP compliance',
          'Corporate tax returns',
          'VAT management',
          'Regulatory filings',
        ],
      },
      {
        title: 'Corporate & Business Advisory',
        description:
          'Strategic advisory for businesses establishing or growing their Greek presence, including sector-specific guidance.',
        features: [
          'Business setup advisory',
          'Regulatory guidance',
          'Strategic planning',
          'Market entry support',
        ],
      },
      {
        title: 'Financial & Strategic Advisory',
        description:
          'Senior financial advisory services for Greek entities, covering financial structuring, planning, and investor relations.',
        features: [
          'Financial modelling',
          'Investor presentations',
          'Funding strategy',
          'CFO-level guidance',
        ],
      },
      {
        title: 'Audit & Assurance (via Partner Network)',
        description:
          'Statutory audit coordination through Revival Consulting Services in compliance with Greek regulatory requirements.',
        features: [
          'Statutory audit',
          'Financial due diligence',
          'Internal controls review',
          'Audit support',
        ],
      },
    ],
  },
};

/* Figma jurisdiction hero photos */
const JURISDICTION_HERO_PHOTOS = {
  cyprus: 'https://imperial-ventures-assets.s3.eu-north-1.amazonaws.com/website/jurisdiction-detail-photo-1.png',
  netherlands: 'https://imperial-ventures-assets.s3.eu-north-1.amazonaws.com/website/jurisdiction-detail-photo-2.png',
  greece: 'https://imperial-ventures-assets.s3.eu-north-1.amazonaws.com/website/jurisdiction-detail-photo-3.png',
};

/* Real service images from Figma */
const SERVICE_IMAGES = [
  'https://imperial-ventures-assets.s3.eu-north-1.amazonaws.com/website/service-cfo-advisory.png',
  'https://imperial-ventures-assets.s3.eu-north-1.amazonaws.com/website/service-accounting.png',
  'https://imperial-ventures-assets.s3.eu-north-1.amazonaws.com/website/service-operations-advisory.png',
  'https://imperial-ventures-assets.s3.eu-north-1.amazonaws.com/website/service-finance-setup.png',
];

/* Gradient fallback for service images */
const SERVICE_GRADIENTS = [
  'linear-gradient(135deg, #001B2F 0%, #0d3a5c 55%, #D4B684 100%)',
  'linear-gradient(135deg, #0a2a42 0%, #001B2F 60%, #B89A60 100%)',
  'linear-gradient(135deg, #001B2F 0%, #1a4a70 50%, #E8D4A8 100%)',
  'linear-gradient(135deg, #0f3550 0%, #001B2F 65%, #D4B684 100%)',
  'linear-gradient(135deg, #001B2F 0%, #0a3355 50%, #E8D4A8 100%)',
];

/* â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
   Strategy Pivot Section
â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
function StrategyPivot({ strategyPivot, intro }) {
  const ref = useRef(null);
  const inView = useInView(ref, { amount: 0.15, once: true });

  if (!strategyPivot || !strategyPivot.points?.length) return null;

  return (
    <section className="py-16 lg:py-20 bg-white" ref={ref} aria-labelledby="strategy-heading">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Label + heading */}
        <AnimatedSection className="mb-10">
          <span className="block text-gold text-xs font-semibold uppercase tracking-[0.2em] mb-3">
            Strategy Pivot
          </span>
          <h2
            id="strategy-heading"
            className="font-urbanist font-bold text-midnight text-3xl sm:text-4xl leading-tight tracking-tight"
          >
            {strategyPivot.heading ?? 'Strategic Advantage'}
          </h2>
        </AnimatedSection>

        {/* Two-column: intro text | bullet points */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start">
          {/* Left â€” intro */}
          {intro && (
            <AnimatedSection direction="left">
              <p className="text-gray-600 text-base leading-relaxed">{intro}</p>
            </AnimatedSection>
          )}

          {/* Right â€” points */}
          <div className="space-y-8">
            {strategyPivot.points.map((point, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: 28 }}
                animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: 28 }}
                transition={{ duration: 0.5, delay: i * 0.13, ease: [0.22, 1, 0.36, 1] }}
              >
                <div className="flex items-center gap-3 mb-2">
                  <span className="w-5 h-[2px] bg-gold flex-shrink-0" />
                  <h3 className="font-bold text-midnight text-base">{point.title}</h3>
                </div>
                <p className="text-gray-500 text-sm leading-relaxed pl-8">{point.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
   Helpers
â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
function toSlug(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

function useActiveSection(ids) {
  const [activeId, setActiveId] = useState(ids[0] ?? '');

  useEffect(() => {
    if (ids.length === 0) return;
    const observers = [];
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActiveId(id); },
        { rootMargin: '-40% 0px -50% 0px', threshold: 0 }
      );
      obs.observe(el);
      observers.push(obs);
    });
    return () => observers.forEach((o) => o.disconnect());
  }, [ids]);

  return activeId;
}

/* â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
   Sticky service tab bar
â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
function ServiceTabBar({ services, activeId }) {
  const scrollTo = useCallback((id) => {
    const el = document.getElementById(id);
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY - 88;
    window.scrollTo({ top, behavior: 'smooth' });
  }, []);

  return (
    <div
      className="sticky top-[80px] z-30 bg-white border-b border-gray-200 shadow-sm"
      role="tablist"
      aria-label="Services navigation"
    >
      <div
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-0 overflow-x-auto"
        style={{ scrollbarWidth: 'none' }}
      >
        {services.map((service) => {
          const id = toSlug(service.title);
          const isActive = id === activeId;
          return (
            <button
              key={id}
              role="tab"
              aria-selected={isActive}
              onClick={() => scrollTo(id)}
              className={`relative flex-shrink-0 px-4 py-4 text-sm font-medium tracking-wide transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold whitespace-nowrap
                ${isActive ? 'text-gold' : 'text-gray-500 hover:text-midnight'}`}
            >
              {service.title}
              {isActive && (
                <motion.span
                  layoutId="jurisdiction-tab-underline"
                  className="absolute bottom-0 left-0 right-0 h-[2px] bg-gold rounded-full"
                  transition={{ type: 'spring', stiffness: 380, damping: 34 }}
                />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
   Individual service block
â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
function ServiceBlock({ service, index }) {
  const ref = useRef(null);
  const inView = useInView(ref, { amount: 0.12, once: true });
  const isEven = index % 2 === 0;
  const gradient = SERVICE_GRADIENTS[index % SERVICE_GRADIENTS.length];
  const serviceImg = SERVICE_IMAGES[index % SERVICE_IMAGES.length];
  const id = toSlug(service.title);

  const textContent = (
    <div className="flex flex-col justify-center h-full">
      <div className="flex items-center gap-3 mb-5">
        <span className="w-8 h-[3px] rounded-full bg-gold flex-shrink-0" />
        <span className="text-gold text-xs font-semibold uppercase tracking-[0.18em]">
          Our Services
        </span>
      </div>
      <h2 className="font-urbanist font-bold text-midnight text-2xl sm:text-3xl leading-tight mb-5">
        {service.title}
      </h2>
      <p className="text-gray-500 text-base leading-relaxed mb-7">{service.description}</p>
      {service.features && service.features.length > 0 && (
        <ul className="space-y-3 mb-8">
          {service.features.map((feat) => (
            <li key={feat} className="flex items-start gap-3">
              <CheckCircle size={17} className="text-gold flex-shrink-0 mt-0.5" />
              <span className="text-gray-600 text-sm">{feat}</span>
            </li>
          ))}
        </ul>
      )}
      <Link
        to="/contact"
        className="inline-flex items-center gap-2.5 px-6 py-3 rounded-sm bg-gold text-midnight font-semibold text-sm tracking-wide hover:bg-gold-dark transition-colors duration-200 self-start group focus:outline-none focus-visible:ring-2 focus-visible:ring-gold"
      >
        <CalendarDays size={15} />
        Book Consultation
        <ArrowRight size={14} className="transition-transform duration-200 group-hover:translate-x-1" />
      </Link>
    </div>
  );

  const imageContent = (
    <div
      className="relative w-full h-72 lg:h-full min-h-[320px] rounded-lg overflow-hidden"
      aria-hidden="true"
    >
      {serviceImg ? (
        <img src={serviceImg} alt="" className="w-full h-full object-cover" />
      ) : (
        <div className="w-full h-full" style={{ background: gradient }}>
          <div
            className="absolute inset-0"
            style={{ background: 'radial-gradient(ellipse at 65% 35%, rgba(212,182,132,0.14) 0%, transparent 60%)' }}
          />
          <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-midnight/25 to-transparent" />
          <div className="absolute top-6 left-6">
            <span className="text-gold/15 font-bold text-8xl leading-none select-none">
              {String(index + 1).padStart(2, '0')}
            </span>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <section
      id={id}
      ref={ref}
      className={`py-16 lg:py-24 ${isEven ? 'bg-white' : 'bg-cream'}`}
      aria-labelledby={`service-title-${id}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 32 }}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center"
        >
          {isEven ? (
            <>
              <div>{textContent}</div>
              <div>{imageContent}</div>
            </>
          ) : (
            <>
              <div className="order-2 lg:order-1">{imageContent}</div>
              <div className="order-1 lg:order-2">{textContent}</div>
            </>
          )}
        </motion.div>
      </div>
    </section>
  );
}

/* â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
   Services Section (all visible, stacked)
â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
function ServicesSection({ services }) {
  const ids = (services ?? []).map((s) => toSlug(s.title));
  const activeId = useActiveSection(ids);

  if (!services || services.length === 0) return null;

  return (
    <>
      <ServiceTabBar services={services} activeId={activeId} />
      {services.map((service, i) => (
        <ServiceBlock key={service.title} service={service} index={i} />
      ))}
    </>
  );
}

/* â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
   JurisdictionDetail Page
â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
export default function JurisdictionDetail() {
  const { slug } = useParams();
  const [jurisdiction, setJurisdiction] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    setLoading(true);
    setError(false);

    axios
      .get(`${API}/jurisdictions/${slug}`)
      .then((res) => {
        const data = res.data?.data ?? res.data;
        setJurisdiction(data ?? FALLBACK_JURISDICTIONS[slug] ?? null);
      })
      .catch(() => {
        const fallback = FALLBACK_JURISDICTIONS[slug];
        if (fallback) {
          setJurisdiction(fallback);
        } else {
          setError(true);
        }
      })
      .finally(() => setLoading(false));
  }, [slug]);

  /* Loading state */
  if (loading) {
    return (
      <div className="min-h-screen bg-midnight flex flex-col">
        <Navbar />
        <div className="h-[80px]" aria-hidden="true" />
        <div className="flex-1 flex flex-col items-center justify-center gap-4">
          <div
            className="w-10 h-10 rounded-full border-2 border-t-transparent animate-spin"
            style={{ borderColor: '#D4B684 transparent transparent transparent' }}
          />
          <span className="text-sm text-gray-400 tracking-widest uppercase">Loading</span>
        </div>
      </div>
    );
  }

  /* 404 state */
  if (error || !jurisdiction) {
    return (
      <div className="min-h-screen bg-cream flex flex-col">
        <Navbar />
        <div className="h-[80px]" aria-hidden="true" />
        <div className="flex-1 flex flex-col items-center justify-center px-4 text-center">
          <h1 className="text-4xl font-bold text-midnight mb-4">Jurisdiction not found</h1>
          <p className="text-gray-500 mb-8">
            The jurisdiction "{slug}" could not be found.
          </p>
          <Link
            to="/jurisdictions"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-sm bg-gold text-midnight font-semibold text-sm hover:bg-gold-dark transition-colors duration-200"
          >
            <ArrowRight size={15} />
            Back to Jurisdictions
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const { country, tagline, intro, partnerFirm, strategyPivot, services, flagCode, slug: jSlug } =
    jurisdiction;
  const resolvedFlagCode = flagCode ?? jSlug ?? slug;
  const flagBgUrl =
    JURISDICTION_HERO_PHOTOS[slug] ??
    `https://flagcdn.com/w1280/${resolvedFlagCode}.png`;
  const isGreece = slug === 'greece' || resolvedFlagCode === 'gr';

  return (
    <div className="bg-cream min-h-screen">
      <Navbar />

      {/* 1. Hero with flag background */}
      <PageHero
        title={country}
        subtitle={tagline}
        bgImage={flagBgUrl}
        breadcrumb={[
          { label: 'Home', to: '/' },
          { label: 'Jurisdictions', to: '/jurisdictions' },
          { label: country },
        ]}
        minHeight="min-h-[480px]"
      />

      {/* 2. Greece partner firm banner (Greece only) */}
      {isGreece && partnerFirm && (
        <section className="pb-12 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <AnimatedSection>
              <div className="border border-gold/40 bg-gold/5 rounded-lg px-7 py-6 flex gap-4 items-start">
                <Building2 size={22} className="text-gold flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-midnight font-semibold text-sm mb-1">
                    Strategic Partnership &mdash; {partnerFirm.name}
                  </p>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    Solved Financial Services operates in Greece through its strategic
                    partnership with{' '}
                    <span className="font-semibold text-midnight">{partnerFirm.name}</span>.{' '}
                    {partnerFirm.description &&
                      !partnerFirm.description.startsWith(
                        'Solved Financial Services operates in Greece'
                      ) &&
                      partnerFirm.description}
                  </p>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </section>
      )}

      {/* 3. Strategy Pivot */}
      <StrategyPivot strategyPivot={strategyPivot} intro={intro} />

      {/* 4. Services */}
      <ServicesSection services={services ?? []} />

      <FooterCTA />
      <Footer />
    </div>
  );
}
