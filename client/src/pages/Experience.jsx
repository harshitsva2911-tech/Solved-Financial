import { useState, useEffect } from 'react';
import axios from 'axios';
import { CheckCircle2 } from 'lucide-react';

import Navbar from '../components/common/Navbar';
import PageHero from '../components/common/PageHero';
import SectionHeader from '../components/common/SectionHeader';
import AnimatedSection from '../components/common/AnimatedSection';
import FooterCTA from '../components/common/FooterCTA';
import Footer from '../components/common/Footer';
import API_BASE from '../utils/config';

const HERO_BG = 'https://imperial-ventures-assets.s3.eu-north-1.amazonaws.com/website/hero-experience.png';

const API = API_BASE;

// â”€â”€â”€ Static fallback case studies â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

const STATIC_CASE_STUDIES = [
  {
    id: 1,
    title: 'Cross-Border Corporate Structuring',
    subtitle: 'Optimising corporate structure across European jurisdictions',
    situation:
      'A European technology firm required financial due diligence and transaction structuring for a strategic acquisition.',
    approach:
      'We provided comprehensive corporate advisory, ensuring tax-efficient structuring and smooth integration of financial operations across Cyprus and the Netherlands.',
    outcomes: [
      'Successful transaction completion',
      'Optimised corporate holding structure',
      'Unified financial reporting framework',
    ],
    image: 'https://imperial-ventures-assets.s3.eu-north-1.amazonaws.com/website/case-study-asset-manager.png',
  }
];

// â”€â”€â”€ International presence data â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

const JURISDICTIONS = [
  {
    country: 'Cyprus',
    flag: '🇨🇾',
    description:
      'Our primary hub for corporate and financial services in the EU.',
    highlights: ['Corporate structuring', 'Accounting & VAT', 'Holding company structures'],
  },
  {
    country: 'Netherlands',
    flag: '🇳🇱',
    description:
      'A gateway to Northern European markets with extensive double-tax treaty networks.',
    highlights: ['Corporate administration', 'Extensive treaty network', 'CFO advisory'],
  },

];

const CASE_GRADIENTS = [
  'linear-gradient(135deg, #001B2F 0%, #0d3251 50%, #D4B684 100%)',
  'linear-gradient(135deg, #0d3251 0%, #001B2F 60%, #B89A60 100%)',
  'linear-gradient(135deg, #001B2F 0%, #162e45 45%, #D4B684 100%)',
  'linear-gradient(135deg, #0a2a42 0%, #001B2F 55%, #c8ae7a 100%)',
];

// â”€â”€â”€ Case Study Section â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

function CaseStudySection({ caseStudy, index }) {
  const isImageLeft = index % 2 !== 0; // 0=right, 1=left, 2=right â€¦
  const gradient = CASE_GRADIENTS[index % CASE_GRADIENTS.length];

  const imageCol = (
    <AnimatedSection
      direction={isImageLeft ? 'left' : 'right'}
      className="w-full lg:w-[44%] h-[380px] lg:h-[500px] rounded overflow-hidden flex-shrink-0"
    >
      {caseStudy.image ? (
        <img
          src={caseStudy.image}
          alt={caseStudy.title}
          className="w-full h-full object-cover"
        />
      ) : (
        <div
          className="w-full h-full flex flex-col justify-end p-8"
          style={{ background: gradient }}
        >
          <span className="text-white/15 font-bold text-7xl leading-none select-none">
            {String(index + 1).padStart(2, '0')}
          </span>
        </div>
      )}
    </AnimatedSection>
  );

  const textCol = (
    <AnimatedSection
      direction={isImageLeft ? 'right' : 'left'}
      className="flex-1 min-w-0 flex flex-col justify-center"
    >
      {/* Case study label */}
      <div className="flex items-center gap-3 mb-4">
        <span className="w-6 h-[3px] rounded-full bg-gold flex-shrink-0" />
        <span className="text-gold text-xs font-semibold uppercase tracking-[0.2em]">
          Case study {index + 1}
        </span>
      </div>

      {/* Title */}
      <h3 className="text-midnight font-bold text-2xl sm:text-[1.75rem] leading-tight mb-2">
        {caseStudy.title}
      </h3>
      {/* Subtitle */}
      {caseStudy.subtitle && (
        <p className="text-gold font-semibold text-base mb-6">{caseStudy.subtitle}</p>
      )}

      {/* Situation */}
      {caseStudy.situation && (
        <div className="mb-5">
          <h4 className="text-midnight font-bold text-sm uppercase tracking-[0.15em] mb-2">
            Situation
          </h4>
          <p className="text-gray-600 text-sm leading-relaxed">{caseStudy.situation}</p>
        </div>
      )}

      {/* Approach */}
      {caseStudy.approach && (
        <div className="mb-5">
          <h4 className="text-midnight font-bold text-sm uppercase tracking-[0.15em] mb-2">
            Approach
          </h4>
          <p className="text-gray-600 text-sm leading-relaxed">{caseStudy.approach}</p>
        </div>
      )}

      {/* Outcomes */}
      {caseStudy.outcomes && caseStudy.outcomes.length > 0 && (
        <div>
          <h4 className="text-midnight font-bold text-sm uppercase tracking-[0.15em] mb-3">
            Outcomes
          </h4>
          <ul className="space-y-2.5">
            {caseStudy.outcomes.map((outcome, i) => (
              <li key={i} className="flex items-start gap-3 text-sm text-gray-700">
                <CheckCircle2 size={15} className="text-gold flex-shrink-0 mt-0.5" />
                {outcome}
              </li>
            ))}
          </ul>
        </div>
      )}
    </AnimatedSection>
  );

  return (
    <div className="flex flex-col lg:flex-row gap-10 xl:gap-16 items-stretch">
      {isImageLeft ? (
        <>
          {imageCol}
          {textCol}
        </>
      ) : (
        <>
          {textCol}
          {imageCol}
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
        <div className="text-4xl mb-4">{jurisdiction.flag}</div>
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

export default function Experience() {
  const [caseStudies, setCaseStudies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    axios
      .get(`${API}/case-studies`)
      .then((res) => {
        if (!cancelled) {
          const data = Array.isArray(res.data)
            ? res.data
            : res.data.caseStudies ?? res.data.data ?? [];
          setCaseStudies(data.length ? data : STATIC_CASE_STUDIES);
        }
      })
      .catch(() => {
        if (!cancelled) setCaseStudies(STATIC_CASE_STUDIES);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, []);

  const displayCaseStudies = loading ? [] : caseStudies;

  return (
    <div className="bg-cream min-h-screen">
      <Navbar />
      {/* 1 â€” Hero */}
      <PageHero
        title="Selected Experience"
        subtitle="Proven expertise across complex financial environments."
        bgImage={HERO_BG}
        breadcrumb={[{ label: 'Home', to: '/' }, { label: 'Selected Experience' }]}
      />

      {/* 2 â€” Tagline */}
      <section className="bg-midnight py-14 lg:py-20" aria-label="Tagline">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection>
            <h2 className="font-urbanist text-white font-bold text-3xl sm:text-4xl lg:text-5xl xl:text-[3.25rem] leading-[1.15] tracking-tight text-center max-w-4xl mx-auto">
              A track record of transforming financial complexity into{' '}
              <span className="text-gold">competitive advantage.</span>
            </h2>
          </AnimatedSection>
        </div>
      </section>

      {/* 3 â€” Case Studies */}
      <section className="py-16 lg:py-28 bg-cream" aria-label="Case studies">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            label="Track record"
            title="Case Studies"
            subtitle="A selection of engagements demonstrating our depth of expertise and the tangible outcomes we deliver for our clients."
            className="mb-16"
          />

          {loading ? (
            <div className="flex flex-col gap-20">
              {[...Array(2)].map((_, i) => (
                <div key={i} className="flex flex-col lg:flex-row gap-10 animate-pulse">
                  <div className="w-full lg:w-[44%] h-[380px] bg-gray-200 rounded" />
                  <div className="flex-1 flex flex-col gap-4 justify-center">
                    <div className="h-3 w-28 bg-gray-200 rounded" />
                    <div className="h-8 bg-gray-200 rounded w-4/5" />
                    <div className="h-5 bg-gray-200 rounded w-2/3" />
                    <div className="h-4 bg-gray-200 rounded w-full" />
                    <div className="h-4 bg-gray-200 rounded w-11/12" />
                    <div className="h-4 bg-gray-200 rounded w-4/5" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col gap-20 lg:gap-28">
              {displayCaseStudies.map((cs, index) => (
                <CaseStudySection
                  key={cs.id ?? cs._id ?? index}
                  caseStudy={cs}
                  index={index}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 4 â€” International Presence */}
      <section className="py-16 lg:py-24 bg-midnight" aria-label="International presence">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            label="Global reach"
            title="International Presence"
            subtitle="We operate across strategic European jurisdictions, providing our clients with localised expertise and seamless cross-border capability."
            className="mb-12 [&_h2]:text-white [&_p]:text-cream/60"
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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
