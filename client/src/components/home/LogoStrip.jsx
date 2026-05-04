import React from 'react';
import { motion } from 'framer-motion';

const companies = [
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

// Duplicate for seamless infinite loop
const row1 = [...companies, ...companies];
const row2 = [...companies.slice(5), ...companies.slice(0, 5), ...companies.slice(5), ...companies.slice(0, 5)];

function LogoCard({ name, abbr }) {
  return (
    <div className="flex-shrink-0 mx-4 flex items-center gap-3 px-5 py-3 rounded-lg border border-gray-200 bg-white shadow-sm hover:border-gold/40 hover:shadow-md transition-all duration-200 group cursor-default">
      {/* Monogram circle */}
      <div
        className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0 transition-all duration-300"
        style={{ background: 'linear-gradient(135deg, #001B2F, #003459)' }}
      >
        {abbr}
      </div>
      <span className="text-sm font-medium text-gray-600 group-hover:text-midnight transition-colors duration-200 whitespace-nowrap">
        {name}
      </span>
    </div>
  );
}

export default function LogoStrip() {
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
        {/* Left fade */}
        <div className="absolute left-0 top-0 bottom-0 w-32 z-10 pointer-events-none"
          style={{ background: 'linear-gradient(90deg, #F5F7FA, transparent)' }} />
        {/* Right fade */}
        <div className="absolute right-0 top-0 bottom-0 w-32 z-10 pointer-events-none"
          style={{ background: 'linear-gradient(-90deg, #F5F7FA, transparent)' }} />

        <div
          className="flex"
          style={{
            animation: 'marquee 35s linear infinite',
            width: 'max-content',
          }}
        >
          {row1.map((c, i) => (
            <LogoCard key={`r1-${i}`} name={c.name} abbr={c.abbr} />
          ))}
        </div>
      </div>

      {/* Row 2 — scrolls right */}
      <div className="relative">
        {/* Left fade */}
        <div className="absolute left-0 top-0 bottom-0 w-32 z-10 pointer-events-none"
          style={{ background: 'linear-gradient(90deg, #F5F7FA, transparent)' }} />
        {/* Right fade */}
        <div className="absolute right-0 top-0 bottom-0 w-32 z-10 pointer-events-none"
          style={{ background: 'linear-gradient(-90deg, #F5F7FA, transparent)' }} />

        <div
          className="flex"
          style={{
            animation: 'marquee 40s linear infinite reverse',
            width: 'max-content',
          }}
        >
          {row2.map((c, i) => (
            <LogoCard key={`r2-${i}`} name={c.name} abbr={c.abbr} />
          ))}
        </div>
      </div>
    </section>
  );
}
