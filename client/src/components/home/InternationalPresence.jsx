import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, MapPin } from 'lucide-react';
import { getJurisdictions } from '../../utils/api';

const FALLBACK_JURISDICTIONS = [
  {
    _id: '1',
    slug: 'cyprus',
    country: 'Cyprus',
    flagEmoji: '🇨🇾',
    flagUrl: 'https://imperial-ventures-assets.s3.eu-north-1.amazonaws.com/website/jurisdiction-cyprus-photo.png',
    description:
      'A prime EU jurisdiction offering competitive corporate tax rates, an extensive double-tax treaty network, and a business-friendly regulatory environment.',
  },
  {
    _id: '2',
    slug: 'netherlands',
    country: 'Netherlands',
    flagEmoji: '🇳🇱',
    flagUrl: 'https://imperial-ventures-assets.s3.eu-north-1.amazonaws.com/website/jurisdiction-netherlands-photo.png',
    description:
      "Europe's gateway for international holding structures, boasting an exceptional treaty network, participation exemption, and access to EU capital markets.",
  },
  {
    _id: '3',
    slug: 'greece',
    country: 'Greece',
    flagEmoji: '🇬🇷',
    flagUrl: 'https://imperial-ventures-assets.s3.eu-north-1.amazonaws.com/website/jurisdiction-greece-photo.png',
    description:
      'A strategic Mediterranean hub with attractive non-dom regimes, investment incentives, and growing opportunities across key sectors.',
  },
];

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.25, 0.46, 0.45, 0.94] },
  },
};

function JurisdictionCard({ jurisdiction }) {
  return (
    <motion.div variants={cardVariants}>
      <Link
        to={`/jurisdictions/${jurisdiction.slug}`}
        className="group flex flex-col h-full rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm hover:bg-white/10 hover:border-gold/30 transition-all duration-300 overflow-hidden"
      >
        {/* Flag image */}
        <div className="relative h-52 overflow-hidden flex-shrink-0">
          {jurisdiction.flagUrl ? (
            <img
              src={jurisdiction.flagUrl}
              alt={`${jurisdiction.country} flag`}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-white/10">
              <span className="text-6xl">{jurisdiction.flagEmoji}</span>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
        </div>

        <div className="p-6 flex flex-col flex-1">
          {/* Country name */}
          <div className="flex items-center gap-2 mb-3">
            <MapPin className="w-3.5 h-3.5 text-gold flex-shrink-0" />
            <h3 className="text-lg font-bold text-white group-hover:text-gold transition-colors duration-200">
              {jurisdiction.country}
            </h3>
          </div>

          {/* Divider */}
          <div
            className="h-px w-full mb-4 opacity-20 group-hover:opacity-40 transition-opacity duration-300"
            style={{ background: 'linear-gradient(90deg, #D4B684, transparent)' }}
          />

          {/* Description */}
          <p className="text-sm text-gray-300 leading-relaxed flex-1 mb-5">
            {jurisdiction.description}
          </p>

          {/* CTA */}
          <div className="flex items-center gap-1.5 text-gold text-sm font-semibold">
            View page
            <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

function CardSkeleton() {
  return (
    <div className="rounded-xl border border-white/10 bg-white/5 overflow-hidden animate-pulse">
      <div className="h-52 bg-white/10" />
      <div className="p-6">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-3.5 h-3.5 bg-white/10 rounded-full" />
          <div className="h-5 bg-white/10 rounded w-24" />
        </div>
        <div className="h-px bg-white/10 mb-4" />
        <div className="space-y-2 mb-5">
          <div className="h-3 bg-white/10 rounded w-full" />
          <div className="h-3 bg-white/10 rounded w-5/6" />
          <div className="h-3 bg-white/10 rounded w-4/6" />
        </div>
        <div className="h-4 bg-white/10 rounded w-1/3" />
      </div>
    </div>
  );
}

export default function InternationalPresence() {
  const [jurisdictions, setJurisdictions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getJurisdictions()
      .then((res) => {
        const data = Array.isArray(res.data) ? res.data : res.data?.jurisdictions || [];
        setJurisdictions(data.length ? data : FALLBACK_JURISDICTIONS);
      })
      .catch(() => {
        setJurisdictions(FALLBACK_JURISDICTIONS);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="relative py-20 overflow-hidden bg-midnight">
      {/* World map background */}
      <div
        className="absolute inset-0 opacity-10 bg-center bg-cover bg-no-repeat"
        style={{
          backgroundImage:
            "url('https://imperial-ventures-assets.s3.eu-north-1.amazonaws.com/website/world-map.svg')",
          filter: 'brightness(0.6)',
        }}
      />
      {/* Gradient overlays */}
      <div className="absolute inset-0 bg-gradient-to-b from-midnight via-midnight/90 to-midnight" />
      <div
        className="absolute inset-0 opacity-20"
        style={{
          background:
            'radial-gradient(ellipse 80% 50% at 50% 50%, rgba(212,182,132,0.12) 0%, transparent 70%)',
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55 }}
          className="text-center mb-14"
        >
          <span className="inline-flex items-center gap-2 text-xs font-semibold tracking-[0.2em] uppercase text-gold mb-3">
            <span className="h-px w-6 bg-gold" />
            International Presence
            <span className="h-px w-6 bg-gold" />
          </span>
          <h2 className="font-urbanist text-3xl sm:text-4xl font-bold text-white mb-4">
            Deep Expertise Across Strategic European Jurisdictions
          </h2>
          <p className="text-gray-400 max-w-xl mx-auto text-base leading-relaxed">
            Strategically positioned across key European jurisdictions to serve your
            cross-border structuring and expansion needs.
          </p>
        </motion.div>

        {/* Jurisdiction cards */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => <CardSkeleton key={i} />)}
          </div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            {jurisdictions.map((j) => (
              <JurisdictionCard key={j._id || j.id || j.slug} jurisdiction={j} />
            ))}
          </motion.div>
        )}
      </div>
    </section>
  );
}
