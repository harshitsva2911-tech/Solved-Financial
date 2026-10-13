import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { UploadCloud, FileText, MessageSquare, CheckCircle, ArrowRight } from 'lucide-react';

import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import FooterCTA from '../components/common/FooterCTA';
import PageHero from '../components/common/PageHero';

const HERO_BG = 'https://imperial-ventures-assets.s3.eu-north-1.amazonaws.com/website/service-operations-advisory.png';

const journeySteps = [
  { stage: '1. Introductory conversation', happens: 'Discuss the entity, business, current finance setup and required support.', takeaway: 'The service is tailored to my business.' },
  { stage: '2. Scope and onboarding', happens: 'Agree fees and responsibilities, complete required onboarding and gather opening records.', takeaway: 'I know what is included and what I must provide.' },
  { stage: '3. Systems setup', happens: 'Configure Dext, invoicing access and TaxDome as included; train the client.', takeaway: 'I know where to submit documents, invoice and communicate.' },
  { stage: '4. Ongoing financial administration', happens: 'Receive records, review transactions, reconcile and follow up missing information.', takeaway: 'My accounting follows an organised process.' },
  { stage: '5. Reports and discussions', happens: 'Provide reports and meetings at the agreed level and frequency.', takeaway: 'The information helps me run the business.' },
  { stage: '6. Additional expertise', happens: 'Coordinate specialist work with the relevant providers when needed.', takeaway: 'I know who is responsible for specialist advice.' }
];

const systemPanels = [
  { title: 'Submit documents', desc: 'Securely upload receipts, bills, and purchase invoices directly to our processing queue.', icon: UploadCloud },
  { title: 'Issue invoices', desc: 'Create and send company-branded sales invoices directly from your configured accounting software.', icon: FileText },
  { title: 'Stay connected', desc: 'Access your dedicated client portal to track progress, upload files, and communicate directly with our team.', icon: MessageSquare }
];

export default function HowWeWork() {
  const journeyRef = useRef(null);
  const journeyInView = useInView(journeyRef, { amount: 0.1, once: true });

  const systemsRef = useRef(null);
  const systemsInView = useInView(systemsRef, { amount: 0.2, once: true });

  const expectationsRef = useRef(null);
  const expectationsInView = useInView(expectationsRef, { amount: 0.2, once: true });

  return (
    <main className="min-h-screen bg-cream">
      <Navbar />
      
      <PageHero
        title="How We Work"
        subtitle="A highly organised digital experience retaining personal contact."
        breadcrumb={[{ label: 'Home', to: '/' }, { label: 'How We Work' }]}
        bgImage={HERO_BG}
      />

      {/* The Client Journey */}
      <section className="py-24 bg-white" ref={journeyRef}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={journeyInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="text-center mb-16"
          >
            <span className="text-gold font-bold tracking-[0.2em] uppercase text-xs mb-4 block">Our Process</span>
            <h2 className="text-3xl sm:text-4xl font-bold font-urbanist text-midnight mb-6 leading-tight">
              A boutique service built on clear workflows
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
              We offer a highly organised digital experience while retaining the personal contact of a boutique firm. You’ll always know exactly what happens next and who to talk to.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-10">
            {journeySteps.map((row, i) => {
              const title = row.stage.replace(/^\d+\.\s*/, '');
              
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="bg-gradient-to-b from-white to-[#faf8f5] rounded-2xl p-6 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-gray-100 hover:border-gold/30 hover:shadow-[0_8px_30px_rgba(212,182,132,0.15)] transition-all duration-500 relative overflow-hidden group flex flex-col h-full -translate-y-0 hover:-translate-y-1"
                >
                  {/* Top Golden Accent Line */}
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-gold-light via-gold to-gold-dark opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                  {/* Subtle Background Number */}
                  <div className="absolute -right-4 -top-8 text-[120px] font-bold font-urbanist text-midnight/[0.03] group-hover:text-gold/5 transition-colors duration-500 pointer-events-none select-none z-0">
                    {i + 1}
                  </div>

                  <div className="relative z-10 flex-grow">
                    <div className="w-10 h-10 rounded-full bg-midnight shadow-[0_0_15px_rgba(212,182,132,0.2)] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-500">
                      <span className="text-gold font-bold text-base font-urbanist">{i + 1}</span>
                    </div>

                    <h3 className="text-lg font-bold text-midnight mb-2 group-hover:text-gold-dark transition-colors duration-300">{title}</h3>
                    <p className="text-gray-600 mb-4 leading-relaxed text-sm">
                      {row.happens}
                    </p>
                  </div>

                  <div className="relative z-10 mt-auto pt-4 border-t border-gray-200/60">
                    <div className="flex items-start gap-2.5">
                      <span className="text-gold mt-0.5 group-hover:scale-110 transition-transform duration-300"><CheckCircle size={15} /></span>
                      <p className="text-sm font-semibold text-midnight/80 italic">
                        "{row.takeaway}"
                      </p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Digital Service Experience Panels */}
      <section className="py-24 bg-midnight relative overflow-hidden" ref={systemsRef}>
        <div className="absolute inset-0 bg-[url('https://imperial-ventures-assets.s3.eu-north-1.amazonaws.com/website/grid-pattern.svg')] opacity-5" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={systemsInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="text-center mb-16"
          >
            <span className="text-gold font-bold tracking-[0.2em] uppercase text-xs mb-4 block">The Systems</span>
            <h2 className="text-3xl font-bold font-urbanist text-white mb-6">
              Turning systems into a service experience
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto leading-relaxed">
              We leverage leading digital platforms seamlessly configured to your business, ensuring that your records remain secure, transparent, and effortlessly manageable.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {systemPanels.map((panel, i) => {
              const Icon = panel.icon;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  animate={systemsInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                  transition={{ duration: 0.5, delay: i * 0.15 }}
                  className="bg-white/5 border border-white/10 rounded-xl overflow-hidden backdrop-blur-sm group hover:border-gold/30 transition-all duration-300"
                >
                  <div className="h-48 bg-white/5 relative border-b border-white/5 flex items-center justify-center p-6">
                    {/* Placeholder for demonstration screenshots */}
                    <div className="w-full h-full border border-dashed border-white/20 rounded-md flex flex-col items-center justify-center text-white/20 group-hover:text-gold/30 transition-colors">
                       <Icon size={48} className="mb-3 opacity-50" />
                       <span className="text-xs uppercase tracking-widest font-bold opacity-50">App Interface View</span>
                    </div>
                  </div>
                  <div className="p-8">
                    <h3 className="text-xl font-bold text-white mb-3">{panel.title}</h3>
                    <p className="text-gray-400 text-sm leading-relaxed">{panel.desc}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
          
          <motion.div 
            initial={{ opacity: 0 }}
            animate={systemsInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="mt-12 text-center"
          >
            <a 
              href="https://taxdome.com/login" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-8 py-3 rounded-full bg-gold text-midnight font-bold hover:bg-white hover:text-midnight transition-all duration-300 shadow-md"
            >
              Access Client Portal <ArrowRight size={16} />
            </a>
          </motion.div>
        </div>
      </section>

      {/* What we need from you */}
      <section className="py-24 bg-cream border-y border-gray-100" ref={expectationsRef}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 md:p-12">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={expectationsInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -30 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              <h2 className="text-2xl font-bold font-urbanist text-midnight mb-6 flex items-center gap-3">
                <span className="w-8 h-8 rounded-full bg-gold/20 flex items-center justify-center text-gold">
                  <CheckCircle size={16} />
                </span>
                What we need from you
              </h2>
              <p className="text-gray-600 mb-8 leading-relaxed">
                A successful partnership relies on smooth collaboration. To deliver accurate reports and timely advice, we ask our clients to adhere to a few simple practices:
              </p>
              
              <ul className="space-y-4">
                <li className="flex items-start gap-4 p-4 rounded-lg bg-[#faf8f5]">
                  <div className="w-6 h-6 rounded-full bg-gold text-midnight font-bold flex items-center justify-center flex-shrink-0 text-sm mt-0.5">1</div>
                  <div>
                    <h4 className="font-bold text-midnight mb-1">Timely Uploads</h4>
                    <p className="text-sm text-gray-600">Submit all purchase invoices and receipts promptly through the provided systems before month-end processing.</p>
                  </div>
                </li>
                <li className="flex items-start gap-4 p-4 rounded-lg bg-[#faf8f5]">
                  <div className="w-6 h-6 rounded-full bg-gold text-midnight font-bold flex items-center justify-center flex-shrink-0 text-sm mt-0.5">2</div>
                  <div>
                    <h4 className="font-bold text-midnight mb-1">Accurate Invoice Details</h4>
                    <p className="text-sm text-gray-600">Ensure sales invoices generated contain correct counterparty information, VAT details, and clearly stated services.</p>
                  </div>
                </li>
                <li className="flex items-start gap-4 p-4 rounded-lg bg-[#faf8f5]">
                  <div className="w-6 h-6 rounded-full bg-gold text-midnight font-bold flex items-center justify-center flex-shrink-0 text-sm mt-0.5">3</div>
                  <div>
                    <h4 className="font-bold text-midnight mb-1">Responsive Communication</h4>
                    <p className="text-sm text-gray-600">Review tasks and clarify unknown transactions or missing documentation when requested via the client portal.</p>
                  </div>
                </li>
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      <FooterCTA />
      <Footer />
    </main>
  );
}
