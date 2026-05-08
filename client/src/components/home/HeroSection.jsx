import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, TrendingUp, Shield, Globe } from 'lucide-react';
import axios from 'axios';
import API_BASE from '../../utils/config';

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay: i * 0.15, ease: [0.25, 0.46, 0.45, 0.94] },
  }),
};

const floatVariant = {
  initial: { y: 0 },
  animate: {
    y: [-8, 8, -8],
    transition: { duration: 6, repeat: Infinity, ease: 'easeInOut' },
  },
};

const pillData = [
  { icon: TrendingUp, label: 'Financial Structuring' },
  { icon: Shield, label: 'Board Advisory' },
  { icon: Globe, label: 'International Expansion' },
];

const DEFAULTS = {
  heroTitle: 'Strategic Financial Leadership for Ambitious Enterprises',
  heroSubtitle:
    'Board-level advisory, financial structuring, and international expansion services for scale-ups, start-ups, and established enterprises.',
};

export default function HeroSection() {
  const [settings, setSettings] = useState(null);

  useEffect(() => {
    axios
      .get(`${API_BASE}/settings`)
      .then((res) => setSettings(res.data.settings ?? res.data))
      .catch(() => { /* silently use defaults */ });
  }, []);

  const heroTitle = settings?.heroTitle || DEFAULTS.heroTitle;
  const heroSubtitle = settings?.heroSubtitle || DEFAULTS.heroSubtitle;

  // Split the heroTitle to apply gradient on last word(s) — find where "Leadership" or last natural break is
  // Use the full title as-is but highlight a portion with gold gradient
  const renderTitle = () => {
    // If title matches default, render with gold on "Leadership"
    const idx = heroTitle.indexOf('Leadership');
    if (idx !== -1) {
      return (
        <>
          {heroTitle.slice(0, idx)}
          <span
            className="relative"
            style={{
              background: 'linear-gradient(135deg, #D4B684 0%, #E8D4A8 50%, #B89A60 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            Leadership
          </span>
          {heroTitle.slice(idx + 'Leadership'.length)}
        </>
      );
    }
    // For custom titles: highlight the last word with gold
    const words = heroTitle.trim().split(' ');
    const lastWord = words.pop();
    return (
      <>
        {words.join(' ')}{' '}
        <span
          style={{
            background: 'linear-gradient(135deg, #D4B684 0%, #E8D4A8 50%, #B89A60 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          {lastWord}
        </span>
      </>
    );
  };

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-midnight">
      {/* Background image with overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage:
            "url('https://imperial-ventures-assets.s3.eu-north-1.amazonaws.com/website/hero-home.png')",
        }}
      />
      {/* Multi-layer dark overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-midnight/95 via-midnight/80 to-midnight/50" />
      <div className="absolute inset-0 bg-gradient-to-t from-midnight/60 via-transparent to-transparent" />

      {/* Animated background orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          variants={floatVariant}
          initial="initial"
          animate="animate"
          className="absolute top-1/4 right-1/4 w-80 h-80 rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(212,182,132,0.08) 0%, transparent 70%)',
          }}
        />
        <motion.div
          variants={floatVariant}
          initial="initial"
          animate="animate"
          style={{
            background: 'radial-gradient(circle, rgba(212,182,132,0.05) 0%, transparent 70%)',
            animationDelay: '2s',
          }}
          className="absolute bottom-1/3 right-1/3 w-96 h-96 rounded-full"
        />
        {/* Gold accent line */}
        <motion.div
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: 1, opacity: 1 }}
          transition={{ duration: 1.2, delay: 0.8, ease: 'easeOut' }}
          className="absolute top-0 left-0 h-1 w-full origin-left"
          style={{ background: 'linear-gradient(90deg, #D4B684, transparent)' }}
        />
      </div>

      {/* Grid overlay for texture */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage:
            'linear-gradient(rgba(212,182,132,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(212,182,132,0.3) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      />

      {/* Content */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 lg:px-12 py-24 pt-36">
        <div className="max-w-3xl">
          {/* Eyebrow */}
          <motion.div
            custom={0}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="inline-flex items-center gap-2 mb-6"
          >
            <span className="h-px w-8 bg-gold" />
            <span className="text-gold text-sm font-semibold tracking-[0.2em] uppercase">
              Solved Financial Services
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            custom={1}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="font-urbanist text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-white leading-[1.08] tracking-tight mb-6"
          >
            {renderTitle()}
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            custom={2}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="text-lg sm:text-xl text-gray-300 leading-relaxed mb-10 max-w-2xl"
          >
            {heroSubtitle}
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            custom={3}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="flex flex-col sm:flex-row gap-4 mb-16"
          >
            <Link
              to="/contact"
              className="group inline-flex items-center justify-center gap-2 px-8 py-4 rounded-md font-semibold text-midnight text-base transition-all duration-300 hover:shadow-lg hover:shadow-gold/20 hover:-translate-y-0.5 active:translate-y-0"
              style={{ background: 'linear-gradient(135deg, #D4B684 0%, #B89A60 100%)' }}
            >
              Book a 30-min Consultation
              <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
            <Link
              to="/services"
              className="group inline-flex items-center justify-center gap-2 px-8 py-4 rounded-md font-semibold text-white text-base border border-white/20 hover:border-gold/50 hover:bg-white/5 transition-all duration-300"
            >
              Explore Services
              <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </motion.div>

          {/* Expertise pills */}
          <motion.div
            custom={4}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="flex flex-wrap gap-3"
          >
            {pillData.map(({ icon: Icon, label }) => (
              <div
                key={label}
                className="flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm"
              >
                <Icon className="w-3.5 h-3.5 text-gold" />
                <span className="text-sm text-gray-300 font-medium">{label}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Bottom scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.8, duration: 0.6 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="text-xs text-gray-500 tracking-widest uppercase">Scroll</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
          className="w-px h-8 bg-gradient-to-b from-gold/60 to-transparent"
        />
      </motion.div>
    </section>
  );
}
