import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import axios from 'axios';
import { Shield, ArrowRight } from 'lucide-react';

import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import FooterCTA from '../components/common/FooterCTA';
import PageHero from '../components/common/PageHero';
import AnimatedSection from '../components/common/AnimatedSection';

const HERO_BG = 'https://imperial-ventures-assets.s3.eu-north-1.amazonaws.com/website/hero-jurisdictions.png';

const API = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const FALLBACK_JURISDICTIONS = [
  {
    _id: '1',
    country: 'Cyprus',
    slug: 'cyprus',
    tagline: 'A strategic gateway for international business within the EU.',
    intro:
      'Cyprus offers one of the most business-friendly regulatory environments in Europe, combining a competitive tax framework, strong legal infrastructure, and full EU membership.',
    flagCode: 'cy',
  },
  {
    _id: '2',
    country: 'Netherlands',
    slug: 'netherlands',
    tagline: "Europe's leading gateway for international trade and finance.",
    intro:
      'The Netherlands is renowned for its pro-business environment, sophisticated financial infrastructure, and strategic location at the heart of Europe.',
    flagCode: 'nl',
  },
  {
    _id: '3',
    country: 'Greece',
    slug: 'greece',
    tagline: 'An emerging strategic hub with deep European roots.',
    intro:
      'Greece presents a compelling opportunity for businesses seeking access to South-Eastern European markets, with a modernising regulatory environment and EU membership.',
    flagCode: 'gr',
  },
];

const JURISDICTION_PHOTOS = {
  cyprus: 'https://imperial-ventures-assets.s3.eu-north-1.amazonaws.com/website/jurisdiction-cyprus-photo.png',
  netherlands: 'https://imperial-ventures-assets.s3.eu-north-1.amazonaws.com/website/jurisdiction-netherlands-photo.png',
  greece: 'https://imperial-ventures-assets.s3.eu-north-1.amazonaws.com/website/jurisdiction-greece-photo.png',
};

const FLAG_CODE_MAP = { cyprus: 'cy', netherlands: 'nl', greece: 'gr' };

/* â”€â”€â”€ Jurisdiction Card â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
function JurisdictionCard({ jurisdiction, index }) {
  const ref = useRef(null);
  const inView = useInView(ref, { amount: 0.15, once: true });

  const photoUrl =
    JURISDICTION_PHOTOS[jurisdiction.slug] ??
    `https://flagcdn.com/w640/${jurisdiction.flagCode ?? FLAG_CODE_MAP[jurisdiction.slug] ?? jurisdiction.slug}.png`;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 36 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 36 }}
      transition={{ duration: 0.6, delay: index * 0.12, ease: [0.22, 1, 0.36, 1] }}
      className="group bg-white/40 rounded-[10px] overflow-hidden flex flex-col"
    >
      {/* Square image */}
      <div className="relative w-full aspect-square overflow-hidden bg-midnight flex-shrink-0">
        <img
          src={photoUrl}
          alt={jurisdiction.country}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          onError={(e) => { e.target.style.display = 'none'; }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-midnight/30 via-transparent to-transparent" />
      </div>

      {/* Content */}
      <div className="pt-5 pb-10 px-4 flex flex-col flex-1">
        <h3 className="font-bold text-midnight text-3xl sm:text-4xl leading-snug mb-3 font-urbanist">
          {jurisdiction.country}
        </h3>
        {jurisdiction.intro && (
          <p className="text-gray-600 text-base leading-relaxed flex-1 mb-6">
            {jurisdiction.intro}
          </p>
        )}
        <Link
          to={`/jurisdictions/${jurisdiction.slug}`}
          className="inline-flex items-center gap-2 text-gold font-medium text-base hover:gap-3 transition-all duration-200 group/link mt-auto"
          aria-label={`View ${jurisdiction.country} jurisdiction page`}
        >
          View page
          <ArrowRight
            size={16}
            className="transition-transform duration-200 group-hover/link:translate-x-1"
          />
        </Link>
      </div>
    </motion.div>
  );
}

/* â”€â”€â”€ Page â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
export default function Jurisdictions() {
  const [jurisdictions, setJurisdictions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(`${API}/jurisdictions`)
      .then((res) => {
        const data = Array.isArray(res.data) ? res.data : res.data?.data ?? [];
        setJurisdictions(data.length > 0 ? data : FALLBACK_JURISDICTIONS);
      })
      .catch(() => setJurisdictions(FALLBACK_JURISDICTIONS))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="bg-white min-h-screen">
      <Navbar />

      {/* 1. Hero */}
      <PageHero
        title="Our Global Jurisdictions"
        subtitle="Deep expertise across strategic European jurisdictions."
        breadcrumb={[{ label: 'Home', to: '/' }, { label: 'Jurisdictions' }]}
        bgImage={HERO_BG}
      />

      {/* 2. Intro paragraph */}
      <section className="pt-16 pb-6 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="max-w-5xl">
            <p className="text-gray-700 text-base sm:text-lg leading-relaxed">
              Solved Financial Services operates across three key European jurisdictions,
              providing locally-compliant, internationally-coordinated financial services
              tailored to each market. Our on-the-ground expertise ensures your business
              benefits from strategic insight rooted in genuine local knowledge.
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* 3. Audit note banner */}
      <section className="pb-10 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection delay={0.1}>
            <div className="flex items-center gap-4 bg-gray-50 px-5 py-5 rounded">
              <Shield size={24} className="text-gold flex-shrink-0" aria-hidden="true" />
              <p className="text-gray-700 text-base leading-relaxed">
                Audit and assurance services are provided in accordance with local regulatory
                requirements of each respective jurisdiction.
              </p>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* 4. Jurisdiction cards */}
      <section className="pb-20 lg:pb-28 bg-white" aria-labelledby="jurisdictions-heading">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Gold top-border heading â€” matches Figma */}
          <AnimatedSection className="mb-12">
            <div className="border-t-[6px] border-gold inline-block pt-5">
              <h2
                id="jurisdictions-heading"
                className="font-bold text-midnight text-3xl sm:text-4xl tracking-tight font-urbanist"
              >
                Choose jurisdiction relevant to you
              </h2>
            </div>
          </AnimatedSection>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div
                className="w-10 h-10 rounded-full border-2 border-t-transparent animate-spin"
                style={{ borderColor: '#D4B684 transparent transparent transparent' }}
              />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {jurisdictions.map((j, i) => (
                <JurisdictionCard key={j._id ?? j.slug} jurisdiction={j} index={i} />
              ))}
            </div>
          )}
        </div>
      </section>

      <FooterCTA />
      <Footer />
    </div>
  );
}
