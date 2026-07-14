import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import Layout from './components/Layout';
import './index.css';

const Login      = lazy(() => import('./pages/Login'));
const Dashboard  = lazy(() => import('./pages/Dashboard'));
const Articles   = lazy(() => import('./pages/Articles'));
const Contacts   = lazy(() => import('./pages/Contacts'));
const Services   = lazy(() => import('./pages/Services'));
const Team       = lazy(() => import('./pages/Team'));
const CaseStudies  = lazy(() => import('./pages/CaseStudies'));
const Industries   = lazy(() => import('./pages/Industries'));
const Jurisdictions = lazy(() => import('./pages/Jurisdictions'));
const Metrics    = lazy(() => import('./pages/Metrics'));
const Logos      = lazy(() => import('./pages/Logos'));
const Settings   = lazy(() => import('./pages/Settings'));
const LegalPages = lazy(() => import('./pages/LegalPages'));
const Documents  = lazy(() => import('./pages/Documents'));
const Newsletter = lazy(() => import('./pages/Newsletter'));

const Loader = () => (
  <div className="fixed inset-0 bg-white flex items-center justify-center z-50">
    <div className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin"
      style={{ borderColor: '#D4B684 transparent transparent transparent' }} />
  </div>
);

function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return <Loader />;
  return isAuthenticated ? children : <Navigate to="/login" replace />;
}

function AppRoutes() {
  const { isAuthenticated } = useAuth();
  return (
    <Suspense fallback={<Loader />}>
      <Routes>
        <Route path="/login" element={isAuthenticated ? <Navigate to="/" replace /> : <Login />} />
        <Route path="/"             element={<ProtectedRoute><Layout><Dashboard /></Layout></ProtectedRoute>} />
        <Route path="/articles"     element={<ProtectedRoute><Layout><Articles /></Layout></ProtectedRoute>} />
        <Route path="/contacts"     element={<ProtectedRoute><Layout><Contacts /></Layout></ProtectedRoute>} />
        <Route path="/services"     element={<ProtectedRoute><Layout><Services /></Layout></ProtectedRoute>} />
        <Route path="/team"         element={<ProtectedRoute><Layout><Team /></Layout></ProtectedRoute>} />
        <Route path="/case-studies" element={<ProtectedRoute><Layout><CaseStudies /></Layout></ProtectedRoute>} />
        <Route path="/industries"   element={<ProtectedRoute><Layout><Industries /></Layout></ProtectedRoute>} />
        <Route path="/jurisdictions" element={<ProtectedRoute><Layout><Jurisdictions /></Layout></ProtectedRoute>} />
        <Route path="/metrics"      element={<ProtectedRoute><Layout><Metrics /></Layout></ProtectedRoute>} />
        <Route path="/logos"        element={<ProtectedRoute><Layout><Logos /></Layout></ProtectedRoute>} />
        <Route path="/settings"     element={<ProtectedRoute><Layout><Settings /></Layout></ProtectedRoute>} />
        <Route path="/legal"        element={<ProtectedRoute><Layout><LegalPages /></Layout></ProtectedRoute>} />
        <Route path="/documents"    element={<ProtectedRoute><Layout><Documents /></Layout></ProtectedRoute>} />
        <Route path="/newsletter"   element={<ProtectedRoute><Layout><Newsletter /></Layout></ProtectedRoute>} />
        <Route path="*"             element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
        <Toaster position="top-right" toastOptions={{ duration: 3500, style: { borderRadius: '10px', fontSize: '14px' } }} />
      </Router>
    </AuthProvider>
  );
}
