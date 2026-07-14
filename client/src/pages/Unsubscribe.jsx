import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { CheckCircle2, XCircle, Loader2 } from 'lucide-react';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import API_BASE from '../utils/config';

export default function Unsubscribe() {
  const { token } = useParams();
  const [status, setStatus] = useState('loading'); // loading | success | error
  const [message, setMessage] = useState('');

  useEffect(() => {
    axios
      .get(`${API_BASE}/newsletter/unsubscribe/${token}`)
      .then((res) => {
        setStatus('success');
        setMessage(res.data?.message || 'You have been unsubscribed successfully.');
      })
      .catch((err) => {
        setStatus('error');
        setMessage(err?.response?.data?.message || 'This unsubscribe link is invalid or has expired.');
      });
  }, [token]);

  return (
    <div className="bg-cream min-h-screen flex flex-col">
      <Navbar />

      <section className="flex-1 flex items-center justify-center py-24 px-4">
        <div className="max-w-md w-full text-center bg-white rounded shadow-md border border-gray-100 p-10">
          {status === 'loading' && (
            <>
              <Loader2 size={40} className="text-gold mx-auto mb-5 animate-spin" />
              <h1 className="text-midnight font-urbanist font-semibold text-xl mb-2">
                Processing your request...
              </h1>
            </>
          )}

          {status === 'success' && (
            <>
              <CheckCircle2 size={40} className="text-gold mx-auto mb-5" />
              <h1 className="text-midnight font-urbanist font-semibold text-xl mb-2">
                You've been unsubscribed
              </h1>
              <p className="text-midnight/60 text-sm leading-relaxed">{message}</p>
            </>
          )}

          {status === 'error' && (
            <>
              <XCircle size={40} className="text-red-400 mx-auto mb-5" />
              <h1 className="text-midnight font-urbanist font-semibold text-xl mb-2">
                Something went wrong
              </h1>
              <p className="text-midnight/60 text-sm leading-relaxed">{message}</p>
            </>
          )}

          <Link
            to="/"
            className="inline-block mt-8 px-6 py-3 rounded-sm bg-gold text-midnight font-bold text-sm tracking-wide uppercase hover:bg-gold-dark transition-all duration-200"
          >
            Back to Home
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
