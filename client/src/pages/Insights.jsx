import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Calendar, Tag, Loader2, ChevronRight } from 'lucide-react';

import Navbar from '../components/common/Navbar';
import PageHero from '../components/common/PageHero';
import SectionHeader from '../components/common/SectionHeader';
import AnimatedSection from '../components/common/AnimatedSection';
import FooterCTA from '../components/common/FooterCTA';
import Footer from '../components/common/Footer';
import { FALLBACK_ARTICLES } from '../data/insightsData';
import API_BASE from '../utils/config';

const HERO_BG = 'https://imperial-ventures-assets.s3.eu-north-1.amazonaws.com/website/hero-insights.png';

const API = API_BASE;

const CATEGORIES = [
  { label: 'All Insights', value: '' },
  { label: 'Regulatory', value: 'Regulatory' },
  { label: 'Strategy', value: 'Strategy' },
  { label: 'Markets', value: 'Markets' },
  { label: 'Technology', value: 'Technology' },
];

function formatDate(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
}

// â”€â”€â”€ Skeleton components â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

function FeaturedSkeletonLeft() {
  return (
    <div className="animate-pulse flex flex-col gap-4">
      <div className="w-full h-[300px] sm:h-[572px] bg-gray-200 rounded" />
      <div className="h-5 bg-gray-200 rounded w-1/3" />
      <div className="h-8 bg-gray-200 rounded w-4/5" />
      <div className="h-8 bg-gray-200 rounded w-3/5" />
    </div>
  );
}

function FeaturedSkeletonRight() {
  return (
    <div className="flex flex-col gap-4 animate-pulse">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="flex gap-4">
          <div className="flex-shrink-0 w-[120px] h-[65px] bg-gray-200 rounded" />
          <div className="flex-1 flex flex-col gap-2">
            <div className="h-4 bg-gray-200 rounded w-full" />
            <div className="h-4 bg-gray-200 rounded w-2/3" />
            <div className="h-3 bg-gray-200 rounded w-1/3" />
          </div>
        </div>
      ))}
    </div>
  );
}

function ArticleCardSkeleton() {
  return (
    <div className="animate-pulse flex flex-col bg-white rounded overflow-hidden shadow-sm">
      <div className="w-full h-48 bg-gray-200" />
      <div className="p-4 flex flex-col gap-3">
        <div className="h-4 bg-gray-200 rounded w-1/3" />
        <div className="h-5 bg-gray-200 rounded w-full" />
        <div className="h-5 bg-gray-200 rounded w-4/5" />
        <div className="h-4 bg-gray-200 rounded w-full" />
        <div className="h-4 bg-gray-200 rounded w-3/4" />
        <div className="h-3 bg-gray-200 rounded w-1/4 mt-1" />
      </div>
    </div>
  );
}

// â”€â”€â”€ Large Featured Card (left side) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

function FeaturedLargeCard({ article }) {
  const [imgError, setImgError] = useState(false);
  return (
    <Link
      to={`/insights/${article.slug}`}
      className="group block relative overflow-hidden rounded"
      aria-label={article.title}
    >
      <div className="relative h-[300px] sm:h-[572px] overflow-hidden bg-midnight">
        {article.image && !imgError ? (
          <img
            src={article.image}
            alt={article.title}
            onError={() => setImgError(true)}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
          <div
            className="w-full h-full"
            style={{
              background:
                'linear-gradient(135deg, #001B2F 0%, #0a2a42 50%, #001B2F 100%)',
            }}
          />
        )}
        {/* gradient overlay */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(to top, rgba(0,27,47,0.92) 0%, rgba(0,27,47,0.45) 50%, transparent 100%)',
          }}
        />
        {/* content overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-6">
          {article.category && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-sm bg-gold text-midnight text-xs font-semibold uppercase tracking-wider mb-3">
              <Tag size={11} />
              {article.category}
            </span>
          )}
          <h3 className="text-white font-bold text-2xl leading-snug group-hover:text-gold transition-colors duration-200 line-clamp-3">
            {article.title}
          </h3>
          {article.publishedAt && (
            <p className="mt-3 flex items-center gap-2 text-cream/60 text-sm">
              <Calendar size={14} />
              {formatDate(article.publishedAt)}
            </p>
          )}
        </div>
      </div>
    </Link>
  );
}

// â”€â”€â”€ Small Featured Card (right stack) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

function FeaturedSmallCard({ article }) {
  const [imgError, setImgError] = useState(false);
  return (
    <Link
      to={`/insights/${article.slug}`}
      className="group flex gap-4 items-start hover:bg-gray-50 rounded p-1 -mx-1 transition-colors duration-200"
      aria-label={article.title}
    >
      <div className="flex-shrink-0 w-[120px] h-[65px] overflow-hidden rounded bg-midnight">
        {article.image && !imgError ? (
          <img
            src={article.image}
            alt={article.title}
            onError={() => setImgError(true)}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div
            className="w-full h-full"
            style={{
              background: 'linear-gradient(135deg, #001B2F 0%, #0a2a42 100%)',
            }}
          />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="text-midnight font-semibold text-sm leading-snug line-clamp-2 group-hover:text-gold transition-colors duration-200">
          {article.title}
        </h4>
        {article.publishedAt && (
          <p className="mt-1.5 flex items-center gap-1.5 text-gray-400 text-xs">
            <Calendar size={12} />
            {formatDate(article.publishedAt)}
          </p>
        )}
      </div>
    </Link>
  );
}

// â”€â”€â”€ Browse Article Card â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

function ArticleCard({ article }) {
  const [imgError, setImgError] = useState(false);
  return (
    <AnimatedSection>
      <Link
        to={`/insights/${article.slug}`}
        className="group flex flex-col h-full bg-white rounded overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-100"
        aria-label={article.title}
      >
        <div className="relative h-48 overflow-hidden bg-midnight flex-shrink-0">
          {article.image && !imgError ? (
            <img
              src={article.image}
              alt={article.title}
              onError={() => setImgError(true)}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
          ) : (
            <div
              className="w-full h-full"
              style={{
                background:
                  'linear-gradient(135deg, #001B2F 0%, #0a2a42 50%, #001B2F 100%)',
              }}
            />
          )}
        </div>
        <div className="flex flex-col flex-1 p-5">
          {article.category && (
            <span className="inline-flex items-center gap-1.5 self-start px-2.5 py-0.5 rounded-sm bg-gold/15 text-gold-dark text-xs font-semibold uppercase tracking-wider mb-3">
              {article.category}
            </span>
          )}
          <h3 className="font-bold text-midnight text-base leading-snug line-clamp-2 group-hover:text-gold transition-colors duration-200 mb-2">
            {article.title}
          </h3>
          {article.excerpt && (
            <p className="text-gray-500 text-sm leading-relaxed line-clamp-3 flex-1">
              {article.excerpt}
            </p>
          )}
          {article.publishedAt && (
            <p className="mt-4 flex items-center gap-1.5 text-gray-400 text-xs">
              <Calendar size={12} />
              {formatDate(article.publishedAt)}
            </p>
          )}
        </div>
      </Link>
    </AnimatedSection>
  );
}

// â”€â”€â”€ Main Page â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

export default function Insights() {
  // Featured
  const [featured, setFeatured] = useState([]);
  const [featuredLoading, setFeaturedLoading] = useState(true);
  const [featuredError, setFeaturedError] = useState(null);

  // Browse
  const [activeCategory, setActiveCategory] = useState('');
  const [articles, setArticles] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [browseLoading, setBrowseLoading] = useState(true);
  const [loadMoreLoading, setLoadMoreLoading] = useState(false);
  const [browseError, setBrowseError] = useState(null);

  // Fetch featured articles
  useEffect(() => {
    let cancelled = false;
    setFeaturedLoading(true);
    setFeaturedError(null);
    axios
      .get(`${API}/articles`, { params: { featured: true, limit: 5 } })
      .then((res) => {
        if (!cancelled) {
          const data = Array.isArray(res.data)
            ? res.data
            : res.data.articles ?? res.data.data ?? [];
          setFeatured(data.length > 0 ? data : FALLBACK_ARTICLES.filter(a => a.featured));
        }
      })
      .catch(() => {
        if (!cancelled) setFeatured(FALLBACK_ARTICLES.filter(a => a.featured));
      })
      .finally(() => {
        if (!cancelled) setFeaturedLoading(false);
      });
    return () => { cancelled = true; };
  }, []);

  // Fetch browse articles (reset on category change)
  const fetchArticles = useCallback(
    (cat, pg, append = false) => {
      if (!append) setBrowseLoading(true);
      else setLoadMoreLoading(true);
      setBrowseError(null);

      const params = { page: pg, limit: 8 };
      if (cat) params.category = cat;

      axios
        .get(`${API}/articles`, { params })
        .then((res) => {
          const data = Array.isArray(res.data)
            ? res.data
            : res.data.articles ?? res.data.data ?? [];
          const total = res.data.total ?? res.data.count ?? null;

          // Use fallback when DB has no articles yet (first page, any category)
          const useFallback = !append && pg === 1 && data.length === 0;
          if (useFallback) {
            const filtered = cat
              ? FALLBACK_ARTICLES.filter(a => a.category === cat)
              : FALLBACK_ARTICLES;
            setArticles(filtered);
            setHasMore(false);
          } else if (append) {
            setArticles((prev) => [...prev, ...data]);
            setHasMore(data.length === 8);
          } else {
            setArticles(data);
            if (data.length < 8) {
              setHasMore(false);
            } else if (total !== null) {
              setHasMore((pg * 8) < total);
            } else {
              setHasMore(data.length === 8);
            }
          }
        })
        .catch(() => {
          const filtered = cat
            ? FALLBACK_ARTICLES.filter(a => a.category === cat)
            : FALLBACK_ARTICLES;
          if (append) {
            setArticles(prev => [...prev, ...filtered]);
          } else {
            setArticles(filtered);
          }
          setHasMore(false);
        })
        .finally(() => {
          setBrowseLoading(false);
          setLoadMoreLoading(false);
        });
    },
    []
  );

  useEffect(() => {
    setPage(1);
    setHasMore(true);
    fetchArticles(activeCategory, 1, false);
  }, [activeCategory, fetchArticles]);

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchArticles(activeCategory, nextPage, true);
  };

  const [largeArticle, ...smallArticles] = featured;

  return (
    <div className="bg-cream min-h-screen">
      <Navbar />
      {/* 1 â€” Hero */}
      <PageHero
        title="Insights that matter"
        subtitle="Expert perspectives on financial strategy, regulation, and international markets."
        bgImage={HERO_BG}
        breadcrumb={[{ label: 'Home', to: '/' }, { label: 'Insights' }]}
      />

      {/* 2 â€” Featured Articles */}
      <section className="bg-white py-16 lg:py-24" aria-label="Featured articles">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader label="Editorial" title="Featured Articles" className="mb-10" />

          {featuredError && (
            <p className="text-red-500 text-sm">{featuredError}</p>
          )}

          {!featuredError && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left â€” large card */}
              <div>
                {featuredLoading ? (
                  <FeaturedSkeletonLeft />
                ) : largeArticle ? (
                  <FeaturedLargeCard article={largeArticle} />
                ) : null}
              </div>

              {/* Right â€” 4 small cards */}
              <div className="flex flex-col justify-between gap-5">
                {featuredLoading ? (
                  <FeaturedSkeletonRight />
                ) : (
                  smallArticles.slice(0, 4).map((art) => (
                    <FeaturedSmallCard key={art._id ?? art.id ?? art.slug} article={art} />
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* 3 â€” Browse Articles */}
      <section className="py-16 lg:py-24 bg-cream" aria-label="Browse articles">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader label="Knowledge hub" title="Browse Articles" className="mb-8" />

          {/* Category filter tab bar */}
          <div className="flex flex-wrap gap-2 mb-10" role="tablist" aria-label="Filter by category">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.value}
                role="tab"
                aria-selected={activeCategory === cat.value}
                onClick={() => setActiveCategory(cat.value)}
                className={`px-5 py-2 rounded-sm text-sm font-semibold tracking-wide transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold
                  ${activeCategory === cat.value
                    ? 'bg-midnight text-gold border border-midnight'
                    : 'bg-white text-gray-600 border border-gray-200 hover:border-gold/40 hover:text-gold'
                  }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Article grid */}
          {browseError && (
            <p className="text-red-500 text-sm mb-6">{browseError}</p>
          )}

          {browseLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <ArticleCardSkeleton key={i} />
              ))}
            </div>
          ) : (
            <>
              {articles.length === 0 ? (
                <div className="text-center py-20">
                  <p className="text-gray-400 text-base">No articles found in this category.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {articles.map((art) => (
                    <ArticleCard key={art._id ?? art.id ?? art.slug} article={art} />
                  ))}
                </div>
              )}

              {/* Load More */}
              {hasMore && articles.length > 0 && (
                <div className="flex justify-center mt-12">
                  <button
                    onClick={handleLoadMore}
                    disabled={loadMoreLoading}
                    className="inline-flex items-center gap-2.5 px-8 py-3.5 rounded-sm bg-midnight text-gold font-semibold text-sm tracking-wide
                      hover:bg-midnight/90 active:bg-midnight/80 disabled:opacity-60 disabled:cursor-not-allowed
                      transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold"
                  >
                    {loadMoreLoading ? (
                      <>
                        <Loader2 size={16} className="animate-spin" />
                        Loading...
                      </>
                    ) : (
                      <>
                        Load more articles
                        <ChevronRight size={16} />
                      </>
                    )}
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* 4 â€” Footer CTA + Footer */}
      <FooterCTA />
      <Footer />
    </div>
  );
}
