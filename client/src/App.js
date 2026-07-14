import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import './index.css';

const Home             = lazy(() => import('./pages/Home'));
const About            = lazy(() => import('./pages/About'));
const Services         = lazy(() => import('./pages/Services'));
const Jurisdictions    = lazy(() => import('./pages/Jurisdictions'));
const JurisdictionDetail = lazy(() => import('./pages/JurisdictionDetail'));
const Insights         = lazy(() => import('./pages/Insights'));
const InsightDetail    = lazy(() => import('./pages/InsightDetail'));
const Industries       = lazy(() => import('./pages/Industries'));
const Experience       = lazy(() => import('./pages/Experience'));
const Contact          = lazy(() => import('./pages/Contact'));
const LegalPage        = lazy(() => import('./pages/LegalPage'));
const Unsubscribe      = lazy(() => import('./pages/Unsubscribe'));

function PageLoader() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white z-50">
      <div className="w-10 h-10 rounded-full border-2 border-t-transparent animate-spin"
        style={{ borderColor: '#D4B684 transparent transparent transparent' }} />
    </div>
  );
}

function ScrollToTop() {
  const { pathname } = useLocation();
  React.useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
}

function AppLayout({ children }) {
  return <>{children}</>;
}

export default function App() {
  return (
    <Router>
      <ScrollToTop />
      <Suspense fallback={<PageLoader />}>
        <AppLayout>
          <Routes>
            <Route path="/"                         element={<Home />} />
            <Route path="/about"                    element={<About />} />
            <Route path="/services"                 element={<Services />} />
            <Route path="/jurisdictions"            element={<Jurisdictions />} />
            <Route path="/jurisdictions/:slug"      element={<JurisdictionDetail />} />
            <Route path="/insights"                 element={<Insights />} />
            <Route path="/insights/:slug"           element={<InsightDetail />} />
            <Route path="/industries"               element={<Industries />} />
            <Route path="/experience"               element={<Experience />} />
            <Route path="/contact"                  element={<Contact />} />
            <Route path="/privacy-policy"           element={<LegalPage />} />
            <Route path="/terms-of-service"         element={<LegalPage />} />
            <Route path="/cookie-policy"            element={<LegalPage />} />
            <Route path="/regulatory-disclosure"    element={<LegalPage />} />
            <Route path="/unsubscribe/:token"       element={<Unsubscribe />} />
            <Route path="*"                         element={<Home />} />
          </Routes>
        </AppLayout>
      </Suspense>
      <Toaster position="top-right" toastOptions={{ duration: 4000, style: { borderRadius: '10px', fontSize: '14px' } }} />
    </Router>
  );
}
