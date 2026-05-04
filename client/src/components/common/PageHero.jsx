import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';

/**
 * PageHero
 * Reusable hero banner for inner pages.
 *
 * Props:
 *   title      – (string | ReactNode) main heading text
 *   subtitle   – (string | ReactNode) descriptive text shown in gold-bordered box (right side)
 *   breadcrumb – (Array<{ label, to? }>) optional breadcrumb trail
 *   bgImage    – (string) optional CSS background-image URL
 *   minHeight  – optional override for min-height (default: 'min-h-[420px]')
 */
export default function PageHero({
  title,
  subtitle,
  breadcrumb,
  bgImage,
  minHeight = 'min-h-[420px]',
}) {
  return (
    <section
      className={`relative w-full ${minHeight} flex items-end bg-midnight overflow-hidden`}
      aria-label={typeof title === 'string' ? title : 'Page hero'}
    >
      {/* Background image with overlay */}
      {bgImage && (
        <>
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url(${bgImage})` }}
            aria-hidden="true"
          />
          {/* Gradient overlay — stronger on left so title stays legible */}
          <div
            className="absolute inset-0"
            style={{
              background:
                'linear-gradient(to right, rgba(0,27,47,0.92) 0%, rgba(0,27,47,0.75) 50%, rgba(0,27,47,0.55) 100%)',
            }}
            aria-hidden="true"
          />
        </>
      )}

      {/* Subtle decorative gradient when no image */}
      {!bgImage && (
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse at 80% 0%, rgba(212,182,132,0.10) 0%, transparent 60%), linear-gradient(180deg, #001B2F 0%, #001B2F 100%)',
          }}
          aria-hidden="true"
        />
      )}

      {/* Gold accent line at top */}
      <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-gold via-gold/60 to-transparent" aria-hidden="true" />

      {/* Content */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-14 pt-32">
        {/* Breadcrumb */}
        {breadcrumb && breadcrumb.length > 0 && (
          <motion.nav
            aria-label="Breadcrumb"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: 'easeOut' }}
            className="flex items-center gap-1 mb-6 flex-wrap"
          >
            {breadcrumb.map(({ label, to }, i) => (
              <span key={i} className="flex items-center gap-1">
                {i > 0 && <ChevronRight size={13} className="text-gold/50 flex-shrink-0" aria-hidden="true" />}
                {to ? (
                  <Link
                    to={to}
                    className="text-cream/55 text-xs tracking-wide hover:text-gold transition-colors duration-200 focus:outline-none focus-visible:text-gold"
                  >
                    {label}
                  </Link>
                ) : (
                  <span className="text-gold/80 text-xs tracking-wide" aria-current="page">
                    {label}
                  </span>
                )}
              </span>
            ))}
          </motion.nav>
        )}

        {/* Two-column layout: title left, subtitle right */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-end">
          {/* Left: Title */}
          <motion.div
            initial={{ opacity: 0, x: -32 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          >
            <h1 className="font-urbanist text-white font-bold text-4xl sm:text-5xl lg:text-[3.25rem] leading-[1.1] tracking-tight">
              {title}
            </h1>
          </motion.div>

          {/* Right: Subtitle in gold-left-bordered box */}
          {subtitle && (
            <motion.div
              initial={{ opacity: 0, x: 32 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.22, ease: [0.22, 1, 0.36, 1] }}
              className="border-l-4 border-gold pl-6 py-1"
            >
              <p className="text-cream/75 text-base sm:text-lg leading-relaxed">
                {subtitle}
              </p>
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
}
