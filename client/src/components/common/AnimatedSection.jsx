import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

/**
 * AnimatedSection
 * Wraps children in a framer-motion element that animates into view
 * when the component enters the viewport.
 *
 * Props:
 *   children   – React node(s) to render
 *   delay      – animation delay in seconds (default: 0)
 *   direction  – 'up' | 'left' | 'right' (default: 'up')
 *   className  – additional Tailwind / CSS classes on the wrapper
 *   threshold  – IntersectionObserver threshold (default: 0.15)
 *   once       – only animate once (default: true)
 *   as         – HTML tag or component to render as (default: 'div')
 *   duration   – animation duration in seconds (default: 0.6)
 */
const INITIAL_OFFSETS = {
  up:    { opacity: 0, y: 40,   x: 0   },
  left:  { opacity: 0, x: -48,  y: 0   },
  right: { opacity: 0, x: 48,   y: 0   },
};

const VISIBLE_STATE = { opacity: 1, x: 0, y: 0 };

export default function AnimatedSection({
  children,
  delay = 0,
  direction = 'up',
  className = '',
  threshold = 0.15,
  once = true,
  as: Tag = 'div',
  duration = 0.6,
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { amount: threshold, once });

  const MotionTag = motion[Tag] ?? motion.div;

  return (
    <MotionTag
      ref={ref}
      className={className}
      initial={INITIAL_OFFSETS[direction] ?? INITIAL_OFFSETS.up}
      animate={inView ? VISIBLE_STATE : (INITIAL_OFFSETS[direction] ?? INITIAL_OFFSETS.up)}
      transition={{
        duration,
        delay,
        ease: [0.22, 1, 0.36, 1], // custom ease-out-expo
      }}
    >
      {children}
    </MotionTag>
  );
}
