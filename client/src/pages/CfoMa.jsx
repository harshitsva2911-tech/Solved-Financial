import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { CheckCircle, BarChart3, TrendingUp, GitMerge, FileSpreadsheet, Layers, PieChart } from 'lucide-react';

import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import FooterCTA from '../components/common/FooterCTA';
import PageHero from '../components/common/PageHero';

const HERO_BG = 'https://imperial-ventures-assets.s3.eu-north-1.amazonaws.com/website/service-cfo-advisory.png';

const deliverables = [
  { service: 'Cash and working capital', deliverable: 'Rolling cash forecast, collections priorities and payment planning.', icon: PieChart },
  { service: 'Budgeting and scenarios', deliverable: 'Budget, forecast updates and sensitivity analysis.', icon: BarChart3 },
  { service: 'Management information', deliverable: 'Profitability reports, agreed KPIs and management review pack.', icon: FileSpreadsheet },
  { service: 'Finance operations', deliverable: 'Documented processes, close timetable and responsibility map.', icon: Layers },
  { service: 'Board/investor support', deliverable: 'Decision-ready reporting and financial model support.', icon: TrendingUp },
  { service: 'Growth decisions', deliverable: 'Hiring, pricing, investment and expansion analysis within agreed scope.', icon: GitMerge },
];

export default function CfoMa() {
  const tableRef = useRef(null);
  const tableInView = useInView(tableRef, { amount: 0.1, once: true });
  
  const optionsRef = useRef(null);
  const optionsInView = useInView(optionsRef, { amount: 0.1, once: true });

  return (
    <main className="min-h-screen bg-cream">
      <Navbar />
      
      <PageHero
        title="Fractional CFO Advisory"
        subtitle="Senior financial leadership, shaped around your business."
        breadcrumb={[{ label: 'Home', to: '/' }, { label: 'Fractional CFO' }]}
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
            <span className="text-gold font-bold tracking-[0.2em] uppercase text-xs mb-4 block">Strategic Leadership</span>
            <h2 className="text-3xl sm:text-4xl font-bold font-urbanist text-midnight mb-6 leading-tight">
              Get experienced CFO support at the level your business needs.
            </h2>
            <p className="text-lg text-gray-600 leading-relaxed">
              We work with founders and management teams to strengthen cash planning, reporting, financial controls and business decisions. You receive high-level strategic oversight and senior involvement, supported by a structured team, meaning you get expert guidance without the cost of a full-time executive—and without relying on a single individual to process every transaction.
            </p>
          </motion.div>
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
            <h2 className="text-3xl font-bold font-urbanist text-midnight">
              Concrete Deliverables
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

      {/* Engagement Options */}
      <section className="py-24 bg-white" ref={optionsRef}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={optionsInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="mb-16 max-w-3xl"
          >
            <span className="text-gold font-bold tracking-[0.2em] uppercase text-xs mb-4 block">How We Work</span>
            <h2 className="text-3xl sm:text-4xl font-bold font-urbanist text-midnight mb-6">
              Engagement Options
            </h2>
            <p className="text-lg text-gray-600 leading-relaxed">
              Every engagement begins with an <strong>initial diagnosis</strong> to assess your current financial health. We then establish <strong>agreed priorities</strong> and an <strong>ongoing review cadence</strong> to ensure continuous alignment with your strategic goals.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={optionsInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
              className="group h-full"
            >
              <div className="h-full bg-[#faf8f5] group-hover:bg-midnight rounded-lg p-8 border border-gray-100 group-hover:border-midnight shadow-sm group-hover:shadow-2xl group-hover:shadow-midnight/20 group-hover:-translate-y-1 transition-all duration-300 relative overflow-hidden flex flex-col justify-between">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gold/10 rounded-bl-full -mr-16 -mt-16 transition-transform duration-300 group-hover:scale-110 pointer-events-none" />
                <div>
                  <h3 className="text-xl font-bold text-midnight group-hover:text-white transition-colors duration-300 mb-4 font-urbanist">
                    Recurring Fractional CFO
                  </h3>
                  <p className="text-gray-600 group-hover:text-gray-300 transition-colors duration-300 text-sm leading-relaxed mb-6">
                    A long-term partnership providing consistent strategic oversight, monthly board reporting, and continuous financial leadership alongside your management team.
                  </p>
                </div>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3 text-sm text-gray-600 group-hover:text-gray-300 transition-colors duration-300">
                    <CheckCircle size={16} className="text-gold mt-0.5 flex-shrink-0" /> Regular cadence meetings
                  </li>
                  <li className="flex items-start gap-3 text-sm text-gray-600 group-hover:text-gray-300 transition-colors duration-300">
                    <CheckCircle size={16} className="text-gold mt-0.5 flex-shrink-0" /> Ongoing cash & budget management
                  </li>
                </ul>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={optionsInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
              className="group h-full"
            >
              <div className="h-full bg-[#faf8f5] group-hover:bg-midnight rounded-lg p-8 border border-gray-100 group-hover:border-midnight shadow-sm group-hover:shadow-2xl group-hover:shadow-midnight/20 group-hover:-translate-y-1 transition-all duration-300 relative overflow-hidden flex flex-col justify-between">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gold/10 rounded-bl-full -mr-16 -mt-16 transition-transform duration-300 group-hover:scale-110 pointer-events-none" />
                <div>
                  <h3 className="text-xl font-bold text-midnight group-hover:text-white transition-colors duration-300 mb-4 font-urbanist">
                    Finance Improvement Project
                  </h3>
                  <p className="text-gray-600 group-hover:text-gray-300 transition-colors duration-300 text-sm leading-relaxed mb-6">
                    A defined, scoped project focused on overhauling specific financial operations, implementing new systems, or rebuilding your reporting infrastructure.
                  </p>
                </div>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3 text-sm text-gray-600 group-hover:text-gray-300 transition-colors duration-300">
                    <CheckCircle size={16} className="text-gold mt-0.5 flex-shrink-0" /> Clear start and end dates
                  </li>
                  <li className="flex items-start gap-3 text-sm text-gray-600 group-hover:text-gray-300 transition-colors duration-300">
                    <CheckCircle size={16} className="text-gold mt-0.5 flex-shrink-0" /> Specific, measurable deliverables
                  </li>
                </ul>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={optionsInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
              className="group h-full"
            >
              <div className="h-full bg-[#faf8f5] group-hover:bg-midnight rounded-lg p-8 border border-gray-100 group-hover:border-midnight shadow-sm group-hover:shadow-2xl group-hover:shadow-midnight/20 group-hover:-translate-y-1 transition-all duration-300 relative overflow-hidden flex flex-col justify-between">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gold/10 rounded-bl-full -mr-16 -mt-16 transition-transform duration-300 group-hover:scale-110 pointer-events-none" />
                <div>
                  <h3 className="text-xl font-bold text-midnight group-hover:text-white transition-colors duration-300 mb-4 font-urbanist">
                    Strategic Review Support
                  </h3>
                  <p className="text-gray-600 group-hover:text-gray-300 transition-colors duration-300 text-sm leading-relaxed mb-6">
                    High-level advisory for crucial business moments, such as preparing for investment, navigating M&A, or undertaking a major strategic pivot.
                  </p>
                </div>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3 text-sm text-gray-600 group-hover:text-gray-300 transition-colors duration-300">
                    <CheckCircle size={16} className="text-gold mt-0.5 flex-shrink-0" /> Intensive, focused advisory
                  </li>
                  <li className="flex items-start gap-3 text-sm text-gray-600 group-hover:text-gray-300 transition-colors duration-300">
                    <CheckCircle size={16} className="text-gold mt-0.5 flex-shrink-0" /> Decision-ready financial modeling
                  </li>
                </ul>
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
