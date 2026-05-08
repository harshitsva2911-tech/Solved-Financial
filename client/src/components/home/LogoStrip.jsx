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
    <div className="flex-shrink-0 mx-4 flex items-center gap-3 px-5 py-3 rounded-lg border border-gray-200 bg-white shadow-sm hover:border-gold/40 hover:shadow-md transition-all duration-200 group cursor-default">
      {item.image ? (
        <img
          src={item.image}
          alt={item.name}
          className="h-8 w-auto max-w-[100px] object-contain flex-shrink-0"
        />
      ) : (
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0 transition-all duration-300"
          style={{ background: 'linear-gradient(135deg, #001B2F, #003459)' }}
        >
          {item.abbr || getInitials(item.name)}
        </div>
      )}
      <span className="text-sm font-medium text-gray-600 group-hover:text-midnight transition-colors duration-200 whitespace-nowrap">
        {item.name}
      </span>
    </div>
  );
}

export default function LogoStrip() {
  const [logos, setLogos] = useState([]);

  useEffect(() => {
    axios
      .get(`${API_BASE}/logos`)
      .then((res) => {
        // API already filters active:true server-side
        const data = Array.isArray(res.data) ? res.data : res.data?.logos ?? [];
        setLogos(data);
      })
      .catch(() => {
        // Use fallback on error
        setLogos([]);
      });
  }, []);

  // Use API logos if available, else fallback static list
  const items = logos.length ? logos : FALLBACK_COMPANIES;

  // Duplicate for seamless infinite loop
  const row1 = [...items, ...items];
  const row2 = [
    ...items.slice(Math.floor(items.length / 2)),
    ...items.slice(0, Math.floor(items.length / 2)),
    ...items.slice(Math.floor(items.length / 2)),
    ...items.slice(0, Math.floor(items.length / 2)),
  ];

  return (
    <section className="py-16 bg-cream border-y border-gray-100 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 mb-10">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex items-center gap-4"
        >
          <span className="h-px flex-1 bg-gradient-to-r from-transparent to-gray-200" />
          <p className="text-sm font-semibold tracking-[0.18em] uppercase text-gray-400 text-center whitespace-nowrap px-4">
            Trusted by Growing Businesses
          </p>
          <span className="h-px flex-1 bg-gradient-to-l from-transparent to-gray-200" />
        </motion.div>
      </div>

      {/* Row 1 — scrolls left */}
      <div className="relative mb-4">
        <div className="absolute left-0 top-0 bottom-0 w-32 z-10 pointer-events-none"
          style={{ background: 'linear-gradient(90deg, #F5F7FA, transparent)' }} />
        <div className="absolute right-0 top-0 bottom-0 w-32 z-10 pointer-events-none"
          style={{ background: 'linear-gradient(-90deg, #F5F7FA, transparent)' }} />

        <div
          className="flex"
          style={{
            animation: 'marquee 35s linear infinite',
            width: 'max-content',
          }}
        >
          {row1.map((item, i) => (
            <LogoCard key={`r1-${i}`} item={item} />
          ))}
        </div>
      </div>

      {/* Row 2 — scrolls right */}
      <div className="relative">
        <div className="absolute left-0 top-0 bottom-0 w-32 z-10 pointer-events-none"
          style={{ background: 'linear-gradient(90deg, #F5F7FA, transparent)' }} />
        <div className="absolute right-0 top-0 bottom-0 w-32 z-10 pointer-events-none"
          style={{ background: 'linear-gradient(-90deg, #F5F7FA, transparent)' }} />

        <div
          className="flex"
          style={{
            animation: 'marquee 40s linear infinite reverse',
            width: 'max-content',
          }}
        >
          {row2.map((item, i) => (
            <LogoCard key={`r2-${i}`} item={item} />
          ))}
        </div>
      </div>
    </section>
  );
}
