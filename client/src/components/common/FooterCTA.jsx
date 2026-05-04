import { Link } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { ArrowRight, CalendarDays } from 'lucide-react';

/**
 * FooterCTA
 * "Ready to Empower your vision?" banner rendered before the site footer.
 * Place on every page, just above <Footer />.
 *
 * Props:
 *   bgImage    – optional override for the background image URL
 *   heading    – optional override for the heading text
 *   subheading – optional override for the subheading text
 */
export default function FooterCTA({
  bgImage = 'https://imperial-ventures-assets.s3.eu-north-1.amazonaws.com/website/footer-cta-bg.png',
  heading = 'Ready to Empower Your Vision?',
  subheading = 'Our advisors are ready to help you navigate complex financial landscapes and unlock new opportunities across Europe.',
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { amount: 0.25, once: true });

  const ease = [0.22, 1, 0.36, 1];

  return (
    <section
      ref={ref}
      className="relative w-full overflow-hidden"
      aria-label="Call to action — book a consultation"
    >
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat scale-[1.03]"
        style={{ backgroundImage: `url(${bgImage})` }}
        aria-hidden="true"
      />

      {/* Layered dark overlay */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(135deg, rgba(0,27,47,0.97) 0%, rgba(0,27,47,0.88) 50%, rgba(0,27,47,0.80) 100%)',
        }}
        aria-hidden="true"
      />

      {/* Decorative gold glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse at 30% 50%, rgba(212,182,132,0.08) 0%, transparent 65%)',
        }}
        aria-hidden="true"
      />

      {/* Gold top accent line */}
      <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-gold via-gold/50 to-transparent" aria-hidden="true" />

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-24">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-10 lg:gap-16">
          {/* Left: text block */}
          <div className="flex-1 max-w-2xl">
            {/* Label tag */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
              transition={{ duration: 0.5, ease }}
              className="flex items-center gap-3 mb-5"
            >
              <span className="w-8 h-[3px] rounded-full bg-gold flex-shrink-0" aria-hidden="true" />
              <span className="text-gold text-xs font-semibold uppercase tracking-[0.2em]">
                Get started today
              </span>
            </motion.div>

            {/* Heading */}
            <motion.h2
              initial={{ opacity: 0, y: 24 }}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
              transition={{ duration: 0.6, delay: 0.08, ease }}
              className="font-urbanist text-white font-bold text-3xl sm:text-4xl lg:text-[2.6rem] leading-[1.15] tracking-tight"
            >
              {heading}
            </motion.h2>

            {/* Subheading */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.6, delay: 0.16, ease }}
              className="mt-5 text-cream/65 text-base sm:text-lg leading-relaxed"
            >
              {subheading}
            </motion.p>
          </div>

          {/* Right: CTA buttons */}
          <motion.div
            initial={{ opacity: 0, x: 28 }}
            animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: 28 }}
            transition={{ duration: 0.6, delay: 0.24, ease }}
            className="flex flex-col sm:flex-row lg:flex-col xl:flex-row items-stretch sm:items-center gap-4 w-full sm:w-auto flex-shrink-0"
          >
            {/* Primary: Book consultation (gold) */}
            <Link
              to="/contact"
              className="inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-sm
                bg-gold text-midnight font-semibold text-sm tracking-wide
                hover:bg-gold-light active:bg-gold-dark
                transition-colors duration-200
                focus:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-midnight
                whitespace-nowrap group"
            >
              <CalendarDays size={17} aria-hidden="true" />
              Book consultation
            </Link>

            {/* Secondary: Our services (outline) */}
            <Link
              to="/services"
              className="inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-sm
                border border-cream/30 text-cream/85 font-semibold text-sm tracking-wide
                hover:border-gold/60 hover:text-gold hover:bg-gold/5
                active:bg-gold/10
                transition-all duration-200
                focus:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-midnight
                whitespace-nowrap group"
            >
              Our services
              <ArrowRight
                size={16}
                aria-hidden="true"
                className="transition-transform duration-200 group-hover:translate-x-1"
              />
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
