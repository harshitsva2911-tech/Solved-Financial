import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import API_BASE from '../../utils/config';

const FALLBACK_COMPANIES = [
  { name: 'Nexus Capital', abbr: 'NC' },
  { name: 'Meridian Group', abbr: 'MG' },
  { name: 'Atlas Ventures', abbr: 'AV' },
  { name: 'Pinnacle Finance', abbr: 'PF' },
  { name: 'Vantage Partners', abbr: 'VP' },
  { name: 'Horizon Equity', abbr: 'HE' },
  { name: 'Crest Holdings', abbr: 'CH' },
  { name: 'Summit Advisory', abbr: 'SA' },
  { name: 'Apex Group', abbr: 'AG' },
  { name: 'Fortis Capital', abbr: 'FC' },
];

function getInitials(name = '') {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? '')
    .join('');
}

function LogoCard({ item }) {
  return (
    <div className="flex-shrink-0 mx-3 flex items-center gap-3 px-4 py-2.5 rounded-lg border border-gray-200 bg-white shadow-sm hover:border-gold/40 hover:shadow-md transition-all duration-200 cursor-default">
      {item.image ? (
        <img
          src={item.image}
          alt={item.name}
          className="h-7 w-auto max-w-[90px] object-contain flex-shrink-0"
        />
      ) : (
        <div
          className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold text-white flex-shrink-0"
          style={{ background: 'linear-gradient(135deg, #001B2F, #003459)' }}
        >
          {item.abbr || getInitials(item.name)}
        </div>
      )}
      <span className="text-sm font-medium text-gray-600 whitespace-nowrap">
        {item.name}
      </span>
    </div>
  );
}

function MarqueeRow({ items, duration = 35, reverse = false }) {
  // Duplicate 4x so there's always enough to fill any screen width
  const band = [...items, ...items, ...items, ...items];
  return (
    <div className="relative overflow-hidden">
      {/* Fade edges */}
      <div
        className="absolute left-0 top-0 bottom-0 w-16 sm:w-28 z-10 pointer-events-none"
        style={{ background: 'linear-gradient(90deg, #F5F7FA 0%, transparent 100%)' }}
      />
      <div
        className="absolute right-0 top-0 bottom-0 w-16 sm:w-28 z-10 pointer-events-none"
        style={{ background: 'linear-gradient(-90deg, #F5F7FA 0%, transparent 100%)' }}
      />
      <div
        className="flex"
        style={{
          width: 'max-content',
          animation: `marquee ${duration}s linear infinite ${reverse ? 'reverse' : ''}`,
          willChange: 'transform',
        }}
      >
        {band.map((item, i) => (
          <LogoCard key={i} item={item} />
        ))}
      </div>
    </div>
  );
}

export default function LogoStrip() {
  const [logos, setLogos] = useState([]);

  useEffect(() => {
    axios
      .get(`${API_BASE}/logos`)
      .then((res) => {
        const data = Array.isArray(res.data) ? res.data : res.data?.logos ?? [];
        setLogos(data);
      })
      .catch(() => setLogos([]));
  }, []);

  const items = logos.length ? logos : FALLBACK_COMPANIES;

  return (
    <section className="py-12 sm:py-16 bg-cream border-y border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex items-center gap-4"
        >
          <span className="h-px flex-1 bg-gradient-to-r from-transparent to-gray-200" />
          <p className="text-xs sm:text-sm font-semibold tracking-[0.18em] uppercase text-gray-400 text-center whitespace-nowrap px-4">
            Trusted by Growing Businesses
          </p>
          <span className="h-px flex-1 bg-gradient-to-l from-transparent to-gray-200" />
        </motion.div>
      </div>

      {/* Row 1 — scrolls left (always visible) */}
      <div className="mb-3">
        <MarqueeRow items={items} duration={35} reverse={false} />
      </div>

      {/* Row 2 — scrolls right (hidden on small screens) */}
      <div className="hidden sm:block">
        <MarqueeRow items={items} duration={42} reverse={true} />
      </div>
    </section>
  );
}
