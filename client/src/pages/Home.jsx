import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, TrendingUp } from 'lucide-react';
import axios from 'axios';
import API_BASE from '../utils/config';

import HeroSection from '../components/home/HeroSection';
import LogoStrip from '../components/home/LogoStrip';
import MetricsSection from '../components/home/MetricsSection';
import ServicesCarousel from '../components/home/ServicesCarousel';
import InternationalPresence from '../components/home/InternationalPresence';
import FeaturedArticles from '../components/home/FeaturedArticles';
import FooterCTA from '../components/common/FooterCTA';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';

/* ------------------------------------------------------------------
   Mid-page CTA Section
   Dark navy background, financial empowerment copy, gold Get Started CTA
------------------------------------------------------------------ */
function MidCTA({ ctaTitle }) {
  return (
    <section className="relative py-24 overflow-hidden bg-midnight">
      {/* Subtle grid texture */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(212,182,132,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(212,182,132,0.5) 1px, transparent 1px)',
          backgroundSize: '64px 64px',
        }}
      />
      {/* Radial gold glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 80% 60% at 50% 50%, rgba(212,182,132,0.06) 0%, transparent 70%)',
        }}
      />
      {/* Horizontal gold accent lines */}
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(212,182,132,0.5), transparent)' }}
      />
      <div
        className="absolute bottom-0 left-0 right-0 h-px"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(212,182,132,0.3), transparent)' }}
      />

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-12 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.65, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          {/* Icon */}
          <div
            className="inline-flex items-center justify-center w-14 h-14 rounded-full mb-6"
            style={{ background: 'rgba(212,182,132,0.12)', border: '1px solid rgba(212,182,132,0.25)' }}
          >
            <TrendingUp className="w-6 h-6 text-gold" />
          </div>

          {/* Eyebrow */}
          <span className="block text-xs font-semibold tracking-[0.22em] uppercase text-gold mb-4">
            Financial Empowerment
          </span>

          {/* Headline */}
          <h2 className="font-urbanist text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight mb-6">
            {ctaTitle ? (
              ctaTitle
            ) : (
              <>
                Empowering Your Business with{' '}
                <span
                  style={{
                    background: 'linear-gradient(135deg, #D4B684 0%, #E8D4A8 50%, #B89A60 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                  }}
                >
                  Financial Clarity
                </span>
              </>
            )}
          </h2>

          {/* Body text */}
          <p className="text-gray-400 text-base sm:text-lg leading-relaxed mb-4 max-w-2xl mx-auto">
            In today's complex global economy, financial leadership is not a luxury — it is a
            competitive necessity. At Solved Financial Services, we bring decades of
            board-level expertise directly to your organisation, enabling you to make
            faster, smarter, and more confident decisions.
          </p>
          <p className="text-gray-500 text-base leading-relaxed mb-10 max-w-2xl mx-auto">
            Whether you are structuring a cross-border transaction, entering a new
            jurisdiction, or preparing for your next funding round, our advisors deliver
            actionable strategy backed by deep financial intelligence. We do not just advise
            — we partner in your success.
          </p>

          {/* CTA buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/contact"
              className="group inline-flex items-center gap-2 px-8 py-4 rounded-md font-semibold text-midnight text-base transition-all duration-300 hover:shadow-lg hover:shadow-gold/20 hover:-translate-y-0.5 active:translate-y-0"
              style={{ background: 'linear-gradient(135deg, #D4B684 0%, #B89A60 100%)' }}
            >
              Get Started
              <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
            <Link
              to="/about"
              className="group inline-flex items-center gap-2 px-8 py-4 rounded-md font-semibold text-white text-base border border-white/15 hover:border-gold/40 hover:bg-white/5 transition-all duration-300"
            >
              About Us
              <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------
   Home Page
------------------------------------------------------------------ */
export default function Home() {
  const [ctaTitle, setCtaTitle] = useState('');

  useEffect(() => {
    axios
      .get(`${API_BASE}/settings`)
      .then((res) => {
        const data = res.data.settings ?? res.data ?? {};
        setCtaTitle(data.ctaTitle || '');
      })
      .catch(() => {});
  }, []);

  return (
    <div>
      <Navbar />
      <main>
      {/* 1. Full-viewport hero */}
      <HeroSection />

      {/* 2. Trusted by / logo marquee strip */}
      <LogoStrip />

      {/* 3. Animated metrics counters */}
      <MetricsSection />

      {/* 4. Services swiper carousel */}
      <ServicesCarousel />

      {/* 5. International presence (jurisdictions) */}
      <InternationalPresence />

      {/* 6. Mid-page financial empowerment CTA */}
      <MidCTA ctaTitle={ctaTitle} />

      {/* 7. Featured articles */}
      <FeaturedArticles />

      {/* 8. Footer CTA banner (shared common component) */}
      <FooterCTA />
      </main>
      <Footer />
    </div>
  );
}
