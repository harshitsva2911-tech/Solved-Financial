import { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Loader2, Send } from 'lucide-react';
import API_BASE from '../../utils/config';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const toastStyleSuccess = {
  background: '#001B2F',
  color: '#F5F7FA',
  border: '1px solid rgba(212,182,132,0.3)',
  borderRadius: '4px',
  fontSize: '14px',
};

const toastStyleError = {
  background: '#fff',
  color: '#001B2F',
  border: '1px solid #fca5a5',
  borderRadius: '4px',
  fontSize: '14px',
};

export default function NewsletterSubscribe() {
  const [email, setEmail] = useState('');
  const [agreed, setAgreed] = useState(false);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!EMAIL_RE.test(email)) {
      setError('Please enter a valid email address.');
      return;
    }
    if (!agreed) {
      setError('Please agree to receive newsletter updates.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await axios.post(`${API_BASE}/newsletter/subscribe`, { email, agreed });
      toast.success(res.data?.message || 'Thank you for subscribing!', {
        duration: 5000,
        style: toastStyleSuccess,
        iconTheme: { primary: '#D4B684', secondary: '#001B2F' },
      });
      setEmail('');
      setAgreed(false);
    } catch (err) {
      const message = err?.response?.data?.message || 'Something went wrong. Please try again.';
      toast.error(message, { duration: 6000, style: toastStyleError });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <h3 className="text-gold text-xs font-semibold uppercase tracking-[0.18em] mb-5 font-urbanist">
        Newsletter
      </h3>
      <p className="text-cream/55 text-sm leading-relaxed mb-4">
        Subscribe for regulatory updates, market insights, and company news.
      </p>

      <form onSubmit={handleSubmit} noValidate>
        <div className="flex rounded-sm overflow-hidden border border-white/15 focus-within:ring-2 focus-within:ring-gold focus-within:border-gold transition-all duration-200">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Your email address"
            aria-label="Email address"
            className="flex-1 min-w-0 px-3.5 py-2.5 bg-transparent text-cream text-sm placeholder-cream/40 focus:outline-none"
          />
          <button
            type="submit"
            disabled={submitting}
            aria-label="Subscribe"
            className="flex-shrink-0 w-11 flex items-center justify-center bg-gold text-midnight hover:bg-gold-dark disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-200"
          >
            {submitting ? <Loader2 size={15} className="animate-spin" /> : <Send size={15} />}
          </button>
        </div>

        <label className="flex items-start gap-2.5 mt-3 cursor-pointer group">
          <input
            type="checkbox"
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
            className="mt-0.5 w-3.5 h-3.5 accent-gold cursor-pointer flex-shrink-0"
          />
          <span className="text-cream/50 text-xs leading-relaxed group-hover:text-cream/70 transition-colors duration-200">
            I agree to receive newsletter updates from Solved Financial Services.
          </span>
        </label>

        {error && <p className="mt-2 text-red-400 text-xs">{error}</p>}
      </form>
    </div>
  );
}
