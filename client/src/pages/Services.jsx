import { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import axios from 'axios';
import { CheckCircle, ArrowRight, CalendarDays } from 'lucide-react';

import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import FooterCTA from '../components/common/FooterCTA';
import PageHero from '../components/common/PageHero';

const HERO_BG = 'https://imperial-ventures-assets.s3.eu-north-1.amazonaws.com/website/hero-services.png';

const API = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

/* â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
   Fallback services (mirrors seed.js)
â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
const FALLBACK_SERVICES = [
  {
    _id: '1',
    title: 'CFO & Strategic Advisory',
    slug: 'cfo-strategic-advisory',
    image: 'https://imperial-ventures-assets.s3.eu-north-1.amazonaws.com/website/service-cfo-advisory.png',
    description:
      'Solved Financial Services provides CFO-level expertise to founders, management teams, and boards requiring senior financial leadership, strategic insight, and decision-making support. We act as your trusted financial co-pilot — bridging the gap between strategy and execution.',
    features: [
      'Strategic financial planning',
      'Board-level reporting',
      'Investor relations support',
      'KPI frameworks & dashboards',
      'Business model optimisation',
    ],
  },
  {
    _id: '2',
    title: 'Finance Setup & Structuring',
    slug: 'finance-setup-structuring',
    image: 'https://imperial-ventures-assets.s3.eu-north-1.amazonaws.com/website/service-finance-setup.png',
    description:
      'We design and implement structured financial ecosystems that support sustainable growth. From establishing a new finance function to restructuring an existing one, we provide the framework for high-performance financial management.',
    features: [
      'Chart of accounts setup',
      'Financial process design',
      'Accounting system implementation',
      'Reporting infrastructure',
      'Financial controls framework',
    ],
  },
  {
    _id: '3',
    title: 'Accounting & Financial Administration',
    slug: 'accounting-financial-administration',
    image: 'https://imperial-ventures-assets.s3.eu-north-1.amazonaws.com/website/service-accounting.png',
    description:
      'Solved Financial Services delivers structured, compliant, and transparent financial administration tailored to the operational and regulatory needs of growing organisations. Our team handles the full spectrum of bookkeeping, reconciliations, payroll support, and financial reporting.',
    features: [
      'Bookkeeping & reconciliations',
      'VAT filing & compliance',
      'Financial statements preparation',
      'Payroll administration support',
      'Multi-currency accounting',
    ],
  },
  {
    _id: '4',
    title: 'Operations & Performance Advisory',
    slug: 'operations-performance-advisory',
    image: 'https://imperial-ventures-assets.s3.eu-north-1.amazonaws.com/website/service-operations-advisory.png',
    description:
      'We help leadership teams understand the financial drivers behind their operations. By linking financial data to operational KPIs, we support better decision-making and performance improvement across the business.',
    features: [
      'Cost optimisation strategies',
      'Supply chain financial analysis',
      'Performance management systems',
      'Operational budgeting',
      'Variance analysis & reporting',
    ],
  },
  {
    _id: '5',
    title: 'Company Incorporation',
    slug: 'company-incorporation',
    image: 'https://imperial-ventures-assets.s3.eu-north-1.amazonaws.com/website/service-company-incorporation.png',
    description:
      'Solved Financial Services supports entrepreneurs and businesses seeking to establish or restructure their legal presence in Cyprus, Netherlands, and Greece. We manage the full incorporation process, including nominee services, regulatory filings, and post-incorporation setup.',
    features: [
      'Jurisdiction selection advice',
      'Full incorporation process',
      'Nominee director services',
      'Bank account opening support',
      'Post-incorporation compliance',
    ],
  },
  {
    _id: '6',
    title: 'Audit & Assurance',
    slug: 'audit-assurance',
    image: 'https://imperial-ventures-assets.s3.eu-north-1.amazonaws.com/website/service-audit-assurance.png',
    description:
      'Through our network of partner firms in Cyprus, Netherlands, and Greece, Solved Financial Services coordinates audit and assurance engagements that meet local regulatory requirements and international standards, giving stakeholders the confidence they need.',
    features: [
      'Statutory audit coordination',
      'Financial due diligence',
      'Internal audit support',
      'Regulatory compliance review',
      'Audit readiness preparation',
    ],
  },
  {
    _id: '7',
    title: 'Cross-Border & International Advisory',
    slug: 'cross-border-international-advisory',
    image: 'https://imperial-ventures-assets.s3.eu-north-1.amazonaws.com/website/service-cross-border-advisory.png',
    description:
      'Solved Financial Services provides specialist advisory for businesses operating or expanding across borders. We help clients navigate the regulatory, structural, and financial complexities of international expansion, particularly within European jurisdictions.',
    features: [
      'Cross-border tax structuring',
      'Transfer pricing advisory',
      'International entity structuring',
      'Regulatory mapping',
      'Multi-jurisdiction compliance',
    ],
  },
];

/* Placeholder gradient per service index */
const SERVICE_GRADIENTS = [
  'linear-gradient(135deg, #001B2F 0%, #0d3a5c 55%, #D4B684 100%)',
  'linear-gradient(135deg, #0a2a42 0%, #001B2F 60%, #B89A60 100%)',
  'linear-gradient(135deg, #001B2F 0%, #1a4a70 50%, #E8D4A8 100%)',
  'linear-gradient(135deg, #0f3550 0%, #001B2F 65%, #D4B684 100%)',
  'linear-gradient(135deg, #001B2F 0%, #0a3355 50%, #E8D4A8 100%)',
  'linear-gradient(135deg, #15405e 0%, #001B2F 65%, #D4B684 100%)',
  'linear-gradient(135deg, #0a2a40 0%, #001B2F 55%, #B89A60 100%)',
];

/* â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
   Sticky tab bar
â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
function ServiceTabs({ services, activeSlug }) {
  const tabsRef = useRef(null);

  const scrollToService = useCallback((slug) => {
    const el = document.getElementById(slug);
    if (!el) return;
    const offset = 80; // navbar height
    const top = el.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: 'smooth' });
  }, []);

  return (
    <div
      className="sticky top-[80px] z-30 bg-white border-b border-gray-200 shadow-sm"
      role="tablist"
      aria-label="Services navigation"
    >
      <div
        ref={tabsRef}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-1 overflow-x-auto scrollbar-hide py-0"
        style={{ scrollbarWidth: 'none' }}
      >
        {services.map((service) => {
          const isActive = service.slug === activeSlug;
          return (
            <button
              key={service.slug}
              role="tab"
              aria-selected={isActive}
              onClick={() => scrollToService(service.slug)}
              className={`relative flex-shrink-0 px-4 py-4 text-sm font-medium tracking-wide transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold whitespace-nowrap
                ${isActive ? 'text-gold' : 'text-gray-500 hover:text-midnight'}`}
            >
              {service.title}
              {isActive && (
                <motion.span
                  layoutId="services-tab-underline"
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
   Individual service section
â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
function ServiceSection({ service, index }) {
  const ref = useRef(null);
  const inView = useInView(ref, { amount: 0.15, once: true });
  const isEven = index % 2 === 0; // even: image right, odd: image left

  const gradient = SERVICE_GRADIENTS[index % SERVICE_GRADIENTS.length];

  const textContent = (
    <div className="flex flex-col justify-center h-full">
      {/* Small label */}
      <div className="flex items-center gap-3 mb-5">
        <span className="w-8 h-[3px] rounded-full bg-gold flex-shrink-0" />
        <span className="text-gold text-xs font-semibold uppercase tracking-[0.18em]">
          Our Services
        </span>
      </div>

      <h2 className="font-urbanist font-bold text-midnight leading-tight tracking-tight text-2xl sm:text-3xl lg:text-[2rem] mb-5">
        {service.title}
      </h2>

      <p className="text-gray-500 text-base leading-relaxed mb-7">{service.description}</p>

      {/* Features */}
      {service.features && service.features.length > 0 && (
        <ul className="space-y-3 mb-8">
          {service.features.map((feat) => (
            <li key={feat} className="flex items-start gap-3">
              <CheckCircle size={18} className="text-gold flex-shrink-0 mt-0.5" />
              <span className="text-gray-600 text-sm">{feat}</span>
            </li>
          ))}
        </ul>
      )}

      {/* CTA */}
      <Link
        to="/contact"
        className="inline-flex items-center gap-2.5 px-6 py-3 rounded-sm bg-gold text-midnight font-semibold text-sm tracking-wide hover:bg-gold-dark transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold self-start group"
      >
        <CalendarDays size={16} />
        Book Consultation
        <ArrowRight
          size={15}
          className="transition-transform duration-200 group-hover:translate-x-1"
        />
      </Link>
    </div>
  );

  const imageContent = (
    <div
      className="relative w-full h-72 lg:h-full min-h-[320px] rounded-lg overflow-hidden"
      aria-hidden="true"
    >
      {service.image ? (
        <img
          src={service.image}
          alt={service.title}
          className="w-full h-full object-cover"
        />
      ) : (
        <div className="w-full h-full" style={{ background: gradient }}>
          <div
            className="absolute inset-0"
            style={{
              background:
                'radial-gradient(ellipse at 70% 30%, rgba(212,182,132,0.12) 0%, transparent 65%)',
            }}
          />
          <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-midnight/30 to-transparent" />
          <div className="absolute top-6 left-6">
            <span className="text-gold/20 font-bold text-7xl leading-none select-none">
              {String(index + 1).padStart(2, '0')}
            </span>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <section
      id={service.slug}
      ref={ref}
      className={`py-16 lg:py-24 ${index % 2 === 0 ? 'bg-white' : 'bg-cream'}`}
      aria-labelledby={`service-title-${service.slug}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 32 }}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
          className={`grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center`}
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
   useActiveSection â€” tracks which service is in view
â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
function useActiveSection(slugs) {
  const [activeSlug, setActiveSlug] = useState(slugs[0] ?? '');

  useEffect(() => {
    if (slugs.length === 0) return;

    const observers = [];
    slugs.forEach((slug) => {
      const el = document.getElementById(slug);
      if (!el) return;
      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActiveSlug(slug);
        },
        { rootMargin: '-40% 0px -50% 0px', threshold: 0 }
      );
      obs.observe(el);
      observers.push(obs);
    });
    return () => observers.forEach((o) => o.disconnect());
  }, [slugs]);

  return activeSlug;
}

/* â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
   Services Page
â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
export default function Services() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(`${API}/services`)
      .then((res) => {
        const data = Array.isArray(res.data) ? res.data : res.data?.data ?? [];
        setServices(data.length > 0 ? data : FALLBACK_SERVICES);
      })
      .catch(() => setServices(FALLBACK_SERVICES))
      .finally(() => setLoading(false));
  }, []);

  const slugs = services.map((s) => s.slug);
  const activeSlug = useActiveSection(slugs);

  return (
    <div className="bg-cream min-h-screen">
      <Navbar />

      {/* 1. Hero */}
      <PageHero
        title="Our Services"
        subtitle="Comprehensive financial advisory and management services across European jurisdictions."
        breadcrumb={[{ label: 'Home', to: '/' }, { label: 'Services' }]}
        bgImage={HERO_BG}
      />

      {/* 2. Sticky tab bar */}
      {!loading && services.length > 0 && (
        <ServiceTabs services={services} activeSlug={activeSlug} />
      )}

      {/* 3. Service sections */}
      {loading ? (
        <div className="flex items-center justify-center py-32">
          <div
            className="w-10 h-10 rounded-full border-2 border-t-transparent animate-spin"
            style={{ borderColor: '#D4B684 transparent transparent transparent' }}
          />
        </div>
      ) : (
        <main>
          {services.map((service, i) => (
            <ServiceSection key={service._id ?? service.slug} service={service} index={i} />
          ))}
        </main>
      )}

      <FooterCTA />
      <Footer />
    </div>
  );
}
