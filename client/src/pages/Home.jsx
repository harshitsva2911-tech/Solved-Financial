import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, TrendingUp, Laptop, CheckCircle2, Shield } from 'lucide-react';
import axios from 'axios';
import API_BASE from '../utils/config';

import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import FeaturedArticles from '../components/home/FeaturedArticles';

// Animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } }
};

export default function Home() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`${API_BASE}/homepage`)
      .then(res => {
        setData(res.data.data ?? res.data);
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-midnight flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gold"></div>
      </div>
    );
  }

  const { hero, countryCards, boutiqueSection, digitalExperience, cfoMaSection, closingInvitation } = data || {};

  return (
    <div className="bg-cream min-h-screen font-sans text-midnight selection:bg-gold/30">
      <Navbar />
      
      <main>
        {/* 1. Hero Section */}
        <section className="relative min-h-[70vh] bg-midnight flex items-center pt-28 pb-32 overflow-hidden">
          {/* Background Image & Overlays */}
          <div className="absolute inset-0 z-0">
            <img 
              src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1920&q=80" 
              alt="Modern architectural office" 
              className="w-full h-full object-cover"
            />
            {/* Lighter overlay to show more of the image while keeping text readable */}
            <div className="absolute inset-0 bg-midnight/60"></div>
            
            {/* Subtle Grid Pattern Overlay */}
            <div 
              className="absolute inset-0 opacity-[0.05] pointer-events-none" 
              style={{
                backgroundImage: 'linear-gradient(rgba(212,182,132,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(212,182,132,0.8) 1px, transparent 1px)', 
                backgroundSize: '40px 40px'
              }}
            ></div>
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-midnight/40 to-midnight"></div>
          </div>
          
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full flex flex-col items-center text-center mt-10">
            
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-3 px-4 py-2 rounded-full border border-gold/30 bg-midnight/50 backdrop-blur-sm mb-8"
            >
              <span className="w-2 h-2 rounded-full bg-gold shadow-[0_0_8px_#D4B684]"></span>
              <span className="text-gold text-xs font-bold tracking-widest uppercase">Boutique Financial Advisory</span>
            </motion.div>

            <motion.h1 
              initial="hidden" animate="visible" variants={fadeInUp}
              className="text-5xl md:text-6xl lg:text-[4.5rem] font-bold text-white tracking-tight mb-8 font-urbanist leading-[1.1]"
              dangerouslySetInnerHTML={{ __html: hero?.headline || 'Personal financial expertise.<br/><span class="text-transparent bg-clip-text bg-gradient-to-r from-gold via-[#E8D4A8] to-gold">Clearer business decisions.</span>' }}
            />
            
            <motion.p 
              initial="hidden" animate="visible" variants={fadeInUp} transition={{ delay: 0.1 }}
              className="text-lg md:text-xl text-gray-300 max-w-2xl mb-10 leading-relaxed font-light drop-shadow-md"
            >
              {hero?.text || 'Accounting, CFO and M&A advisory for businesses in Cyprus and the Netherlands. We combine personal attention with structured digital processes.'}
            </motion.p>
            
            <motion.div 
              initial="hidden" animate="visible" variants={fadeInUp} transition={{ delay: 0.2 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-5 w-full sm:w-auto"
            >
              <Link 
                to="/contact" 
                className="w-full sm:w-auto px-8 py-4 bg-gold text-midnight font-bold rounded-sm hover:bg-white transition-all duration-300 flex items-center justify-center gap-2"
              >
                Book an Introductory Call <ArrowRight size={18} />
              </Link>
            </motion.div>
          </div>
        </section>

        {/* 2. Country Choices */}
        <section id="jurisdictions" className="py-20 bg-white relative z-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-32">
            <div className="grid md:grid-cols-2 gap-8">
              {/* Cyprus Card */}
              <motion.div 
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeInUp}
                whileHover={{ y: -6 }}
                transition={{ duration: 0.25, ease: 'easeOut' }}
                className="group h-full"
              >
                <Link 
                  to={countryCards?.cyprus?.link || '/jurisdictions/cyprus'}
                  className="block h-full relative bg-white group-hover:bg-midnight p-12 rounded-xl border border-gray-100 group-hover:border-midnight shadow-xl shadow-midnight/5 group-hover:shadow-2xl group-hover:shadow-midnight/25 transition-all duration-300"
                >
                  <div className="flex items-center gap-4 mb-6">
                    <span className="text-4xl shadow-sm rounded-sm overflow-hidden block leading-none">🇨🇾</span>
                    <h3 className="text-3xl font-bold font-urbanist text-midnight group-hover:text-white transition-colors duration-300">
                      {countryCards?.cyprus?.title || 'Cyprus'}
                    </h3>
                  </div>
                  <p className="text-gray-600 group-hover:text-gray-300 mb-10 leading-relaxed min-h-[80px] transition-colors duration-300">
                    {countryCards?.cyprus?.text || 'Digital accounting (Accounting, VAT), company support and M&A advisory, with easy document submission, client invoicing and organised communication.'}
                  </p>
                  <span className="inline-flex items-center gap-2 text-midnight group-hover:text-gold font-bold transition-colors duration-300">
                    {countryCards?.cyprus?.buttonLabel || 'Explore Cyprus Services'}
                    <ArrowRight size={18} className="transition-transform duration-300 group-hover:translate-x-1.5" />
                  </span>
                </Link>
              </motion.div>
              
              {/* Netherlands Card */}
              <motion.div 
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeInUp}
                transition={{ delay: 0.1 }}
                whileHover={{ y: -6 }}
                className="group h-full"
              >
                <Link 
                  to={countryCards?.netherlands?.link || '/jurisdictions/netherlands'}
                  className="block h-full relative bg-white group-hover:bg-midnight p-12 rounded-xl border border-gray-100 group-hover:border-midnight shadow-xl shadow-midnight/5 group-hover:shadow-2xl group-hover:shadow-midnight/25 transition-all duration-300"
                >
                  <div className="flex items-center gap-4 mb-6">
                    <span className="text-4xl shadow-sm rounded-sm overflow-hidden block leading-none">🇳🇱</span>
                    <h3 className="text-3xl font-bold font-urbanist text-midnight group-hover:text-white transition-colors duration-300">
                      {countryCards?.netherlands?.title || 'Netherlands'}
                    </h3>
                  </div>
                  <p className="text-gray-600 group-hover:text-gray-300 mb-10 leading-relaxed min-h-[80px] transition-colors duration-300">
                    {countryCards?.netherlands?.text || 'CFO and M&A advisory for entrepreneurs and growing businesses, with reporting and processes that support better decisions.'}
                  </p>
                  <span className="inline-flex items-center gap-2 text-midnight group-hover:text-gold font-bold transition-colors duration-300">
                    {countryCards?.netherlands?.buttonLabel || 'Explore Netherlands Services'}
                    <ArrowRight size={18} className="transition-transform duration-300 group-hover:translate-x-1.5" />
                  </span>
                </Link>
              </motion.div>
            </div>
          </div>
        </section>

        {/* 3. Boutique Relationship */}
        <section className="py-24 bg-cream">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <motion.div initial="hidden" whileInView="visible" viewport={{once:true}} variants={fadeInUp}>
                <span className="text-gold font-bold tracking-[0.2em] uppercase text-xs mb-4 block">Boutique Relationship</span>
                <h2 className="text-4xl lg:text-5xl font-bold font-urbanist text-midnight mb-8 leading-tight">
                  A closer working relationship.
                </h2>
                <p className="text-lg text-gray-600 mb-10 leading-relaxed">
                  {boutiqueSection?.text || 'Our accounting and client-support team takes time to understand your business and priorities, and agrees the right level of support with you. From financial administration to CFO advisory, our focus is clear information, practical action and continuity as your business develops.'}
                </p>
                <ul className="space-y-5">
                  {['Senior involvement on all accounts', 'An agreed and transparent scope of work', 'A dedicated, named contact point', 'Practical, actionable financial advice'].map((item, i) => (
                    <li key={i} className="flex items-center gap-4 text-midnight font-medium">
                      <CheckCircle2 className="text-gold flex-shrink-0" size={22} /> 
                      <span className="text-base">{item}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
              <div className="relative h-[600px] rounded-sm overflow-hidden shadow-2xl">
                <img src="https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1000&q=80" alt="Boutique advisory" className="absolute inset-0 w-full h-full object-cover" />
                <div className="absolute inset-0 bg-midnight/10 mix-blend-multiply"></div>
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-gold/90 -translate-x-16 translate-y-16 rotate-45"></div>
              </div>
            </div>
          </div>
        </section>

        {/* 4. Digital Client Experience */}
        <section className="py-24 bg-white border-t border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <span className="text-gold font-bold tracking-[0.2em] uppercase text-xs mb-4 block">Digital Client Experience</span>
              <h2 className="text-4xl font-bold font-urbanist text-midnight">{digitalExperience?.text || 'Modern processes for digital businesses.'}</h2>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              {/* Panel 1 */}
              <motion.div 
                initial="hidden" whileInView="visible" viewport={{once:true}} variants={fadeInUp}
                className="bg-[#faf8f5] p-10 rounded-sm shadow-sm border border-gray-100 hover:border-gold transition-colors text-center"
              >
                <div className="w-16 h-16 mx-auto bg-white rounded-full flex items-center justify-center mb-6 shadow-sm border border-gray-100">
                  <Laptop size={24} className="text-gold" />
                </div>
                <h3 className="text-xl font-bold font-urbanist text-midnight mb-4">Document Capture</h3>
                <p className="text-gray-600 leading-relaxed text-sm">
                  Seamlessly submit receipts and invoices on the go. We integrate with industry-leading tools like Dext to automate data entry and keep your records perfectly organised.
                </p>
              </motion.div>

              {/* Panel 2 */}
              <motion.div 
                initial="hidden" whileInView="visible" viewport={{once:true}} variants={fadeInUp} transition={{delay: 0.1}}
                className="bg-[#faf8f5] p-10 rounded-sm shadow-sm border border-gray-100 hover:border-gold transition-colors text-center"
              >
                <div className="w-16 h-16 mx-auto bg-white rounded-full flex items-center justify-center mb-6 shadow-sm border border-gray-100">
                  <TrendingUp size={24} className="text-gold" />
                </div>
                <h3 className="text-xl font-bold font-urbanist text-midnight mb-4">Cloud Accounting</h3>
                <p className="text-gray-600 leading-relaxed text-sm">
                  Real-time visibility into your finances. We configure your accounting software and invoicing systems for maximum efficiency and VAT compliance.
                </p>
              </motion.div>

              {/* Panel 3 */}
              <motion.div 
                initial="hidden" whileInView="visible" viewport={{once:true}} variants={fadeInUp} transition={{delay: 0.2}}
                className="bg-[#faf8f5] p-10 rounded-sm shadow-sm border border-gray-100 hover:border-gold transition-colors text-center"
              >
                <div className="w-16 h-16 mx-auto bg-white rounded-full flex items-center justify-center mb-6 shadow-sm border border-gray-100">
                  <Shield size={24} className="text-gold" />
                </div>
                <h3 className="text-xl font-bold font-urbanist text-midnight mb-4">Secure Portal</h3>
                <p className="text-gray-600 leading-relaxed text-sm">
                  A centralised TaxDome environment for secure document sharing, electronic signatures, and direct communication with your dedicated support team.
                </p>
              </motion.div>
            </div>
          </div>
        </section>

        {/* 5. CFO & M&A Advisory */}
        <section className="py-28 bg-midnight text-white relative overflow-hidden">
          <div className="absolute inset-0 opacity-10 bg-[url('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80')] bg-cover bg-center"></div>
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
            <motion.div initial="hidden" whileInView="visible" viewport={{once:true}} variants={fadeInUp}>
              <span className="text-gold font-bold tracking-[0.2em] uppercase text-xs mb-6 block">CFO & M&A Advisory</span>
              <h2 className="text-4xl lg:text-6xl font-bold font-urbanist mb-8 leading-tight">
                Strategic leadership for growing enterprises.
              </h2>
              <p className="text-xl text-gray-300 mb-12 leading-relaxed">
                {cfoMaSection?.text || 'Cash flow management, financial leadership, acquisition searches, and transaction support designed to elevate your business trajectory.'}
              </p>
              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <Link to="/cfo-ma" className="px-10 py-4 bg-white text-midnight font-bold rounded-sm hover:bg-gray-100 transition-colors">
                  Explore CFO Services
                </Link>
                <Link to="/cfo-ma" className="px-10 py-4 border-2 border-white/20 text-white font-bold rounded-sm hover:bg-white/10 transition-colors">
                  Explore M&A Support
                </Link>
              </div>
            </motion.div>
          </div>
        </section>

        {/* 6. Verified Experience */}
        <section className="py-24 bg-[#faf8f5]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <span className="text-gold font-bold tracking-[0.2em] uppercase text-xs mb-4 block">Verified Experience</span>
              <h2 className="text-4xl font-bold font-urbanist text-midnight">Proven track record.</h2>
            </div>
            
            <div className="grid md:grid-cols-2 gap-10 max-w-5xl mx-auto">
              <motion.div initial="hidden" whileInView="visible" viewport={{once:true}} variants={fadeInUp} className="bg-white p-10 rounded-sm shadow-xl shadow-midnight/5 border-t-4 border-gold">
                <div className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Solved Client Work</div>
                <h3 className="text-2xl font-bold text-midnight mb-4 font-urbanist">Cross-Border Corporate Structuring</h3>
                <p className="text-gray-600 mb-8 leading-relaxed">Provided comprehensive corporate advisory for a European technology firm, ensuring tax-efficient structuring and smooth integration of financial operations across Cyprus and the Netherlands.</p>
                <div className="flex flex-wrap gap-3">
                  <span className="px-4 py-1.5 bg-cream text-xs font-bold text-midnight rounded-full border border-gray-200">Corporate Advisory</span>
                  <span className="px-4 py-1.5 bg-cream text-xs font-bold text-midnight rounded-full border border-gray-200">Tax Strategy</span>
                </div>
              </motion.div>
              
              <motion.div initial="hidden" whileInView="visible" viewport={{once:true}} variants={fadeInUp} transition={{delay:0.1}} className="bg-white p-10 rounded-sm shadow-xl shadow-midnight/5 border-t-4 border-midnight">
                <div className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Founder Experience</div>
                <h3 className="text-2xl font-bold text-midnight mb-4 font-urbanist">Outsourced CFO for Tech Scale-up</h3>
                <p className="text-gray-600 mb-8 leading-relaxed">Established full finance department and reporting structures for a rapidly growing SaaS business, resulting in a successful Series B funding round and streamlined operational cash flow.</p>
                <div className="flex flex-wrap gap-3">
                  <span className="px-4 py-1.5 bg-cream text-xs font-bold text-midnight rounded-full border border-gray-200">CFO Support</span>
                  <span className="px-4 py-1.5 bg-cream text-xs font-bold text-midnight rounded-full border border-gray-200">Netherlands</span>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* 7. Meet the Team */}
        <section className="py-24 bg-white border-t border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-3 gap-16 items-center">
              <div className="lg:col-span-1">
                <span className="text-gold font-bold tracking-[0.2em] uppercase text-xs mb-4 block">Meet the Team</span>
                <h2 className="text-4xl font-bold font-urbanist text-midnight mb-6 leading-tight">Professionals at your service.</h2>
                <p className="text-gray-600 mb-8 leading-relaxed">Our core leadership team brings decades of combined experience in international finance, accounting, and M&A advisory across European markets.</p>
                <Link to="/about" className="inline-flex items-center gap-2 text-gold font-bold hover:text-midnight transition-colors border-b-2 border-gold/30 hover:border-midnight pb-1">
                  View Full Profile <ArrowRight size={18} />
                </Link>
              </div>
              <div className="lg:col-span-2 grid sm:grid-cols-2 gap-6">
                <div className="group relative rounded-sm overflow-hidden aspect-[4/5] shadow-lg bg-midnight">
                  <img src={`${API_BASE.replace(/\/api$/, '')}/uploads/1777556433499-797707328.jpeg`} alt="Chris Kyriakides" className="w-full h-full object-cover transition-all duration-700 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-midnight/90 via-midnight/20 to-transparent"></div>
                  <div className="absolute bottom-0 left-0 p-8 w-full">
                    <h3 className="text-white font-bold font-urbanist text-2xl mb-1">Chris</h3>
                    <p className="text-gold text-sm font-semibold tracking-wide uppercase">Managing Partner</p>
                  </div>
                </div>
                <div className="group relative rounded-sm overflow-hidden aspect-[4/5] shadow-lg bg-midnight">
                  <img src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="Client Support Team" className="w-full h-full object-cover grayscale opacity-90 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-midnight/90 via-midnight/20 to-transparent"></div>
                  <div className="absolute bottom-0 left-0 p-8 w-full">
                    <h3 className="text-white font-bold font-urbanist text-2xl mb-1">Advisory Team</h3>
                    <p className="text-gold text-sm font-semibold tracking-wide uppercase">Accounting & Client Support</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 8. Selected Insights */}
        <div className="border-t border-gray-100">
          <FeaturedArticles />
        </div>

        {/* 9. Closing Invitation */}
        <section className="py-32 bg-midnight relative overflow-hidden">
          <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(circle at center, rgba(212,182,132,0.1) 0%, transparent 60%)' }} />
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
            <motion.div initial="hidden" whileInView="visible" viewport={{once:true}} variants={fadeInUp}>
              <h2 className="text-4xl md:text-5xl font-bold font-urbanist text-white mb-10 leading-tight">
                {closingInvitation?.text || 'Tell us about your business. We will help you identify the right support.'}
              </h2>
              <Link to="/contact" className="inline-flex items-center gap-3 px-10 py-5 bg-gold text-midnight font-bold rounded-sm text-lg hover:bg-white hover:text-midnight transition-colors duration-300 shadow-xl shadow-gold/20">
                Book an Introductory Call <ArrowRight size={20} />
              </Link>
            </motion.div>
          </div>
        </section>

      </main>
      <Footer />
    </div>
  );
}
