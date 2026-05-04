import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import axios from 'axios';
import {
  Search,
  Target,
  Zap,
  CheckCircle,
  ArrowRight,
} from 'lucide-react';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import FooterCTA from '../components/common/FooterCTA';
import PageHero from '../components/common/PageHero';
import SectionHeader from '../components/common/SectionHeader';
import AnimatedSection from '../components/common/AnimatedSection';

const HERO_BG = 'https://imperial-ventures-assets.s3.eu-north-1.amazonaws.com/website/hero-about.png';

const LinkedInIcon = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
    <rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/>
  </svg>
);

const API = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

/* â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
   Static fallback data
â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
const FALLBACK_TEAM = [
  {
    _id: '1',
    name: 'Alice Bradley',
    role: 'Founder & Managing Partner',
    bio: 'Alice brings over 20 years of senior financial leadership across European jurisdictions, guiding ambitious enterprises through growth, restructuring, and cross-border expansion.',
    linkedin: 'https://linkedin.com',
    image: 'https://imperial-ventures-assets.s3.eu-north-1.amazonaws.com/website/team-photo-2.png',
  },
];

const ADVISORY_STEPS = [
  {
    icon: Search,
    title: 'Discover',
    description:
      'We begin with a deep diagnostic of your business, financials, and objectives — identifying gaps, opportunities, and strategic priorities.',
  },
  {
    icon: Target,
    title: 'Strategize',
    description:
      'Our team designs a bespoke financial roadmap aligned to your vision, jurisdiction requirements, and growth ambitions.',
  },
  {
    icon: Zap,
    title: 'Execute',
    description:
      'We embed alongside your leadership team to implement financial structures, reporting systems, and advisory frameworks with precision.',
  },
  {
    icon: CheckCircle,
    title: 'Deliver',
    description:
      'Measurable outcomes, institutional-grade reporting, and ongoing advisory support ensure you maintain competitive advantage.',
  },
];

/* â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
   Team photo placeholder gradients
â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
const PHOTO_GRADIENTS = [
  'linear-gradient(135deg, #001B2F 0%, #0a3355 50%, #D4B684 100%)',
  'linear-gradient(135deg, #0a2a40 0%, #001B2F 60%, #B89A60 100%)',
  'linear-gradient(135deg, #001B2F 0%, #15405e 40%, #D4B684 100%)',
  'linear-gradient(135deg, #0f3550 0%, #001B2F 70%, #E8D4A8 100%)',
];

/* â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
   Team Member Card
â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
function TeamMemberCard({ member, index }) {
  const ref = useRef(null);
  const inView = useInView(ref, { amount: 0.2, once: true });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 32 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 32 }}
      transition={{ duration: 0.55, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
      className="bg-white rounded-lg overflow-hidden shadow-sm border border-gray-100 group hover:shadow-md transition-shadow duration-300"
    >
      {/* Photo */}
      <div className="relative w-full aspect-square overflow-hidden">
        {member.image ? (
          <img
            src={member.image}
            alt={member.name}
            className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div
            className="w-full h-full flex items-center justify-center"
            style={{ background: PHOTO_GRADIENTS[index % PHOTO_GRADIENTS.length] }}
            aria-hidden="true"
          >
            {/* Initials avatar */}
            <span className="text-4xl font-bold text-gold/60 select-none">
              {member.name
                .split(' ')
                .map((n) => n[0])
                .join('')
                .slice(0, 2)}
            </span>
          </div>
        )}
        {/* Gold overlay on hover */}
        <div className="absolute inset-0 bg-gold/0 group-hover:bg-gold/5 transition-colors duration-300" />
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div>
            <h3 className="font-bold text-midnight text-lg leading-tight">{member.name}</h3>
            <p className="text-gold text-sm font-medium mt-0.5">{member.role}</p>
          </div>
          {member.linkedin && (
            <a
              href={member.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${member.name} on LinkedIn`}
              className="flex-shrink-0 w-9 h-9 flex items-center justify-center rounded-sm border border-gray-200 text-gray-400 hover:text-gold hover:border-gold/50 hover:bg-gold/5 transition-all duration-200"
            >
              <LinkedInIcon size={16} />
            </a>
          )}
        </div>
        {member.bio && (
          <p className="text-gray-500 text-sm leading-relaxed line-clamp-4">{member.bio}</p>
        )}
      </div>
    </motion.div>
  );
}

/* â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
   Advisory Step (Timeline)
â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
function AdvisoryStep({ step, index, totalSteps }) {
  const ref = useRef(null);
  const inView = useInView(ref, { amount: 0.3, once: true });
  const [hovered, setHovered] = useState(false);
  const Icon = step.icon;
  const isLast = index === totalSteps - 1;

  const ease = 'easeOut';
  const duration = 0.22;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: 32 }}
      animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: 32 }}
      transition={{ duration: 0.55, delay: index * 0.12, ease: [0.22, 1, 0.36, 1] }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="flex gap-5 cursor-default"
    >
      {/* Icon + connector */}
      <div className="flex flex-col items-center flex-shrink-0">
        <motion.div
          animate={hovered ? {
            x: 4,
            backgroundColor: 'rgba(212,182,132,0.18)',
            borderColor: 'rgba(212,182,132,0.55)',
            boxShadow: '0 0 20px rgba(212,182,132,0.2)',
          } : {
            x: 0,
            backgroundColor: 'rgba(212,182,132,0.08)',
            borderColor: 'rgba(212,182,132,0.28)',
            boxShadow: '0 0 0px rgba(212,182,132,0)',
          }}
          transition={{ duration, ease }}
          className="w-11 h-11 rounded-full border flex items-center justify-center flex-shrink-0"
        >
          <motion.div
            animate={hovered ? { scale: 1.18 } : { scale: 1 }}
            transition={{ duration, ease }}
          >
            <Icon size={20} className="text-gold" />
          </motion.div>
        </motion.div>
        {!isLast && (
          <div className="w-px flex-1 mt-2 mb-0 bg-gradient-to-b from-gold/30 to-transparent min-h-[48px]" />
        )}
      </div>

      {/* Text */}
      <motion.div
        animate={{ x: hovered ? 4 : 0 }}
        transition={{ duration, ease }}
        className="pb-10"
      >
        <motion.h4
          animate={{ color: hovered ? '#D4B684' : '#ffffff' }}
          transition={{ duration }}
          className="font-bold text-lg mb-2"
        >
          {step.title}
        </motion.h4>
        <p className="text-cream/60 text-sm leading-relaxed">{step.description}</p>
      </motion.div>
    </motion.div>
  );
}

/* â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
   About Page
â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
export default function About() {
  const [team, setTeam] = useState([]);
  const [loadingTeam, setLoadingTeam] = useState(true);

  /* Fetch team */
  useEffect(() => {
    axios
      .get(`${API}/team`)
      .then((res) => {
        const data = Array.isArray(res.data) ? res.data : res.data?.data ?? [];
        setTeam(data.length > 0 ? data : FALLBACK_TEAM);
      })
      .catch(() => setTeam(FALLBACK_TEAM))
      .finally(() => setLoadingTeam(false));
  }, []);

  return (
    <div className="bg-cream min-h-screen">
      <Navbar />

      {/* 1. Hero */}
      <PageHero
        title="About Us"
        subtitle="Empowering ambitious enterprises with strategic financial leadership across European jurisdictions."
        breadcrumb={[{ label: 'Home', to: '/' }, { label: 'About Us' }]}
        bgImage={HERO_BG}
      />

      {/* 2. Split section */}
      <section className="py-20 lg:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 lg:gap-20 items-center">
            {/* Left */}
            <AnimatedSection direction="left">
              <h2
                className="font-urbanist font-bold text-midnight leading-[1.1] tracking-tight"
                style={{ fontSize: 'clamp(2rem, 4vw, 3rem)' }}
              >
                Empowering your vision,{' '}
                <span
                  style={{
                    background: 'linear-gradient(135deg, #D4B684 0%, #B89A60 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                  }}
                >
                  Solving the world
                </span>
              </h2>
            </AnimatedSection>

            {/* Right */}
            <AnimatedSection direction="right">
              <div className="border-l-4 border-gold pl-7 space-y-5">
                <p className="text-gray-600 text-base sm:text-lg leading-relaxed">
                  Solved Financial Services is a strategic advisory firm providing CFO-level
                  expertise and financial leadership to ambitious enterprises operating across
                  European jurisdictions. We act as the trusted financial co-pilot that
                  organisations need to navigate complexity, seize opportunities, and achieve
                  sustainable growth.
                </p>
                <p className="text-gray-500 text-base leading-relaxed">
                  With deep roots in Cyprus, the Netherlands, and Greece, our team brings
                  internationally coordinated, locally compliant financial advisory that
                  translates strategy into measurable results. We do not just advise &mdash; we
                  embed, execute, and deliver alongside you.
                </p>
                <Link
                  to="/services"
                  className="inline-flex items-center gap-2 text-gold font-semibold text-sm tracking-wide hover:gap-3 transition-all duration-200 group"
                >
                  Explore our services
                  <ArrowRight
                    size={16}
                    className="transition-transform duration-200 group-hover:translate-x-1"
                  />
                </Link>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* 3. Team photos row */}
      <section className="py-14 bg-cream overflow-hidden" aria-label="Team gallery">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-3 gap-4">
            {[
              { src: 'https://imperial-ventures-assets.s3.eu-north-1.amazonaws.com/website/team-photo-1.png', wide: false },
              { src: 'https://imperial-ventures-assets.s3.eu-north-1.amazonaws.com/website/team-photo-2.png', wide: true },
              { src: 'https://imperial-ventures-assets.s3.eu-north-1.amazonaws.com/website/team-photo-3.png', wide: false },
            ].map((photo, i) => (
              <AnimatedSection key={i} delay={i * 0.08} className={`${photo.wide ? 'col-span-1' : 'col-span-1'} aspect-square rounded-lg overflow-hidden`}>
                <img src={photo.src} alt="" className="w-full h-full object-cover" aria-hidden="true" />
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Advisory Approach â€” dark midnight */}
      <section className="py-20 lg:py-28 bg-midnight relative overflow-hidden">
        {/* Subtle grid */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(212,182,132,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(212,182,132,0.6) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
          aria-hidden="true"
        />
        {/* Gold radial glow */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'radial-gradient(ellipse 60% 70% at 10% 50%, rgba(212,182,132,0.06) 0%, transparent 70%)',
          }}
          aria-hidden="true"
        />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 lg:gap-20 items-start">
            {/* Left */}
            <AnimatedSection direction="left">
              <SectionHeader
                label="How We Work"
                title={<span className="text-white">Our Advisory Approach</span>}
                subtitle={
                  <span className="text-cream/55">
                    Our advisory process is built on a structured methodology that transforms
                    complex financial challenges into clear, actionable strategies. We work
                    closely with leadership teams to deliver outcomes that matter.
                  </span>
                }
                align="left"
              />
              <p className="mt-6 text-cream/50 text-sm leading-relaxed max-w-md">
                Every engagement begins with understanding your business deeply &mdash; its
                ambitions, constraints, and the competitive landscape. Only then do we
                architect the financial solutions that move you forward.
              </p>
            </AnimatedSection>

            {/* Right: Timeline */}
            <div className="space-y-0 pt-2">
              {ADVISORY_STEPS.map((step, i) => (
                <AdvisoryStep
                  key={step.title}
                  step={step}
                  index={i}
                  totalSteps={ADVISORY_STEPS.length}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 5. Leadership */}
      <section className="py-20 lg:py-28 bg-white" aria-labelledby="leadership-heading">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="mb-12">
            <SectionHeader
              label="Leadership"
              title="Meet Our Team"
              subtitle="Experienced financial professionals committed to your success across European markets."
              align="center"
            />
          </AnimatedSection>

          {loadingTeam ? (
            <div className="flex items-center justify-center py-20">
              <div
                className="w-10 h-10 rounded-full border-2 border-t-transparent animate-spin"
                style={{ borderColor: '#D4B684 transparent transparent transparent' }}
              />
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {team.map((member, i) => (
                <TeamMemberCard key={member._id ?? i} member={member} index={i} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 6. Gallery row */}
      <section className="py-8 bg-cream overflow-hidden" aria-label="Office gallery">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-3 gap-4">
            {[
              'https://imperial-ventures-assets.s3.eu-north-1.amazonaws.com/website/team-photo-1.png',
              'https://imperial-ventures-assets.s3.eu-north-1.amazonaws.com/website/team-photo-2.png',
              'https://imperial-ventures-assets.s3.eu-north-1.amazonaws.com/website/team-photo-3.png',
            ].map((src, i) => (
              <AnimatedSection
                key={i}
                delay={i * 0.09}
                className="h-48 lg:h-56 rounded-lg overflow-hidden"
              >
                <img src={src} alt="" className="w-full h-full object-cover" aria-hidden="true" />
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Footer CTA + Footer */}
      <FooterCTA />
      <Footer />
    </div>
  );
}
