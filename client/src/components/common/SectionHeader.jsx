import { motion } from 'framer-motion';
import { useRef } from 'react';
import { useInView } from 'framer-motion';

/**
 * SectionHeader
 * Reusable section heading block.
 *
 * Props:
 *   label    – (string) small-caps tag shown above the title with gold bar
 *   title    – (string | ReactNode) main section heading
 *   subtitle – (string | ReactNode) optional supporting paragraph
 *   align    – 'left' | 'center' (default: 'left')
 *   className – extra wrapper classes
 *   animate  – animate on scroll into view (default: true)
 */
export default function SectionHeader({
  label,
  title,
  subtitle,
  align = 'left',
  className = '',
  animate = true,
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { amount: 0.3, once: true });

  const isCenter = align === 'center';

  const containerClass = `${isCenter ? 'text-center' : 'text-left'} ${className}`;

  // Animation variants
  const variants = {
    hidden: { opacity: 0, y: 24 },
    visible: (delay = 0) => ({
      opacity: 1,
      y: 0,
      transition: { duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] },
    }),
  };

  const shouldAnimate = animate;
  const labelState  = shouldAnimate ? (inView ? 'visible' : 'hidden') : 'visible';
  const titleState  = shouldAnimate ? (inView ? 'visible' : 'hidden') : 'visible';
  const subtitleState = shouldAnimate ? (inView ? 'visible' : 'hidden') : 'visible';

  return (
    <div ref={ref} className={containerClass}>
      {/* Label with gold bar */}
      {label && (
        <motion.div
          variants={variants}
          custom={0}
          initial="hidden"
          animate={labelState}
          className={`flex items-center gap-3 mb-4 ${isCenter ? 'justify-center' : ''}`}
        >
          {/* Gold bar — left-aligned or centred */}
          <span
            className="flex-shrink-0 w-8 h-[3px] rounded-full bg-gold"
            aria-hidden="true"
          />
          <span className="text-gold text-xs font-semibold uppercase tracking-[0.2em]">
            {label}
          </span>
        </motion.div>
      )}

      {/* Title */}
      {title && (
        <motion.h2
          variants={variants}
          custom={label ? 0.08 : 0}
          initial="hidden"
          animate={titleState}
          className={`font-urbanist font-bold text-midnight dark:text-white leading-tight tracking-tight
            text-3xl sm:text-4xl lg:text-[2.75rem]
            ${isCenter ? 'mx-auto' : ''}
          `}
        >
          {title}
        </motion.h2>
      )}

      {/* Subtitle */}
      {subtitle && (
        <motion.p
          variants={variants}
          custom={label ? 0.16 : 0.08}
          initial="hidden"
          animate={subtitleState}
          className={`mt-4 text-base sm:text-lg text-gray-500 dark:text-cream/60 leading-relaxed
            ${isCenter ? 'mx-auto max-w-2xl' : 'max-w-2xl'}
          `}
        >
          {subtitle}
        </motion.p>
      )}
    </div>
  );
}
