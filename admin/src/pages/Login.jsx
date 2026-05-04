import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { Lock, Mail, Eye, EyeOff } from 'lucide-react';
import SolvedLogo from '../components/SolvedLogo';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      toast.success('Welcome back!');
      navigate('/');
    } catch (err) {
      const msg = err.response?.data?.message || 'Invalid credentials. Please try again.';
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{ backgroundColor: '#001B2F' }}
    >
      {/* Background pattern */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute -top-40 -right-40 w-80 h-80 rounded-full opacity-5"
          style={{ backgroundColor: '#D4B684' }}
        />
        <div
          className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full opacity-5"
          style={{ backgroundColor: '#D4B684' }}
        />
      </div>

      <div className="relative w-full max-w-sm">
        {/* Card */}
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="px-8 pt-8 pb-6 flex flex-col items-center" style={{ backgroundColor: '#001B2F' }}>
            <SolvedLogo height={48} />
            <p className="text-xs mt-3 font-medium tracking-widest uppercase" style={{ color: '#D4B684' }}>
              Admin Portal
            </p>
          </div>

          {/* Form */}
          <div className="px-8 py-8">
            <h2 className="text-gray-900 text-lg font-semibold mb-1">Sign in</h2>
            <p className="text-gray-500 text-sm mb-6">Enter your admin credentials to continue</p>

            {error && (
              <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Email address
                </label>
                <div className="relative">
                  <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="admin@solvedfinancial.com"
                    className="w-full pl-9 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:border-transparent transition-all"
                    style={{ '--tw-ring-color': '#001B2F' }}
                    onFocus={(e) => (e.target.style.borderColor = '#001B2F')}
                    onBlur={(e) => (e.target.style.borderColor = '#D1D5DB')}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="••••••••"
                    className="w-full pl-9 pr-10 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none transition-all"
                    onFocus={(e) => (e.target.style.borderColor = '#001B2F')}
                    onBlur={(e) => (e.target.style.borderColor = '#D1D5DB')}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 px-4 rounded-lg text-sm font-semibold text-white transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed mt-2"
                style={{ backgroundColor: '#001B2F' }}
                onMouseEnter={(e) => !loading && (e.target.style.backgroundColor = '#002d4f')}
                onMouseLeave={(e) => !loading && (e.target.style.backgroundColor = '#001B2F')}
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Signing in...
                  </span>
                ) : (
                  'Sign in'
                )}
              </button>
            </form>
          </div>
        </div>

        <p className="text-center text-white text-opacity-40 text-xs mt-6">
          © {new Date().getFullYear()} Solved Financial Services. Admin Portal.
        </p>
      </div>
    </div>
  );
}
