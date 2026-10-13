import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Briefcase, MessageCircle, Shield, FileText } from 'lucide-react';

import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import FooterCTA from '../components/common/FooterCTA';
import PageHero from '../components/common/PageHero';
import API_BASE from '../utils/config';
import { getTeam } from '../utils/api';

const HERO_BG = 'https://imperial-ventures-assets.s3.eu-north-1.amazonaws.com/website/hero-about.png';

const LinkedInIcon = ({ size = 16, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect x="2" y="9" width="4" height="12" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

const getImageUrl = (url) => {
  if (!url) return null;
  if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('//')) {
    return url;
  }
  const baseUrl = API_BASE.replace(/\/api$/, '');
  return `${baseUrl}${url.startsWith('/') ? '' : '/'}${url}`;
};

const roles = [
  {
    role: 'Accounting team',
    description: 'Bookkeeping, reconciliations, routine financial administration and agreed compliance work.',
    icon: FileText
  },
  {
    role: 'Client contact',
    description: 'Onboarding, missing-record follow-up, communication and coordination.',
    icon: MessageCircle
  },
  {
    role: 'Chris / senior advisory',
    description: 'Firm leadership, complex financial matters and CFO/advisory engagements within scope.',
    icon: Briefcase
  },
  {
    role: 'Independent specialists',
    description: 'Audit, legal and other specialist services under their own agreed responsibilities.',
    icon: Shield
  }
];

export default function About() {
  const [teamMembers, setTeamMembers] = useState([]);
  const [loadingTeam, setLoadingTeam] = useState(true);

  useEffect(() => {
    getTeam()
      .then((res) => {
        const data = Array.isArray(res.data) ? res.data : (res.data?.members || []);
        setTeamMembers(data.filter((m) => m.active !== false).sort((a, b) => (a.order ?? 0) - (b.order ?? 0)));
      })
      .catch((err) => {
        console.error('Failed to load team members:', err);
      })
      .finally(() => {
        setLoadingTeam(false);
      });
  }, []);

  return (
    <main className="min-h-screen bg-cream">
      <Navbar />
      
      <PageHero
        title="About Solved"
        subtitle="Practical financial leadership and personal service for growing businesses."
        breadcrumb={[{ label: 'Home', to: '/' }, { label: 'About' }]}
        bgImage={HERO_BG}
      />

      {/* Founder Intro Section */}
      <section className="py-24 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            
            {/* Left: Founder Photo */}
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative rounded-2xl overflow-hidden aspect-square lg:aspect-[4/5] bg-midnight"
            >
              <img 
                src={`${API_BASE.replace(/\/api$/, '')}/uploads/1777556433499-797707328.jpeg`} 
                alt="Christodoulos (Chris) Kyriakides" 
                className="w-full h-full object-cover"
              />
            </motion.div>

            {/* Right: Intro Text */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <span className="text-gold font-bold tracking-[0.2em] uppercase text-xs mb-4 block">Founder & Leadership</span>
              <h2 className="text-3xl sm:text-4xl font-bold font-urbanist text-midnight mb-6 leading-tight">
                Practical financial leadership and a more personal service.
              </h2>
              
              <div className="space-y-6 text-gray-600 text-lg leading-relaxed">
                <p>
                  Solved was founded by Christodoulos (Chris) Kyriakides to bring practical financial leadership and a more personal service to growing businesses. His experience spans senior finance and operational roles, international reporting, finance transformation and hands-on CFO support. 
                </p>
                <p>
                  Solved’s employees deliver accounting and day-to-day client support, with Chris leading the firm and senior financial advisory. Together, the team provides tailored engagements in Cyprus and the Netherlands.
                </p>
                <p className="font-semibold text-midnight/80 italic">
                  Christodoulos holds a completed Executive MBA and brings a proven track record of strategic financial guidance.
                </p>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* Dynamic Team Section - Synchronized with Admin Team CMS */}
      <section className="py-24 bg-[#faf8f5] border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <span className="text-gold font-bold tracking-[0.2em] uppercase text-xs mb-4 block">Meet Our Team</span>
            <h2 className="text-3xl sm:text-4xl font-bold font-urbanist text-midnight mb-6">
              Leadership & Financial Advisory
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto leading-relaxed text-lg">
              Experienced professionals combining senior commercial perspective with hands-on technical execution to guide your growth.
            </p>
          </motion.div>

          {loadingTeam ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3].map((n) => (
                <div key={n} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 animate-pulse">
                  <div className="w-full aspect-[4/5] bg-gray-200" />
                  <div className="p-6 space-y-3">
                    <div className="h-4 bg-gray-200 rounded w-1/3" />
                    <div className="h-6 bg-gray-200 rounded w-2/3" />
                    <div className="h-4 bg-gray-200 rounded w-full" />
                    <div className="h-4 bg-gray-200 rounded w-4/5" />
                  </div>
                </div>
              ))}
            </div>
          ) : teamMembers.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <p>Team information will be available shortly.</p>
            </div>
          ) : (
            <div className={`grid grid-cols-1 ${
              teamMembers.length === 1
                ? 'max-w-md mx-auto'
                : teamMembers.length === 2
                  ? 'sm:grid-cols-2 max-w-3xl mx-auto'
                  : teamMembers.length === 3
                    ? 'sm:grid-cols-2 lg:grid-cols-3'
                    : 'sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
            } gap-8`}>
              {teamMembers.map((member, i) => {
                const imageUrl = getImageUrl(member.image);
                const initials = member.name
                  ? member.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
                  : 'TM';

                return (
                  <motion.div
                    key={member._id || i}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: i * 0.1 }}
                    className="group bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:border-gold/40 hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col h-full"
                  >
                    {/* Member Photo / Avatar */}
                    <div className="relative w-full aspect-[4/5] bg-midnight overflow-hidden flex items-center justify-center flex-shrink-0">
                      {imageUrl ? (
                        <img
                          src={imageUrl}
                          alt={member.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                            const fallback = e.currentTarget.nextElementSibling;
                            if (fallback) fallback.style.display = 'flex';
                          }}
                        />
                      ) : null}

                      {/* Initials Fallback */}
                      <div
                        className={`w-full h-full flex flex-col items-center justify-center text-white ${
                          imageUrl ? 'hidden' : 'flex'
                        }`}
                        style={{ background: 'linear-gradient(135deg, #001B2F 0%, #003666 100%)' }}
                      >
                        <div className="w-24 h-24 rounded-full border-2 border-gold/40 flex items-center justify-center text-3xl font-bold font-urbanist text-gold bg-midnight/50 shadow-inner">
                          {initials}
                        </div>
                      </div>

                      {/* Floating LinkedIn Icon */}
                      {member.linkedin && (
                        <a
                          href={member.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={`${member.name} on LinkedIn`}
                          className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/90 hover:bg-gold hover:text-white text-midnight flex items-center justify-center shadow-md backdrop-blur-sm transition-all duration-200 z-10"
                        >
                          <LinkedInIcon size={15} />
                        </a>
                      )}
                    </div>

                    {/* Member Details */}
                    <div className="p-6 flex flex-col flex-1">
                      <span className="text-gold font-bold tracking-[0.15em] uppercase text-xs mb-1.5 block">
                        {member.role}
                      </span>
                      <h3 className="text-xl font-bold font-urbanist text-midnight mb-3">
                        {member.name}
                      </h3>
                      {member.bio && (
                        <p className="text-gray-600 text-sm leading-relaxed flex-1">
                          {member.bio}
                        </p>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Who Does What */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <span className="text-gold font-bold tracking-[0.2em] uppercase text-xs mb-4 block">Our Structure</span>
            <h2 className="text-3xl font-bold font-urbanist text-midnight mb-6">
              Who does what
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto leading-relaxed text-lg">
              We operate as a boutique firm with our own employees, supported by a network of independent specialists when required. You will always know who is responsible for each part of your engagement.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {roles.map((item, i) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="bg-[#faf8f5] rounded-2xl p-6 shadow-sm border border-gray-100 hover:border-gold/30 hover:-translate-y-1 hover:shadow-md transition-all duration-300"
                >
                  <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-gold mb-6 shadow-sm">
                    <Icon size={24} />
                  </div>
                  <h3 className="text-lg font-bold text-midnight mb-3">{item.role}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{item.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      <FooterCTA />
      <Footer />
    </main>
  );
}
