import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Calendar, Clock } from 'lucide-react';
import { getArticles } from '../../utils/api';

const FALLBACK_ARTICLES = [
  {
    _id: '1',
    slug: 'navigating-cross-border-tax-structures',
    title: 'Navigating Cross-Border Tax Structures in the Post-BEPS Era',
    excerpt:
      'How multinational enterprises can build resilient, compliant tax structures in a rapidly evolving international regulatory landscape.',
    image: 'https://imperial-ventures-assets.s3.eu-north-1.amazonaws.com/website/insight-article-1.png',
    publishedAt: '2026-03-18',
    readTime: '8 min read',
    category: 'Tax Strategy',
    featured: true,
  },
  {
    _id: '2',
    slug: 'cfo-role-scale-ups',
    title: 'The Evolving CFO Role in High-Growth Scale-Ups',
    excerpt:
      'Why ambitious scale-ups need strategic financial leadership from day one — and how to find it.',
    image: 'https://imperial-ventures-assets.s3.eu-north-1.amazonaws.com/website/insight-article-2.png',
    publishedAt: '2026-03-16',
    readTime: '5 min read',
    category: 'Advisory',
    featured: true,
  },
  {
    _id: '3',
    slug: 'cyprus-holding-structures',
    title: 'Cyprus Holding Structures: A Current Outlook',
    excerpt:
      'Key regulatory and tax developments affecting Cyprus-based international holding companies.',
    image: 'https://imperial-ventures-assets.s3.eu-north-1.amazonaws.com/website/insight-article-3.png',
    publishedAt: '2026-03-16',
    readTime: '6 min read',
    category: 'Jurisdictions',
    featured: true,
  },
  {
    _id: '4',
    slug: 'financial-readiness-series-a',
    title: 'Financial Readiness Before Your Series A Round',
    excerpt:
      'The financial housekeeping, KPIs, and documentation investors will scrutinise before committing.',
    image: 'https://imperial-ventures-assets.s3.eu-north-1.amazonaws.com/website/insight-article-4.png',
    publishedAt: '2026-03-16',
    readTime: '7 min read',
    category: 'Fundraising',
    featured: true,
  },
  {
    _id: '5',
    slug: 'netherlands-holding-gateway',
    title: "Why the Netherlands Remains Europe's Top Holding Gateway",
    excerpt:
      'An in-depth look at participation exemption, treaty networks, and substance requirements.',
    image: 'https://imperial-ventures-assets.s3.eu-north-1.amazonaws.com/website/insight-article-5.png',
    publishedAt: '2026-03-16',
    readTime: '6 min read',
    category: 'Jurisdictions',
    featured: true,
  },
];

function formatDate(dateStr) {
  if (!dateStr) return '';
  try {
    return new Date(dateStr).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  } catch {
    return dateStr;
  }
}

/* ---- Skeleton Components ---- */
function MainSkeleton() {
  return (
    <div className="animate-pulse rounded-2xl overflow-hidden border border-gray-200 bg-white">
      <div className="h-72 sm:h-80 bg-gray-200" />
      <div className="p-8">
        <div className="h-3 bg-gray-200 rounded w-1/4 mb-4" />
        <div className="h-6 bg-gray-200 rounded w-full mb-2" />
        <div className="h-6 bg-gray-200 rounded w-3/4 mb-4" />
        <div className="h-4 bg-gray-100 rounded w-full mb-2" />
        <div className="h-4 bg-gray-100 rounded w-5/6 mb-6" />
        <div className="h-4 bg-gray-200 rounded w-1/3" />
      </div>
    </div>
  );
}

function SmallSkeleton() {
  return (
    <div className="animate-pulse flex gap-4 p-4 rounded-xl border border-gray-100 bg-white">
      <div className="w-20 h-16 bg-gray-200 rounded-lg flex-shrink-0" />
      <div className="flex-1">
        <div className="h-3 bg-gray-100 rounded w-1/3 mb-2" />
        <div className="h-4 bg-gray-200 rounded w-full mb-1" />
        <div className="h-4 bg-gray-200 rounded w-4/5" />
      </div>
    </div>
  );
}

/* ---- Main Featured Article Card ---- */
function MainArticleCard({ article }) {
  const [imgError, setImgError] = React.useState(false);
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
    >
      <Link
        to={`/insights/${article.slug}`}
        className="group block rounded-2xl overflow-hidden border border-gray-200 bg-white hover:border-gold/30 hover:shadow-xl transition-all duration-300"
      >
        {/* Image */}
        <div className="relative h-72 sm:h-80 overflow-hidden bg-gray-100">
          {article.image && !imgError ? (
            <img
              src={article.image}
              alt={article.title}
              onError={() => setImgError(true)}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-midnight to-blue-900" />
          )}
          {/* Category badge */}
          {article.category && (
            <span
              className="absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-bold text-midnight"
              style={{ background: 'linear-gradient(135deg, #D4B684, #B89A60)' }}
            >
              {article.category}
            </span>
          )}
          {/* Bottom gradient */}
          <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black/50 to-transparent" />
        </div>

        {/* Content */}
        <div className="p-6 sm:p-8">
          <div className="flex items-center gap-4 text-xs text-gray-400 mb-3">
            <span className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" />
              {formatDate(article.publishedAt)}
            </span>
            {article.readTime && (
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                {article.readTime}
              </span>
            )}
          </div>

          <h3 className="text-xl sm:text-2xl font-bold text-midnight mb-3 leading-tight group-hover:text-gold-dark transition-colors duration-200">
            {article.title}
          </h3>
          <p className="text-sm text-gray-500 leading-relaxed mb-5 line-clamp-3">
            {article.excerpt}
          </p>

          <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-gold">
            Read article
            <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
          </span>
        </div>
      </Link>
    </motion.div>
  );
}

/* ---- Small Article Card ---- */
function SmallArticleCard({ article, index }) {
  const [imgError, setImgError] = React.useState(false);
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
    >
      <Link
        to={`/insights/${article.slug}`}
        className="group flex gap-4 p-4 rounded-xl border border-gray-100 bg-white hover:border-gold/30 hover:shadow-md transition-all duration-300"
      >
        {/* Thumbnail */}
        <div className="w-20 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100">
          {article.image && !imgError ? (
            <img
              src={article.image}
              alt={article.title}
              onError={() => setImgError(true)}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-midnight to-blue-900 flex items-center justify-center">
              <span
                className="text-lg font-bold"
                style={{
                  background: 'linear-gradient(135deg, #D4B684, #B89A60)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                {article.title?.charAt(0)}
              </span>
            </div>
          )}
        </div>

        {/* Text */}
        <div className="flex-1 min-w-0">
          {article.category && (
            <span className="text-xs font-semibold text-gold uppercase tracking-wide">
              {article.category}
            </span>
          )}
          <h4 className="text-sm font-semibold text-midnight mt-0.5 leading-snug line-clamp-2 group-hover:text-gold-dark transition-colors duration-200">
            {article.title}
          </h4>
          <p className="text-xs text-gray-400 mt-1.5 flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            {formatDate(article.publishedAt)}
          </p>
        </div>
      </Link>
    </motion.div>
  );
}

/* ---- Main Component ---- */
export default function FeaturedArticles() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getArticles({ featured: true, limit: 5 })
      .then((res) => {
        const data = Array.isArray(res.data)
          ? res.data
          : res.data?.articles || res.data?.data || [];
        setArticles(data.length ? data : FALLBACK_ARTICLES);
      })
      .catch(() => {
        setArticles(FALLBACK_ARTICLES);
      })
      .finally(() => setLoading(false));
  }, []);

  const mainArticle = articles[0];
  const sideArticles = articles.slice(1, 5);

  return (
    <section className="py-20 bg-white">
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
              Insights
            </span>
            <h2 className="font-urbanist text-3xl sm:text-4xl font-bold text-midnight">
              Featured Articles
            </h2>
          </div>
          <Link
            to="/insights"
            className="group inline-flex items-center gap-1.5 text-sm font-semibold text-midnight hover:text-gold transition-colors duration-200 whitespace-nowrap"
          >
            View all articles
            <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
          </Link>
        </motion.div>

        {/* Layout */}
        {loading ? (
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            <div className="lg:col-span-3"><MainSkeleton /></div>
            <div className="lg:col-span-2 flex flex-col gap-4">
              {[1, 2, 3, 4].map((i) => <SmallSkeleton key={i} />)}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            {/* Left: main article */}
            <div className="lg:col-span-3">
              {mainArticle && <MainArticleCard article={mainArticle} />}
            </div>

            {/* Right: side articles */}
            <div className="lg:col-span-2 flex flex-col gap-4">
              {sideArticles.map((article, i) => (
                <SmallArticleCard
                  key={article._id || article.id || i}
                  article={article}
                  index={i}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
