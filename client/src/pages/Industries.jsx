import { useState, useEffect } from 'react';
import axios from 'axios';
import { CheckCircle2, AlertTriangle, X } from 'lucide-react';

import Navbar from '../components/common/Navbar';
import PageHero from '../components/common/PageHero';
import SectionHeader from '../components/common/SectionHeader';
import AnimatedSection from '../components/common/AnimatedSection';
import FooterCTA from '../components/common/FooterCTA';
import Footer from '../components/common/Footer';
import API_BASE from '../utils/config';

const HERO_BG = 'https://imperial-ventures-assets.s3.eu-north-1.amazonaws.com/website/hero-industries.png';

const API = API_BASE;

// â”€â”€â”€ Static fallback data â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

const STATIC_INDUSTRIES = [
  {
    id: 1,
    title: 'Financial Services & Banking',
    description:
      'We partner with banks, investment firms, and financial institutions navigating evolving regulatory frameworks across European jurisdictions. Our team provides end-to-end advisory on compliance architecture, licensing strategy, and capital structure optimization.',
    challenges: [
      'Complex cross-border regulatory compliance',
      'Capital adequacy and liquidity requirements',
      'AML/KYC framework implementation',
      'Ongoing supervisory reporting obligations',
    ],
    support: [
      'Regulatory licensing and authorisation',
      'Compliance framework design and implementation',
      'Ongoing regulatory monitoring and reporting',
      'Board-level governance advisory',
    ],
    image: 'https://imperial-ventures-assets.s3.eu-north-1.amazonaws.com/website/industry-financial-services.png',
  },
  {
    id: 2,
    title: 'Investment Management',
    description:
      'Asset managers, hedge funds, and family offices rely on our expertise to navigate fund structuring, investor relations, and cross-border investment strategies. We simplify complexity so you can focus on generating returns.',
    challenges: [
      'Fund structure selection and jurisdiction comparison',
      'AIFMD and UCITS compliance requirements',
      'Investor due diligence and onboarding',
      'Tax-efficient cross-border structuring',
    ],
    support: [
      'Fund formation and structuring advisory',
      'Regulatory registration across jurisdictions',
      'Investor relations and documentation',
      'Performance and risk reporting frameworks',
    ],
    image: 'https://imperial-ventures-assets.s3.eu-north-1.amazonaws.com/website/industry-investment-management.png',
  },
  {
    id: 3,
    title: 'Technology & Fintech',
    description:
      'Fintech innovators and technology companies entering regulated financial markets require both regulatory expertise and commercial acumen. We bridge the gap between innovation and compliance.',
    challenges: [
      'Obtaining payment institution or e-money licences',
      'PSD2 and open banking compliance',
      'Data privacy and GDPR obligations',
      'Navigating sandbox environments and fast-changing rules',
    ],
    support: [
      'Fintech regulatory strategy and licensing',
      'Product compliance review',
      'Data protection framework design',
      'Partnership and distribution structuring',
    ],
    image: 'https://imperial-ventures-assets.s3.eu-north-1.amazonaws.com/website/industry-technology-fintech.png',
  },
  {
    id: 4,
    title: 'Real Estate & Property',
    description:
      'Institutional investors and developers operating across Europe need nuanced understanding of local property markets, tax regimes, and investment structures. We provide clarity on every dimension of cross-border real estate transactions.',
    challenges: [
      'Complex multi-jurisdiction transaction structures',
      'Tax treatment and transfer pricing',
      'Regulatory approvals and foreign ownership rules',
      'Financing and capital stack optimisation',
    ],
    support: [
      'Transaction structuring and due diligence',
      'Tax-efficient ownership structures',
      'Regulatory approvals management',
      'Ongoing asset management advisory',
    ],
    image: 'https://imperial-ventures-assets.s3.eu-north-1.amazonaws.com/website/industry-real-estate.png',
  },
  {
    id: 5,
    title: 'Shipping & Maritime',
    description:
      'Cyprus and the Netherlands are among Europe\'s premier shipping jurisdictions. We advise shipping groups on flag registration, corporate structuring, tax optimisation, and regulatory compliance in these strategic hubs.',
    challenges: [
      'Flag state selection and registration complexity',
      'Tonnage tax eligibility and optimisation',
      'Crew management and employment compliance',
      'Environmental and ESG reporting requirements',
    ],
    support: [
      'Shipping company formation and structuring',
      'Tonnage tax and fiscal advisory',
      'Flag registration and management',
      'Regulatory compliance monitoring',
    ],
    image: 'https://imperial-ventures-assets.s3.eu-north-1.amazonaws.com/website/industry-shipping-maritime.png',
  },
];

// â”€â”€â”€ International presence data â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

const JURISDICTIONS = [
  {
    country: 'Cyprus',
    flag: '🇨🇾',
    description:
      'Our primary hub for EU financial services, offering CySEC regulatory expertise and access to EU passporting rights.',
    highlights: ['CySEC licensed advisory', 'EU passporting', 'Holding company structures'],
  },
  {
    country: 'Netherlands',
    flag: '🇳🇱',
    description:
      'A gateway to Northern European markets with AFM/DNB regulatory coverage and extensive double-tax treaty networks.',
    highlights: ['AFM & DNB regulated', 'Extensive treaty network', 'Fund domiciliation'],
  },
  {
    country: 'Greece',
    flag: '🇬🇷',
    description:
      'Strategic presence supporting Hellenic market entry, HCMC compliance, and investment opportunities in SE Europe.',
    highlights: ['HCMC compliance', 'SE Europe market access', 'Investment incentives'],
  },
];

// â”€â”€â”€ Gradient placeholder images â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

const INDUSTRY_GRADIENTS = [
  'linear-gradient(135deg, #001B2F 0%, #0d3251 40%, #D4B684 100%)',
  'linear-gradient(135deg, #0d3251 0%, #001B2F 50%, #B89A60 100%)',
  'linear-gradient(135deg, #001B2F 0%, #162e45 60%, #D4B684 100%)',
  'linear-gradient(135deg, #0a2a42 0%, #001B2F 50%, #c8ae7a 100%)',
  'linear-gradient(135deg, #001B2F 0%, #0e3356 40%, #D4B684 100%)',
];

// â”€â”€â”€ Industry Section â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

function IndustrySection({ industry, index }) {
  const isImageRight = index % 2 === 0; // even = image right, odd = image left
  const gradient = INDUSTRY_GRADIENTS[index % INDUSTRY_GRADIENTS.length];

  const imageCol = (
    <AnimatedSection
      direction={isImageRight ? 'right' : 'left'}
      className="w-full h-[380px] lg:h-[480px] rounded overflow-hidden flex-shrink-0 lg:w-[45%]"
    >
      {industry.image ? (
        <img
          src={industry.image}
          alt={industry.title}
          className="w-full h-full object-cover"
        />
      ) : (
        <div
          className="w-full h-full flex items-end p-8"
          style={{ background: gradient }}
        >
          <span className="text-white/20 font-bold text-6xl leading-none select-none">
            {String(index + 1).padStart(2, '0')}
          </span>
        </div>
      )}
    </AnimatedSection>
  );

  const contentCol = (
    <AnimatedSection
      direction={isImageRight ? 'left' : 'right'}
      className="flex flex-col justify-center flex-1 min-w-0"
    >
      {/* Title */}
      <h3 className="font-urbanist text-midnight font-bold text-2xl sm:text-3xl leading-tight mb-4">
        {industry.title}
      </h3>
      {/* Description */}
      <p className="text-gray-600 leading-relaxed mb-8 text-base">
        {industry.description}
      </p>

      {/* Two columns: challenges / support */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {/* Challenges */}
        {industry.challenges && industry.challenges.length > 0 && (
          <div>
            <h4 className="text-midnight font-bold text-sm uppercase tracking-[0.15em] mb-4 flex items-center gap-2">
              <AlertTriangle size={14} className="text-amber-500 flex-shrink-0" />
              Challenges
            </h4>
            <ul className="space-y-2.5">
              {industry.challenges.map((item, i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm text-gray-600">
                  <X size={14} className="text-red-400 flex-shrink-0 mt-0.5" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* How we support */}
        {industry.support && industry.support.length > 0 && (
          <div>
            <h4 className="text-midnight font-bold text-sm uppercase tracking-[0.15em] mb-4 flex items-center gap-2">
              <CheckCircle2 size={14} className="text-gold flex-shrink-0" />
              How We Support
            </h4>
            <ul className="space-y-2.5">
              {industry.support.map((item, i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm text-gray-700">
                  <CheckCircle2 size={14} className="text-gold flex-shrink-0 mt-0.5" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </AnimatedSection>
  );

  return (
    <div className="flex flex-col lg:flex-row gap-10 xl:gap-16 items-stretch">
      {isImageRight ? (
        <>
          {contentCol}
          {imageCol}
        </>
      ) : (
        <>
          {imageCol}
          {contentCol}
        </>
      )}
    </div>
  );
}

// â”€â”€â”€ Jurisdiction Card â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

function JurisdictionCard({ jurisdiction, delay }) {
  return (
    <AnimatedSection delay={delay} className="flex flex-col bg-white border border-gray-100 rounded shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden">
      <div className="px-7 pt-7 pb-5 flex-1">
        <div className="text-4xl mb-4" aria-label={jurisdiction.country}>{jurisdiction.flag}</div>
        <h3 className="text-midnight font-bold text-xl mb-3">{jurisdiction.country}</h3>
        <p className="text-gray-500 text-sm leading-relaxed mb-5">{jurisdiction.description}</p>
        <ul className="space-y-2">
          {jurisdiction.highlights.map((h, i) => (
            <li key={i} className="flex items-center gap-2 text-sm text-gray-700">
              <CheckCircle2 size={13} className="text-gold flex-shrink-0" />
              {h}
            </li>
          ))}
        </ul>
      </div>
      <div className="h-[3px] bg-gradient-to-r from-gold to-transparent" />
    </AnimatedSection>
  );
}

// â”€â”€â”€ Main Page â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

export default function Industries() {
  const [industries, setIndustries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    axios
      .get(`${API}/industries`)
      .then((res) => {
        if (!cancelled) {
          const data = Array.isArray(res.data)
            ? res.data
            : res.data.industries ?? res.data.data ?? [];
          setIndustries(data.length ? data : STATIC_INDUSTRIES);
        }
      })
      .catch(() => {
        if (!cancelled) setIndustries(STATIC_INDUSTRIES);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, []);

  const displayIndustries = loading ? [] : industries;

  return (
    <div className="bg-cream min-h-screen">
      <Navbar />
      {/* 1 â€” Hero */}
      <PageHero
        title="Industries"
        subtitle="Specialist financial services for the sectors that drive growth."
        bgImage={HERO_BG}
        breadcrumb={[{ label: 'Home', to: '/' }, { label: 'Industries' }]}
      />

      {/* 2 â€” Industries we work on */}
      <section className="py-16 lg:py-24 bg-cream" aria-label="Industries we work on">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-14">
            <SectionHeader
              label="Our Focus"
              title="Industries we work on"
              className="mb-6"
            />
            <AnimatedSection delay={0.15}>
              <p className="text-gray-600 text-base sm:text-lg leading-relaxed">
                Our team brings deep sector knowledge to every engagement. We understand the regulatory
                environment, commercial pressures, and strategic imperatives unique to each industry &mdash;
                delivering advisory that is precise, relevant, and immediately actionable.
              </p>
            </AnimatedSection>
          </div>

          {/* Industry sections */}
          {loading ? (
            <div className="flex flex-col gap-20">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex flex-col lg:flex-row gap-10 animate-pulse">
                  <div className="flex-1 h-[380px] bg-gray-200 rounded" />
                  <div className="flex-1 flex flex-col gap-4 justify-center">
                    <div className="h-8 bg-gray-200 rounded w-3/4" />
                    <div className="h-4 bg-gray-200 rounded w-full" />
                    <div className="h-4 bg-gray-200 rounded w-5/6" />
                    <div className="h-4 bg-gray-200 rounded w-4/5" />
                    <div className="grid grid-cols-2 gap-4 mt-4">
                      <div className="h-24 bg-gray-200 rounded" />
                      <div className="h-24 bg-gray-200 rounded" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col gap-20 lg:gap-28">
              {displayIndustries.map((industry, index) => (
                <IndustrySection
                  key={industry.id ?? industry._id ?? index}
                  industry={industry}
                  index={index}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 3 â€” International Presence */}
      <section className="py-16 lg:py-24 bg-midnight" aria-label="International presence">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            label="Global reach"
            title="International Presence"
            subtitle="We operate across three strategic European jurisdictions, providing our clients with localised expertise and seamless cross-border capability."
            className="mb-12 [&_h2]:text-white [&_p]:text-cream/60"
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {JURISDICTIONS.map((j, i) => (
              <JurisdictionCard key={j.country} jurisdiction={j} delay={i * 0.1} />
            ))}
          </div>
        </div>
      </section>

      {/* Footer CTA + Footer */}
      <FooterCTA />
      <Footer />
    </div>
  );
}
