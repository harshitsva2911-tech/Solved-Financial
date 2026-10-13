import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import axios from 'axios';
import { CheckCircle, ArrowRight, CalendarDays, UploadCloud, FileText, Shield, BarChart3, Users } from 'lucide-react';

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
    tagline: 'Modern accounting. Personal support. A clearer view of your Cyprus business.',
    intro:
      'We support Cyprus companies with financial administration, practical business advice and a connected digital client experience. Submit documents, issue invoices and communicate with our team through the systems included in your agreed service package.',
    partnerFirm: null,
    strategyPivot: {
      heading: 'Local Capabilities',
      points: [
        {
          title: 'Competitive Corporate Tax',
          description:
            'Cyprus maintains a highly competitive and EU-compliant corporate tax rate, making it attractive for holding and trading structures.',
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
        title: 'M&A Advisory',
        description: 'Acquisition searches, target screening, financial analysis, financial due diligence coordination and transaction support for Cyprus businesses and investors; scope each stage explicitly.',
        features: ['Acquisition searches', 'Target screening', 'Financial analysis', 'Transaction support'],
      },
      {
        title: 'Digital Accounting & VAT',
        description: 'Bookkeeping, transaction reviews, reconciliations, VAT support, missing-document follow-up and reporting records. Explain who delivers and files each element.',
        features: ['Bookkeeping', 'Transaction reviews', 'Reconciliations', 'VAT support'],
      },
      {
        title: 'Client Invoicing & Financial Visibility',
        description: 'Invoice software setup, company branding, client access, training and agreed reports. State reporting frequency and invoice features accurately.',
        features: ['Invoice software setup', 'Company branding', 'Client access', 'Agreed reports'],
      },
      {
        title: 'Company Formation & Ongoing Support',
        description: 'Coordinate formation, accounting setup, tax/VAT registration and the handover to ongoing support. Identify partner-led legal/corporate work.',
        features: ['Coordinate formation', 'Accounting setup', 'Tax/VAT registration', 'Ongoing support'],
      },
      {
        title: 'Fractional CFO & Business Advisory',
        description: 'Cash planning, budgets, profitability reviews, forecasts and regular management discussions.',
        features: ['Cash planning', 'Budgets', 'Profitability reviews', 'Forecasts'],
      },
      {
        title: 'Corporate Structuring & Specialist Coordination',
        description: 'Financial analysis and coordination with the relevant tax/legal specialists; describe eligibility review rather than blanket benefits.',
        features: ['Financial analysis', 'Specialist coordination', 'Eligibility review', 'Tax/legal alignment'],
      },
      {
        title: 'Audit Readiness & Partner Coordination',
        description: 'Organised year-end records, schedules and responses for the independent auditor.',
        features: ['Year-end records', 'Audit schedules', 'Independent auditor coordination', 'Responses'],
      },
    ],
  },
  netherlands: {
    _id: 'nl',
    country: 'Netherlands',
    slug: 'netherlands',
    flagCode: 'nl',
    tagline: 'Financial clarity for growing businesses in the Netherlands.',
    intro:
      'From accounting and VAT to hands-on CFO support, Solved helps entrepreneurs build reliable finance processes, understand performance and plan their next stage of growth.',
    partnerFirm: null,
    strategyPivot: {
      heading: 'Local Capabilities',
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
        title: 'Accounting & VAT',
        description: 'Bookkeeping, reconciliations, VAT returns and financial reporting within the contracted scope. Separate payroll and annual accounts if they are add-ons or partner-delivered.',
        features: ['Bookkeeping', 'Reconciliations', 'VAT returns', 'Financial reporting']
      },
      {
        title: 'Fractional CFO',
        description: 'Rolling cash forecasts, budgets, management reporting, margins, board support and financial planning.',
        features: ['Cash forecasts', 'Budgets', 'Management reporting', 'Financial planning']
      },
      {
        title: 'Finance Setup & Automation',
        description: 'Accounting systems, invoicing, expense workflows, month-end processes, controls and reporting tools.',
        features: ['Accounting systems', 'Expense workflows', 'Month-end processes', 'Reporting tools']
      },
      {
        title: 'Growth & Performance Advisory',
        description: 'Unit economics, cost analysis, working capital, scenarios and decision support.',
        features: ['Unit economics', 'Cost analysis', 'Working capital', 'Decision support']
      },
      {
        title: 'International Business Support',
        description: 'Financial oversight across entities and coordination with local tax/legal advisers. Include company setup only as a clearly scoped partner-assisted service.',
        features: ['Financial oversight', 'Local adviser coordination', 'Multi-entity support', 'Partner-assisted company setup']
      },
      {
        title: 'M&A Advisory',
        description: 'Acquisition searches, target screening, financial analysis and transaction support for Dutch businesses and investors.',
        features: ['Acquisition searches', 'Target screening', 'Financial analysis', 'Transaction support']
      }
    ],
  },

};

/* Figma jurisdiction hero photos */
const JURISDICTION_HERO_PHOTOS = {
  cyprus: 'https://imperial-ventures-assets.s3.eu-north-1.amazonaws.com/website/jurisdiction-detail-photo-1.png',
  netherlands: 'https://imperial-ventures-assets.s3.eu-north-1.amazonaws.com/website/jurisdiction-detail-photo-2.png',
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
            Local Capabilities
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
        to={service.title.includes('M&A Advisory') ? '/ma-advisory' : service.title.includes('Fractional CFO') ? '/cfo-ma' : '/contact'}
        className="inline-flex items-center gap-2.5 px-6 py-3 rounded-sm bg-gold text-midnight font-semibold text-sm tracking-wide hover:bg-gold-dark transition-colors duration-200 self-start group focus:outline-none focus-visible:ring-2 focus-visible:ring-gold"
      >
        <CalendarDays size={15} />
        {service.title.includes('M&A Advisory') ? 'Discuss an Acquisition' : 'Book Consultation'}
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
function CyprusDifferentiator() {
  const ref = useRef(null);
  const inView = useInView(ref, { amount: 0.1, once: true });

  const clientWorkflows = [
    {
      title: 'Submit Purchases & Receipts',
      system: 'Configured Dext',
      desc: 'Snap receipts on your phone or forward vendor invoices by email. Automated receipt capture eliminates manual paperwork and data entry.',
      takeaway: 'I can send expenses in seconds from anywhere, without paperwork headaches.',
      icon: UploadCloud,
    },
    {
      title: 'Issue Customer Invoices',
      system: 'Branded Invoicing',
      desc: 'Create and send company-branded sales invoices directly from your configured software. Track payment status and keep revenue organized effortlessly.',
      takeaway: 'My customers get professional invoices instantly, and I get paid on time.',
      icon: FileText,
    },
    {
      title: 'Share Information & Documents',
      system: 'TaxDome Client Portal',
      desc: 'Access your dedicated, secure portal for document requests, e-signatures, messages, and task progress in one centralised hub.',
      takeaway: 'No scattered emails or missing files—everything is organized in one secure place.',
      icon: Shield,
    },
    {
      title: 'Understand Financial Performance',
      system: 'Management Reporting',
      desc: 'Receive reviewed accounting data, agreed KPI reports, and clear cash summaries to make confident, timely business decisions.',
      takeaway: 'I always have a clear, reliable view of my financial results and priorities.',
      icon: BarChart3,
    },
    {
      title: 'Get Dedicated Support',
      system: 'Named Solved Contact',
      desc: 'Work with a dedicated point of contact who knows your company inside and out, backed by structured review meetings and proactive guidance.',
      takeaway: 'I have continuous, practical guidance from people who truly know my business.',
      icon: Users,
    },
  ];

  return (
    <section className="py-24 bg-white border-y border-gray-100" ref={ref}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-center mb-16"
        >
          <span className="text-gold font-bold tracking-[0.2em] uppercase text-xs mb-4 block">Our Process</span>
          <h2 className="text-3xl sm:text-4xl font-bold font-urbanist text-midnight mb-6 leading-tight">
            A boutique service built on clear workflows
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
            With Solved, your Cyprus company benefits from an organised digital workflow backed by personal attention. You'll always know exactly how to submit records, where your files live, and who is handling your business.
          </p>
        </motion.div>

        {/* User-Perspective Workflow Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6 mt-10">
          {clientWorkflows.map((item, i) => {
            const Icon = item.icon;
            // First 3 cards span 2 columns on lg (3 across). Last 2 cards are centered with col-start-2 on lg.
            const layoutClasses = i === 3 
              ? 'lg:col-span-2 lg:col-start-2 md:col-span-1' 
              : i === 4 
              ? 'lg:col-span-2 md:col-span-2 md:max-w-md md:mx-auto lg:max-w-none lg:mx-0 w-full' 
              : 'lg:col-span-2 md:col-span-1';

            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className={`${layoutClasses} bg-gradient-to-b from-white to-[#faf8f5] rounded-2xl p-6 sm:p-7 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-gray-100 hover:border-gold/30 hover:shadow-[0_8px_30px_rgba(212,182,132,0.15)] transition-all duration-500 relative overflow-hidden group flex flex-col h-full -translate-y-0 hover:-translate-y-1`}
              >
                {/* Top Golden Accent Line */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-gold-light via-gold to-gold-dark opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                {/* Subtle Background Number */}
                <div className="absolute -right-4 -top-8 text-[120px] font-bold font-urbanist text-midnight/[0.03] group-hover:text-gold/5 transition-colors duration-500 pointer-events-none select-none z-0">
                  {i + 1}
                </div>

                <div className="relative z-10 flex-grow">
                  {/* Top Badge Row */}
                  <div className="flex items-center justify-between mb-5">
                    <div className="w-10 h-10 rounded-full bg-midnight shadow-[0_0_15px_rgba(212,182,132,0.2)] flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                      <Icon size={18} className="text-gold" />
                    </div>
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-gold bg-gold/10 px-3 py-1 rounded-full border border-gold/20">
                      {item.system}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-midnight mb-2.5 group-hover:text-gold-dark transition-colors duration-300">
                    {item.title}
                  </h3>
                  <p className="text-gray-600 mb-6 leading-relaxed text-sm">
                    {item.desc}
                  </p>
                </div>

                <div className="relative z-10 mt-auto pt-4 border-t border-gray-200/60">
                  <div className="flex items-start gap-2.5">
                    <span className="text-gold mt-0.5 group-hover:scale-110 transition-transform duration-300 flex-shrink-0">
                      <CheckCircle size={15} />
                    </span>
                    <p className="text-sm font-semibold text-midnight/80 italic leading-snug">
                      "{item.takeaway}"
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-12 bg-cream border-l-4 border-gold p-6 rounded-r-lg max-w-4xl mx-auto"
        >
          <p className="text-sm text-gray-700 leading-relaxed italic">
            * Note: We focus on client benefits over software brands. Automatic Dext-to-TaxDome integration, real-time accurate books, automated payments, instant VAT registration, and universal access depend on specific configurations. Reporting is subject to complete records and review.
          </p>
        </motion.div>
      </div>
    </section>
  );
}

function CyprusEngagementLevels() {
  const ref = useRef(null);
  const inView = useInView(ref, { amount: 0.1, once: true });

  const levels = [
    {
      level: 'Accounting Essentials',
      tier: 'Tier 01',
      icon: FileText,
      description: 'Foundational financial administration ensuring accurate books and full regulatory compliance.',
      included: 'Document capture, bookkeeping, reconciliations and agreed compliance support.',
      points: [
        'Document capture & bookkeeping',
        'Bank reconciliations & ledger updates',
        'Agreed compliance & VAT support'
      ]
    },
    {
      level: 'Accounting & Business Insight',
      tier: 'Tier 02',
      icon: BarChart3,
      description: 'Management reporting and periodic financial reviews to give founders complete visibility.',
      included: 'Essentials plus management reports and scheduled financial reviews.',
      points: [
        'All Accounting Essentials included',
        'Periodic management reporting pack',
        'Scheduled strategic financial reviews'
      ]
    },
    {
      level: 'CFO Partnership',
      tier: 'Tier 03',
      icon: Users,
      description: 'High-level financial leadership, cash runway planning, and strategic guidance for growing companies.',
      included: 'Reporting plus forecasting, budgets, cash planning and senior advisory.',
      points: [
        'Rolling cash flow forecasting & budgeting',
        'Unit economics & profitability modeling',
        'Senior advisory & executive guidance'
      ]
    },
    {
      level: 'Setup projects',
      tier: 'Tier 04',
      icon: Shield,
      description: 'Dedicated implementation projects for corporate formation, accounting onboarding, or software migrations.',
      included: 'Formation coordination, initial accounting/invoicing setup or system migration.',
      points: [
        'Cyprus formation coordination & structuring',
        'Digital invoicing & cloud accounting setup',
        'Historical records migration & verification'
      ]
    }
  ];

  return (
    <section className="py-24 bg-cream border-y border-gray-100" ref={ref}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-center mb-16"
        >
          <span className="text-gold font-bold tracking-[0.2em] uppercase text-xs mb-4 block">Service Tiers</span>
          <h2 className="text-4xl font-bold font-urbanist text-midnight mb-6">
            Cyprus Engagement Levels
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed mb-8">
            We offer structured engagement levels tailored to your specific business requirements. Retain premium service clarity without unnecessary overhead.
          </p>
          <Link
            to="/contact"
            className="inline-flex items-center gap-2 px-8 py-3 rounded-full bg-gold text-midnight font-bold hover:bg-midnight hover:text-white transition-all duration-300 shadow-md"
          >
            Request a Tailored Proposal
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
          className="grid grid-cols-1 md:grid-cols-2 gap-8"
        >
          {levels.map((lvl, i) => {
            const Icon = lvl.icon;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.5, delay: 0.1 * i }}
                className="group h-full"
              >
                <div className="h-full bg-white group-hover:bg-midnight rounded-2xl p-8 sm:p-9 border border-gray-100 group-hover:border-midnight shadow-sm group-hover:shadow-2xl group-hover:shadow-midnight/20 group-hover:-translate-y-1.5 transition-all duration-300 relative overflow-hidden flex flex-col justify-between">
                  {/* Subtle top golden accent bar */}
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-gold-light via-gold to-gold-dark opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  {/* Corner decorative accent */}
                  <div className="absolute top-0 right-0 w-36 h-36 bg-gold/10 rounded-bl-full -mr-16 -mt-16 transition-transform duration-500 group-hover:scale-125 pointer-events-none" />

                  <div className="relative z-10">
                    {/* Header Row: Icon & Tier Badge */}
                    <div className="flex items-center justify-between mb-6">
                      <div className="w-12 h-12 rounded-xl bg-gold/10 group-hover:bg-gold flex items-center justify-center transition-colors duration-300 shadow-sm">
                        <Icon className="w-6 h-6 text-gold group-hover:text-midnight transition-colors duration-300" />
                      </div>
                      <span className="text-xs font-bold uppercase tracking-wider text-gold bg-gold/10 group-hover:bg-gold/20 px-3.5 py-1.5 rounded-full border border-gold/20 transition-colors duration-300">
                        {lvl.tier}
                      </span>
                    </div>

                    <h3 className="text-2xl font-bold text-midnight group-hover:text-white transition-colors duration-300 font-urbanist mb-3">
                      {lvl.level}
                    </h3>

                    <p className="text-gray-600 group-hover:text-gray-300 transition-colors duration-300 text-sm leading-relaxed mb-6">
                      {lvl.description}
                    </p>

                    {/* Included Scope Box */}
                    <div className="pt-5 border-t border-gray-100 group-hover:border-white/10 transition-colors duration-300 mb-6">
                      <h4 className="text-xs font-bold text-gray-900 group-hover:text-gold uppercase tracking-wider mb-2 transition-colors duration-300">
                        Included Scope
                      </h4>
                      <p className="text-gray-600 group-hover:text-gray-300 text-sm leading-relaxed mb-4 transition-colors duration-300">
                        {lvl.included}
                      </p>

                      <ul className="space-y-2.5">
                        {lvl.points.map((pt, idx) => (
                          <li key={idx} className="flex items-start gap-2.5 text-sm text-gray-600 group-hover:text-gray-300 transition-colors duration-300">
                            <CheckCircle size={15} className="text-gold mt-0.5 flex-shrink-0" />
                            <span>{pt}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Card Action Link */}
                  <div className="relative z-10 pt-4 border-t border-gray-100 group-hover:border-white/10 transition-colors duration-300">
                    <Link
                      to="/contact"
                      className="inline-flex items-center gap-2 text-sm font-bold text-midnight group-hover:text-gold transition-colors duration-300"
                    >
                      Request this level
                      <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform duration-300" />
                    </Link>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}

function NetherlandsPositioning() {
  const ref = useRef(null);
  const inView = useInView(ref, { amount: 0.2, once: true });

  return (
    <section className="py-20 bg-white" ref={ref}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <span className="text-gold font-bold tracking-[0.2em] uppercase text-xs mb-4 block">Strategic Approach</span>
          <h2 className="text-3xl sm:text-4xl font-bold font-urbanist text-midnight mb-6 leading-tight">
            A finance partner who works alongside your business
          </h2>
          <p className="text-lg text-gray-600 leading-relaxed">
            We help Dutch businesses connect reliable financial administration with decisions about cash, costs and growth. Whether you need consistent accounting support or an experienced CFO alongside your management team, we agree the scope around your business and make the information useful.
          </p>
        </motion.div>
      </div>
    </section>
  );
}

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

  /* 404/410 state */
  if (error || !jurisdiction) {
    const isGone = slug?.toLowerCase() === 'greece';
    
    return (
      <div className="min-h-screen bg-cream flex flex-col">
        <Navbar />
        <div className="h-[80px]" aria-hidden="true" />
        <div className="flex-1 flex flex-col items-center justify-center px-4 text-center">
          <h1 className="text-4xl font-bold text-midnight mb-4">
            {isGone ? '410 - Content Removed' : 'Jurisdiction not found'}
          </h1>
          <p className="text-gray-500 mb-8">
            {isGone
              ? 'The jurisdiction profile for Greece is no longer available on this platform.'
              : `The jurisdiction "${slug}" could not be found.`}
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

  const { country, tagline, intro, strategyPivot, services, flagCode, slug: jSlug } =
    jurisdiction;
  const resolvedFlagCode = flagCode ?? jSlug ?? slug;
  const flagBgUrl =
    JURISDICTION_HERO_PHOTOS[slug] ??
    `https://flagcdn.com/w1280/${resolvedFlagCode}.png`;

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

      {/* 3. Strategy Pivot */}
      <StrategyPivot strategyPivot={strategyPivot} intro={intro} />

      {/* Jurisdiction specific sections */}
      {slug === 'netherlands' && <NetherlandsPositioning />}
      {slug === 'cyprus' && <CyprusDifferentiator />}
      
      {/* 4. Services */}
      <ServicesSection services={services ?? []} />

      {/* Bottom Jurisdiction specific sections */}
      {slug === 'cyprus' && <CyprusEngagementLevels />}

      <FooterCTA />
      <Footer />
    </div>
  );
}
