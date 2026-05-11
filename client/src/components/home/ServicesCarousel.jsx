import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, A11y } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { getServices } from '../../utils/api';

const FALLBACK_SERVICES = [
  {
    _id: '1',
    slug: 'cfo-strategic-advisory',
    title: 'CFO & Strategic Advisory',
    excerpt: 'Solved Financial Services provides CFO-level expertise to founders, management teams, and boards requiring senior financial leadership, strategic insight, and decision-making support.',
    image: 'https://imperial-ventures-assets.s3.eu-north-1.amazonaws.com/website/service-cfo-advisory.png',
  },
  {
    _id: '2',
    slug: 'accounting-compliance',
    title: 'Accounting & Compliance',
    excerpt: 'Solved Financial Services delivers structured, compliant, and transparent financial administration tailored to the operational and regulatory needs of growing organisations.',
    image: 'https://imperial-ventures-assets.s3.eu-north-1.amazonaws.com/website/service-accounting.png',
  },
  {
    _id: '3',
    slug: 'audit-assurance',
    title: 'Audit & Assurance',
    excerpt: 'Independent audit and assurance services providing stakeholders with the confidence and transparency needed to make informed financial decisions.',
    image: 'https://imperial-ventures-assets.s3.eu-north-1.amazonaws.com/website/service-audit-assurance.png',
  },
  {
    _id: '4',
    slug: 'finance-setup-structuring',
    title: 'Finance Setup & Structuring',
    excerpt: 'End-to-end design and implementation of financial infrastructure, reporting systems, and governance frameworks tailored to your business lifecycle.',
    image: 'https://imperial-ventures-assets.s3.eu-north-1.amazonaws.com/website/service-finance-setup.png',
  },
  {
    _id: '5',
    slug: 'company-incorporation',
    title: 'Company Incorporation',
    excerpt: 'Seamless company formation across key European jurisdictions with full compliance advisory, regulatory guidance, and post-incorporation support.',
    image: 'https://imperial-ventures-assets.s3.eu-north-1.amazonaws.com/website/service-company-incorporation.png',
  },
  {
    _id: '6',
    slug: 'cross-border-advisory',
    title: 'Cross-Border Advisory',
    excerpt: 'Strategic guidance on international expansion, cross-border structuring, and multi-jurisdictional compliance to support your global ambitions.',
    image: 'https://imperial-ventures-assets.s3.eu-north-1.amazonaws.com/website/service-cross-border-advisory.png',
  },
];

// Unique placeholder gradient per card index
const placeholderGradients = [
  'from-midnight to-blue-900',
  'from-slate-800 to-midnight',
  'from-blue-950 to-midnight',
  'from-midnight via-blue-900 to-slate-900',
  'from-slate-900 to-blue-950',
  'from-blue-900 to-midnight',
];

function ServiceCard({ service, index }) {
  const [imgError, setImgError] = React.useState(false);
  return (
    <Link
      to={`/services#${service.slug}`}
      className="group flex flex-col h-full rounded-xl overflow-hidden border border-gray-200 bg-white hover:border-gold/40 hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300"
    >
      {/* Image / Placeholder */}
      <div className="relative h-44 overflow-hidden flex-shrink-0">
        {service.image && !imgError ? (
          <img
            src={service.image}
            alt={service.title}
            onError={() => setImgError(true)}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div
            className={`w-full h-full bg-gradient-to-br ${placeholderGradients[index % placeholderGradients.length]} flex items-center justify-center`}
          >
            <div className="text-center px-4">
              <div
                className="text-3xl font-bold mb-1"
                style={{
                  background: 'linear-gradient(135deg, #D4B684, #B89A60)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                {service.title.charAt(0)}
              </div>
            </div>
          </div>
        )}
        {/* Gold top bar on hover */}
        <div
          className="absolute top-0 left-0 right-0 h-0.5 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"
          style={{ background: 'linear-gradient(90deg, #D4B684, #B89A60)' }}
        />
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-6">
        <h3 className="text-lg font-bold text-midnight mb-3 group-hover:text-gold transition-colors duration-200">
          {service.title}
        </h3>
        <p className="text-sm text-gray-500 leading-relaxed flex-1 mb-4">
          {service.excerpt || service.description}
        </p>
        <div className="flex items-center gap-1.5 text-gold text-sm font-semibold">
          Learn more
          <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
        </div>
      </div>
    </Link>
  );
}

function CardSkeleton() {
  return (
    <div className="rounded-xl overflow-hidden border border-gray-200 bg-white animate-pulse">
      <div className="h-44 bg-gray-200" />
      <div className="p-6">
        <div className="h-5 bg-gray-200 rounded w-2/3 mb-3" />
        <div className="h-3 bg-gray-100 rounded w-full mb-2" />
        <div className="h-3 bg-gray-100 rounded w-5/6 mb-2" />
        <div className="h-3 bg-gray-100 rounded w-4/6 mb-4" />
        <div className="h-4 bg-gray-200 rounded w-1/3" />
      </div>
    </div>
  );
}

export default function ServicesCarousel() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getServices()
      .then((res) => {
        const data = Array.isArray(res.data) ? res.data : res.data?.services || [];
        setServices(data.length ? data : FALLBACK_SERVICES);
      })
      .catch(() => {
        setServices(FALLBACK_SERVICES);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="py-20 bg-cream overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55 }}
          className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12"
        >
          <div>
            <span className="inline-flex items-center gap-2 text-xs font-semibold tracking-[0.2em] uppercase text-gold mb-3">
              <span className="h-px w-6 bg-gold" />
              Services Overview
            </span>
            <h2 className="font-urbanist text-3xl sm:text-4xl font-bold text-midnight">
              What We Do
            </h2>
          </div>
          <Link
            to="/services"
            className="group inline-flex items-center gap-1.5 text-sm font-semibold text-midnight hover:text-gold transition-colors duration-200 whitespace-nowrap"
          >
            View all services
            <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
          </Link>
        </motion.div>

        {/* Custom navigation buttons — hidden on mobile, visible on md+ */}
        <div className="relative">
          <button
            className="swiper-prev-services hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 lg:-translate-x-6 z-10 w-11 h-11 rounded-full bg-white border border-gray-200 shadow-md items-center justify-center text-midnight hover:border-gold hover:text-gold transition-all duration-200 hover:shadow-lg"
            aria-label="Previous"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            className="swiper-next-services hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 lg:translate-x-6 z-10 w-11 h-11 rounded-full bg-white border border-gray-200 shadow-md items-center justify-center text-midnight hover:border-gold hover:text-gold transition-all duration-200 hover:shadow-lg"
            aria-label="Next"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => <CardSkeleton key={i} />)}
            </div>
          ) : (
            <Swiper
              modules={[Navigation, Pagination, A11y]}
              spaceBetween={24}
              navigation={{
                prevEl: '.swiper-prev-services',
                nextEl: '.swiper-next-services',
              }}
              pagination={{
                clickable: true,
                bulletClass: 'swiper-bullet',
                bulletActiveClass: 'swiper-bullet-active',
              }}
              breakpoints={{
                0: { slidesPerView: 1 },
                640: { slidesPerView: 2 },
                1024: { slidesPerView: 3 },
              }}
              className="services-swiper pb-12"
            >
              {services.map((service, i) => (
                <SwiperSlide key={service._id || service.id || i} style={{ height: 'auto', display: 'flex', flexDirection: 'column' }}>
                  <ServiceCard service={service} index={i} />
                </SwiperSlide>
              ))}
            </Swiper>
          )}
        </div>
      </div>

      {/* Swiper custom styles */}
      <style>{`
        .services-swiper .swiper-wrapper {
          align-items: stretch;
        }
        .services-swiper .swiper-slide {
          height: auto !important;
        }
        .services-swiper .swiper-slide > a {
          height: 100%;
        }
        .services-swiper .swiper-pagination {
          bottom: 0;
          display: flex;
          justify-content: center;
          gap: 6px;
        }
        .services-swiper .swiper-bullet {
          display: inline-block;
          width: 8px;
          height: 8px;
          border-radius: 999px;
          background: #D1D5DB;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        .services-swiper .swiper-bullet-active {
          background: #D4B684;
          width: 24px;
        }
      `}</style>
    </section>
  );
}
