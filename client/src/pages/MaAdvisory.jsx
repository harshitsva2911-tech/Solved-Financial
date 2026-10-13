import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { ArrowRight, CheckCircle, Target, Search, BarChart2, ShieldCheck, Handshake, TrendingUp } from 'lucide-react';

import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import FooterCTA from '../components/common/FooterCTA';
import PageHero from '../components/common/PageHero';

const HERO_BG = 'https://imperial-ventures-assets.s3.eu-north-1.amazonaws.com/website/hero-home.png'; // Using a premium bg

const deliverables = [
  { service: 'Acquisition strategy', deliverable: 'Agreed geography, sector, business size, financial criteria and acquisition objectives.', icon: Target },
  { service: 'Target search and screening', deliverable: 'Documented longlist and shortlist with available company information, source dates and screening rationale.', icon: Search },
  { service: 'Financial analysis & valuation', deliverable: 'Financial review, valuation scenarios and documented assumptions; scope formal valuation separately.', icon: BarChart2 },
  { service: 'Financial due diligence', deliverable: 'Perform or coordinate the agreed financial workstream; legal, tax and specialist reviews through the relevant advisers.', icon: ShieldCheck },
  { service: 'Transaction support', deliverable: 'Financial modelling, questions for counterparties, coordination and negotiation support within the mandate.', icon: Handshake },
  { service: 'Post-acquisition finance', deliverable: 'Reporting setup, cash planning, finance processes and integration support.', icon: TrendingUp },
];

const journeySteps = [
  'Discovery and criteria',
  'Scoped proposal',
  'Research and screening',
  'Shortlist discussion',
  'Deeper review',
  'Transaction support'
];

export default function MaAdvisory() {
  const tableRef = useRef(null);
  const tableInView = useInView(tableRef, { amount: 0.1, once: true });
  
  const journeyRef = useRef(null);
  const journeyInView = useInView(journeyRef, { amount: 0.2, once: true });

  return (
    <main className="min-h-screen bg-cream">
      <Navbar />
      
      <PageHero
        title="Mergers & Acquisitions"
        subtitle="Make your next acquisition a considered decision."
        breadcrumb={[{ label: 'Home', to: '/' }, { label: 'M&A Advisory' }]}
        bgImage={HERO_BG}
      />

      {/* Intro Section */}
      <section className="py-20 lg:py-28 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <span className="text-gold font-bold tracking-[0.2em] uppercase text-xs mb-4 block">Specialist Advisory</span>
            <h2 className="text-3xl sm:text-4xl font-bold font-urbanist text-midnight mb-6 leading-tight">
              We support business owners and investors exploring acquisitions in Cyprus and the Netherlands.
            </h2>
            <p className="text-lg text-gray-600 leading-relaxed">
              From defining the acquisition criteria and identifying potential targets to financial analysis and transaction coordination, our advisory helps you evaluate opportunities and move forward with a clearer understanding of the business.
            </p>
          </motion.div>
        </div>
      </section>

      {/* The Mandate Journey */}
      <section className="py-24 bg-midnight text-white overflow-hidden" ref={journeyRef}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={journeyInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="text-center mb-16"
          >
            <span className="text-gold font-bold tracking-[0.2em] uppercase text-xs mb-4 block">The Process</span>
            <h2 className="text-3xl font-bold font-urbanist text-white mb-6">
              The Mandate Journey
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto mb-4">
              A structured approach from initial strategy through to completion.
            </p>
            <p className="text-sm text-gold/80 max-w-3xl mx-auto italic">
              Note: A research mandate does not automatically include outreach, negotiations, due diligence or closing. We state each explicitly in a tailored proposal.
            </p>
          </motion.div>

          {/* Stepper */}
          <div className="relative max-w-5xl mx-auto mt-12">
            {/* The horizontal connecting line */}
            <div className="hidden md:block absolute top-[24px] left-[8%] right-[8%] h-[2px] bg-white/10" />
            
            <div className="grid grid-cols-2 md:grid-cols-6 gap-6 relative z-10">
              {journeySteps.map((step, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  animate={journeyInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  className="flex flex-col items-center text-center group"
                >
                  <div className="relative w-12 h-12 rounded-full bg-midnight border-2 border-gold flex items-center justify-center mb-6 shadow-[0_0_15px_rgba(212,182,132,0.15)] group-hover:bg-gold transition-colors duration-300">
                    <span className="text-gold group-hover:text-midnight font-bold text-lg font-urbanist">{idx + 1}</span>
                  </div>
                  <h3 className="text-sm font-bold text-gray-200 tracking-wide">{step}</h3>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Deliverables Table */}
      <section className="py-24 bg-cream border-y border-gray-100" ref={tableRef}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={tableInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="text-center mb-16"
          >
            <span className="text-gold font-bold tracking-[0.2em] uppercase text-xs mb-4 block">Scope of Work</span>
            <h2 className="text-3xl font-bold font-urbanist text-midnight mb-6">
              Proposed Deliverables
            </h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={tableInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {deliverables.map((item, i) => {
              const Icon = item.icon;
              return (
                <div key={i} className="bg-white rounded-lg p-8 shadow-sm border border-gray-100 hover:border-gold/50 transition-colors">
                  <div className="w-12 h-12 bg-[#faf8f5] rounded-full flex items-center justify-center mb-6">
                    <Icon size={24} className="text-gold" />
                  </div>
                  <h3 className="text-lg font-bold text-midnight mb-3">{item.service}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{item.deliverable}</p>
                </div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* Boutique Presentation / Service Routes */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl font-bold font-urbanist text-midnight mb-6">Boutique M&A Advisory</h2>
              <p className="text-gray-600 mb-6 leading-relaxed">
                We operate a discreet, highly structured advisory practice. Each mandate begins with a clear written proposal identifying the scope of research, the named advisory contact leading the engagement, and the specific deliverables.
              </p>
              <p className="text-gray-600 mb-8 leading-relaxed">
                Fees, third-party expenses, and success components are agreed in advance. Confidentiality and strict information handling are paramount from day one.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.6 }}
              className="space-y-6"
            >
              <div className="group">
                <div className="bg-[#faf8f5] group-hover:bg-midnight rounded-lg p-8 border border-gray-100 group-hover:border-midnight group-hover:shadow-2xl group-hover:shadow-midnight/20 group-hover:-translate-y-1 transition-all duration-300 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gold/10 rounded-bl-full -mr-16 -mt-16 transition-transform duration-300 group-hover:scale-110 pointer-events-none" />
                  <h3 className="text-xl font-bold text-midnight group-hover:text-white transition-colors duration-300 mb-3 font-urbanist">Looking to acquire a business</h3>
                  <p className="text-gray-600 group-hover:text-gray-300 transition-colors duration-300 text-sm leading-relaxed mb-6">
                    We support buyers with active market screening, strategic target identification, initial approaches, and coordinated financial reviews throughout the transaction.
                  </p>
                  <a href="/contact" className="inline-flex items-center text-gold font-bold transition-colors text-sm">
                    Discuss an Acquisition <ArrowRight size={16} className="ml-2 transition-transform duration-300 group-hover:translate-x-1" />
                  </a>
                </div>
              </div>

              <div className="group">
                <div className="bg-[#faf8f5] group-hover:bg-midnight rounded-lg p-8 border border-gray-100 group-hover:border-midnight group-hover:shadow-2xl group-hover:shadow-midnight/20 group-hover:-translate-y-1 transition-all duration-300 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gold/10 rounded-bl-full -mr-16 -mt-16 transition-transform duration-300 group-hover:scale-110 pointer-events-none" />
                  <h3 className="text-xl font-bold text-midnight group-hover:text-white transition-colors duration-300 mb-3 font-urbanist">Preparing your business for a transaction</h3>
                  <p className="text-gray-600 group-hover:text-gray-300 transition-colors duration-300 text-sm leading-relaxed mb-6">
                    For sellers, we focus on sale-readiness. We support financial preparation, structuring records, and specialist coordination to ensure your business is transaction-ready before launching a formal process.
                  </p>
                  <a href="/contact" className="inline-flex items-center text-gold font-bold transition-colors text-sm">
                    Discuss Sale-Readiness <ArrowRight size={16} className="ml-2 transition-transform duration-300 group-hover:translate-x-1" />
                  </a>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <FooterCTA />
      <Footer />
    </main>
  );
}
