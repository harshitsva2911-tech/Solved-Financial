import React, { useState, useEffect } from 'react';
import CountUp from 'react-countup';
import { useInView } from 'react-intersection-observer';
import { motion } from 'framer-motion';
import { getMetrics } from '../../utils/api';

const FALLBACK_METRICS = [
  {
    id: 1,
    value: 123,
    suffix: 'k+',
    label: 'Transactions Advised',
    description: 'Across diverse industries and markets worldwide.',
  },
  {
    id: 2,
    value: 15,
    suffix: '+',
    label: 'Years Experience',
    description: 'Deep expertise built over decades of practice.',
  },
  {
    id: 3,
    value: 12,
    suffix: '+',
    label: 'Countries Served',
    description: 'A truly global footprint spanning multiple jurisdictions.',
  },
  {
    id: 4,
    value: 98,
    suffix: '%',
    label: 'Client Retention',
    description: 'Long-term partnerships driven by measurable results.',
  },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.12 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] },
  },
};

function MetricCard({ metric, index, shouldCount }) {
  return (
    <motion.div
      variants={cardVariants}
      className="relative flex flex-col items-center text-center p-5 sm:p-8 group"
    >
      {/* Vertical divider (except last) */}
      {index < 3 && (
        <div className="hidden lg:block absolute right-0 top-1/2 -translate-y-1/2 h-16 w-px bg-gray-200" />
      )}

      {/* Value */}
      <div className="mb-3">
        <span
          className="text-4xl sm:text-5xl lg:text-6xl font-bold tabular-nums"
          style={{
            background: 'linear-gradient(135deg, #D4B684 0%, #B89A60 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          {shouldCount ? (
            <CountUp
              start={0}
              end={metric.value}
              duration={2.2}
              delay={index * 0.1}
              useEasing
              separator=","
            />
          ) : (
            '0'
          )}
        </span>
        <span
          className="text-3xl sm:text-4xl lg:text-5xl font-bold"
          style={{
            background: 'linear-gradient(135deg, #D4B684 0%, #B89A60 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          {metric.suffix}
        </span>
      </div>

      {/* Label */}
      <h3 className="text-lg font-bold text-midnight mb-2 tracking-tight">
        {metric.label}
      </h3>

      {/* Description */}
      <p className="text-sm text-gray-500 leading-relaxed max-w-[180px]">
        {metric.description}
      </p>

      {/* Bottom gold accent on hover */}
      <div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 w-0 group-hover:w-12 transition-all duration-300 rounded-full"
        style={{ background: 'linear-gradient(90deg, #D4B684, #B89A60)' }}
      />
    </motion.div>
  );
}

export default function MetricsSection() {
  const [metrics, setMetrics] = useState(FALLBACK_METRICS);
  const [, setLoading] = useState(true);

  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.25,
  });

  useEffect(() => {
    getMetrics()
      .then((res) => {
        const data = res.data;
        if (Array.isArray(data) && data.length > 0) {
          setMetrics(data);
        }
      })
      .catch(() => {
        // silently fall back to static data
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <section ref={ref} className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55 }}
          className="text-center mb-14"
        >
          <span className="inline-flex items-center gap-2 text-xs font-semibold tracking-[0.2em] uppercase text-gold mb-3">
            <span className="h-px w-6 bg-gold" />
            By the Numbers
            <span className="h-px w-6 bg-gold" />
          </span>
          <h2 className="font-urbanist text-3xl sm:text-4xl font-bold text-midnight">
            Results That Speak for Themselves
          </h2>
        </motion.div>

        {/* Metrics grid */}
        <div className="relative rounded-2xl border border-gray-100 shadow-sm bg-cream/50 overflow-hidden">
          {/* Top gold border */}
          <div
            className="absolute top-0 left-0 right-0 h-0.5"
            style={{ background: 'linear-gradient(90deg, transparent, #D4B684, transparent)' }}
          />

          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate={inView ? 'visible' : 'hidden'}
            className="grid grid-cols-2 lg:grid-cols-4"
          >
            {metrics.map((metric, i) => (
              <MetricCard
                key={metric.id || i}
                metric={metric}
                index={i}
                shouldCount={inView}
              />
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
