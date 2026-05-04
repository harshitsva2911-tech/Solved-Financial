import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import PageHero from '../components/common/PageHero';
import API_BASE from '../utils/config';

const API = API_BASE;

const PAGE_CONFIG = {
  'privacy-policy': {
    key: 'legal_privacy_policy',
    title: 'Privacy Policy',
    subtitle: 'How we collect, use, and protect your personal data.',
    hero: 'https://imperial-ventures-assets.s3.eu-north-1.amazonaws.com/website/hero-contact.png',
  },
  'terms-of-service': {
    key: 'legal_terms_of_service',
    title: 'Terms of Service',
    subtitle: 'The terms governing use of this website and our services.',
    hero: 'https://imperial-ventures-assets.s3.eu-north-1.amazonaws.com/website/hero-contact.png',
  },
  'cookie-policy': {
    key: 'legal_cookie_policy',
    title: 'Cookie Policy',
    subtitle: 'How we use cookies to improve your experience on this website.',
    hero: 'https://imperial-ventures-assets.s3.eu-north-1.amazonaws.com/website/hero-contact.png',
  },
  'regulatory-disclosure': {
    key: 'legal_regulatory_disclosure',
    title: 'Regulatory Disclosure',
    subtitle: 'Important regulatory information about our services and operations.',
    hero: 'https://imperial-ventures-assets.s3.eu-north-1.amazonaws.com/website/hero-contact.png',
  },
};

function renderContent(text) {
  if (!text) return null;
  const lines = text.split('\n');
  const elements = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i].trim();

    if (!line) { i++; continue; }

    // ALL-CAPS heading (e.g. "PRIVACY POLICY", "1. INTRODUCTION")
    if (/^[A-Z0-9\s.\-&/]+$/.test(line) && line.length > 2 && !line.endsWith('.')) {
      elements.push(
        <h2 key={i} className="text-xl font-bold text-midnight mt-10 mb-3 pb-2 border-b border-gray-100">
          {line}
        </h2>
      );
    }
    // Numbered section heading like "1. INTRODUCTION"
    else if (/^\d+\.\s+[A-Z]/.test(line)) {
      elements.push(
        <h3 key={i} className="text-base font-bold text-midnight mt-8 mb-2">
          {line}
        </h3>
      );
    }
    // Bullet point
    else if (line.startsWith('- ')) {
      const bullets = [];
      while (i < lines.length && lines[i].trim().startsWith('- ')) {
        bullets.push(lines[i].trim().slice(2));
        i++;
      }
      elements.push(
        <ul key={`ul-${i}`} className="list-disc pl-5 space-y-1 my-3">
          {bullets.map((b, j) => (
            <li key={j} className="text-gray-600 text-sm leading-relaxed"
              dangerouslySetInnerHTML={{ __html: b.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }}
            />
          ))}
        </ul>
      );
      continue;
    }
    // ALL-CAPS sub-heading within a section (e.g. "ESSENTIAL COOKIES")
    else if (/^[A-Z][A-Z\s]+$/.test(line) && line.length > 3 && line.length < 60) {
      elements.push(
        <p key={i} className="font-semibold text-midnight text-sm mt-5 mb-1 uppercase tracking-wide">
          {line}
        </p>
      );
    }
    // Regular paragraph
    else {
      elements.push(
        <p key={i} className="text-gray-600 text-sm leading-relaxed my-2"
          dangerouslySetInnerHTML={{ __html: line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }}
        />
      );
    }
    i++;
  }

  return elements;
}

export default function LegalPage() {
  const { pathname } = useLocation();
  const slug = pathname.replace(/^\//, '');
  const config = PAGE_CONFIG[slug];

  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!config) { setLoading(false); return; }
    axios.get(`${API}/settings`)
      .then((res) => {
        const data = res.data?.settings ?? res.data ?? {};
        setContent(data[config.key] ?? '');
      })
      .catch(() => setContent(''))
      .finally(() => setLoading(false));
  }, [config]);

  if (!config) {
    return (
      <div className="bg-cream min-h-screen">
        <Navbar />
        <div className="max-w-3xl mx-auto px-6 py-32 text-center">
          <p className="text-gray-400">Page not found.</p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="bg-cream min-h-screen">
      <Navbar />

      <PageHero
        title={config.title}
        subtitle={config.subtitle}
        bgImage={config.hero}
        breadcrumb={[{ label: 'Home', to: '/' }, { label: config.title }]}
      />

      <section className="py-16 lg:py-24">
        <div className="max-w-3xl mx-auto px-6 lg:px-8">
          {loading ? (
            <div className="space-y-3">
              {[...Array(8)].map((_, i) => (
                <div key={i} className={`h-4 bg-gray-200 rounded animate-pulse ${i % 3 === 0 ? 'w-1/3' : 'w-full'}`} />
              ))}
            </div>
          ) : content ? (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 lg:p-12">
              {renderContent(content)}
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
              <p className="text-gray-400 text-sm">Content coming soon.</p>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
