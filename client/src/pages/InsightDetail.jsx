import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';
import { Calendar, Clock, ChevronRight } from 'lucide-react';

import FooterCTA from '../components/common/FooterCTA';
import Footer from '../components/common/Footer';
import Navbar from '../components/common/Navbar';
import { FALLBACK_ARTICLES } from '../data/insightsData';
import API_BASE from '../utils/config';

const API = API_BASE;

function formatDate(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
}

function truncateTitle(title, max = 45) {
  if (!title) return '';
  return title.length > max ? title.slice(0, max).trim() + '...' : title;
}

// â”€â”€â”€ Skeleton â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

function DetailSkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 animate-pulse">
      {/* breadcrumb */}
      <div className="flex gap-2 mb-10">
        <div className="h-3 w-32 bg-gray-200 rounded" />
        <div className="h-3 w-4 bg-gray-200 rounded" />
        <div className="h-3 w-24 bg-gray-200 rounded" />
        <div className="h-3 w-4 bg-gray-200 rounded" />
        <div className="h-3 w-48 bg-gray-200 rounded" />
      </div>

      <div className="flex flex-col lg:flex-row gap-12">
        {/* Left */}
        <div className="flex-1 min-w-0 flex flex-col gap-5">
          <div className="h-10 bg-gray-200 rounded w-3/4" />
          <div className="h-10 bg-gray-200 rounded w-2/3" />
          <div className="flex gap-4">
            <div className="h-4 w-28 bg-gray-200 rounded" />
            <div className="h-4 w-20 bg-gray-200 rounded" />
          </div>
          <div className="h-[400px] bg-gray-200 rounded w-full" />
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-4 bg-gray-200 rounded" style={{ width: `${85 + (i % 3) * 5}%` }} />
          ))}
        </div>
        {/* Right */}
        <div className="w-full lg:w-[320px] flex-shrink-0 flex flex-col gap-5">
          <div className="h-6 w-40 bg-gray-200 rounded" />
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex gap-3">
              <div className="w-16 h-12 bg-gray-200 rounded flex-shrink-0" />
              <div className="flex-1 flex flex-col gap-2">
                <div className="h-3 bg-gray-200 rounded w-full" />
                <div className="h-3 bg-gray-200 rounded w-2/3" />
                <div className="h-3 bg-gray-200 rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// â”€â”€â”€ Related article card â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

function RelatedArticleCard({ article }) {
  return (
    <Link
      to={`/insights/${article.slug}`}
      className="group flex gap-3 items-start py-4 border-b border-gray-100 last:border-b-0 hover:bg-gray-50 rounded px-2 -mx-2 transition-colors duration-200"
    >
      <div className="flex-shrink-0 w-[72px] h-[50px] overflow-hidden rounded bg-midnight">
        {article.image ? (
          <img
            src={article.image}
            alt={article.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div
            className="w-full h-full"
            style={{ background: 'linear-gradient(135deg, #001B2F 0%, #0a2a42 100%)' }}
          />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="text-midnight font-semibold text-sm leading-snug line-clamp-2 group-hover:text-gold transition-colors duration-200">
          {article.title}
        </h4>
        {article.publishedAt && (
          <p className="mt-1 flex items-center gap-1 text-gray-400 text-xs">
            <Calendar size={11} />
            {formatDate(article.publishedAt)}
          </p>
        )}
      </div>
    </Link>
  );
}

// â”€â”€â”€ Main Page â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

export default function InsightDetail() {
  const { slug } = useParams();
  const [article, setArticle] = useState(null);
  const [allArticles, setAllArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    setArticle(null);

    // Fetch the current article and all articles in parallel
    Promise.allSettled([
      axios.get(`${API}/articles/${slug}`),
      axios.get(`${API}/articles`),
    ]).then(([articleRes, allRes]) => {
      if (cancelled) return;

      // Handle current article
      if (articleRes.status === 'fulfilled') {
        setArticle(articleRes.value.data.article ?? articleRes.value.data);
      } else {
        const fallback = FALLBACK_ARTICLES.find((a) => a.slug === slug);
        if (fallback) {
          setArticle(fallback);
        } else {
          setError('This article could not be loaded. Please try again later.');
        }
      }

      // Handle all articles for related section
      if (allRes.status === 'fulfilled') {
        const data = allRes.value.data;
        const list = Array.isArray(data) ? data : data?.articles ?? data?.data ?? [];
        setAllArticles(list);
      } else {
        setAllArticles(FALLBACK_ARTICLES);
      }
    }).finally(() => {
      if (!cancelled) setLoading(false);
    });

    return () => { cancelled = true; };
  }, [slug]);

  if (loading) {
    return (
      <main className="bg-cream min-h-screen">
        <Navbar />
        <div className="h-[80px]" />
        <DetailSkeleton />
        <FooterCTA />
        <Footer />
      </main>
    );
  }

  if (error || !article) {
    return (
      <main className="bg-cream min-h-screen">
        <Navbar />
        <div className="h-[80px]" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
          <h1 className="text-3xl font-bold text-midnight mb-4">Article not found</h1>
          <p className="text-gray-500 mb-8">{error ?? 'The article you are looking for does not exist.'}</p>
          <Link
            to="/insights"
            className="inline-flex items-center gap-2 px-6 py-3 bg-midnight text-gold font-semibold text-sm rounded-sm hover:bg-midnight/90 transition-colors"
          >
            Back to Insights
          </Link>
        </div>
        <FooterCTA />
        <Footer />
      </main>
    );
  }

  // Build related articles: same category, excluding current article, up to 4
  const breadcrumbCategory = article.category ?? 'Insights';
  const related = (() => {
    const pool = allArticles.length ? allArticles : FALLBACK_ARTICLES;
    const sameCat = pool.filter(
      (a) =>
        (a.slug || a._id) !== (article.slug || article._id) &&
        a.published !== false &&
        article.category &&
        a.category?.toLowerCase() === article.category?.toLowerCase()
    );
    // If not enough same-category articles, pad with other recent articles
    if (sameCat.length >= 4) return sameCat.slice(0, 4);
    const others = pool.filter(
      (a) =>
        (a.slug || a._id) !== (article.slug || article._id) &&
        a.published !== false &&
        !sameCat.includes(a)
    );
    return [...sameCat, ...others].slice(0, 4);
  })();

  return (
    <main className="bg-cream min-h-screen">
      <Navbar />
      {/* Top bar spacer (Navbar height) */}
      <div className="h-[80px]" aria-hidden="true" />

      {/* Gold accent top line */}
      <div className="h-[3px] bg-gradient-to-r from-gold via-gold/50 to-transparent" aria-hidden="true" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-14">

        {/* â”€â”€ Breadcrumb â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
        <motion.nav
          aria-label="Breadcrumb"
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className="flex items-center flex-wrap gap-1 mb-10 text-xs text-gray-400"
        >
          <Link to="/" className="hover:text-gold transition-colors duration-200">
            Solved Financial Services
          </Link>
          <ChevronRight size={12} className="text-gray-300 flex-shrink-0" />
          <Link to="/insights" className="hover:text-gold transition-colors duration-200">
            {breadcrumbCategory}
          </Link>
          <ChevronRight size={12} className="text-gray-300 flex-shrink-0" />
          <span className="text-gold/80 font-medium" aria-current="page">
            {truncateTitle(article.title)}
          </span>
        </motion.nav>

        {/* â”€â”€ Two-column layout â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
        <div className="flex flex-col lg:flex-row gap-12 xl:gap-16 items-start">

          {/* â”€â”€â”€â”€ LEFT: Article Content (65%) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
          <motion.article
            className="flex-1 min-w-0"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* Category badge */}
            {article.category && (
              <span className="inline-flex items-center px-3 py-1 rounded-sm bg-gold/15 text-gold-dark text-xs font-semibold uppercase tracking-wider mb-5">
                {article.category}
              </span>
            )}

            {/* Title */}
            <h1 className="font-urbanist text-midnight font-bold text-3xl sm:text-4xl lg:text-[2.5rem] leading-[1.15] tracking-tight mb-5">
              {article.title}
            </h1>

            {/* Meta: date + read time */}
            <div className="flex flex-wrap items-center gap-5 text-gray-400 text-sm mb-8 pb-8 border-b border-gray-200">
              {article.publishedAt && (
                <span className="flex items-center gap-2">
                  <Calendar size={14} />
                  {formatDate(article.publishedAt)}
                </span>
              )}
              {article.readTime && (
                <span className="flex items-center gap-2">
                  <Clock size={14} />
                  {article.readTime}
                </span>
              )}
              {article.author && (
                <span className="text-gray-500 font-medium">{article.author}</span>
              )}
            </div>

            {/* Hero image */}
            {article.image && (
              <div className="w-full h-[400px] lg:h-[480px] overflow-hidden rounded mb-8 bg-midnight">
                <img
                  src={article.image}
                  alt={article.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            {/* Rich HTML content */}
            {article.content && (
              <div
                className="prose prose-lg max-w-none
                  prose-headings:text-midnight prose-headings:font-bold
                  prose-h2:text-2xl prose-h2:mt-10 prose-h2:mb-4
                  prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-3
                  prose-p:text-gray-600 prose-p:leading-relaxed prose-p:mb-5
                  prose-a:text-gold prose-a:no-underline hover:prose-a:underline
                  prose-strong:text-midnight
                  prose-ul:text-gray-600 prose-ol:text-gray-600
                  prose-li:mb-1
                  prose-blockquote:border-l-4 prose-blockquote:border-gold prose-blockquote:pl-5 prose-blockquote:text-gray-500 prose-blockquote:italic
                  prose-img:rounded"
                dangerouslySetInnerHTML={{ __html: article.content }}
              />
            )}
          </motion.article>

          {/* â”€â”€â”€â”€ RIGHT: Sidebar (35%) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
          {/* Sticky is on a plain div — Framer Motion transforms on the element
              itself would create a new stacking context and break position:sticky */}
          <aside
            className="w-full lg:w-[320px] xl:w-[360px] flex-shrink-0 self-start lg:sticky lg:top-[100px]"
            aria-label="Sidebar"
          >
            <motion.div
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            >
            <div className="bg-white rounded shadow-sm border border-gray-100 p-6">
              {/* Related articles */}
              <div className="flex items-center gap-3 mb-5">
                <span className="w-6 h-[3px] rounded-full bg-gold flex-shrink-0" />
                <h2 className="text-midnight font-bold text-xs uppercase tracking-[0.18em]">
                  Related Articles
                </h2>
              </div>

              {related.length === 0 ? (
                <p className="text-gray-400 text-sm">No related articles available.</p>
              ) : (
                <div className="flex flex-col">
                  {related.slice(0, 4).map((rel) => (
                    <RelatedArticleCard key={rel._id ?? rel.id ?? rel.slug} article={rel} />
                  ))}
                </div>
              )}

              {/* Back to insights link */}
              <Link
                to="/insights"
                className="mt-6 flex items-center gap-2 text-gold text-sm font-semibold hover:text-gold-dark transition-colors duration-200 group"
              >
                <ChevronRight
                  size={14}
                  className="rotate-180 transition-transform duration-200 group-hover:-translate-x-0.5"
                />
                Back to all insights
              </Link>
            </div>
            </motion.div>
          </aside>
        </div>
      </div>

      {/* Footer CTA + Footer */}
      <FooterCTA />
      <Footer />
    </main>
  );
}
