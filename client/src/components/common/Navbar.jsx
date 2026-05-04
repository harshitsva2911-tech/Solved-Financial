import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import SolvedLogo from './SolvedLogo';

const NAV_LINKS = [
  { label: 'About Us', to: '/about' },
  { label: 'Services', to: '/services' },
  { label: 'Jurisdictions', to: '/jurisdictions' },
  { label: 'Industries', to: '/industries' },
  { label: 'Experience', to: '/experience' },
  { label: 'Insights', to: '/insights' },
];

const mobileMenuVariants = {
  hidden: { opacity: 0, height: 0 },
  visible: {
    opacity: 1,
    height: 'auto',
    transition: { duration: 0.3, ease: 'easeInOut' },
  },
  exit: {
    opacity: 0,
    height: 0,
    transition: { duration: 0.25, ease: 'easeInOut' },
  },
};

const mobileLinkVariants = {
  hidden: { opacity: 0, x: -16 },
  visible: (i) => ({
    opacity: 1,
    x: 0,
    transition: { delay: i * 0.06, duration: 0.28, ease: 'easeOut' },
  }),
};

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  // Scroll listener — transition navbar background
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  const isActive = (path) => location.pathname === path;

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 bg-midnight ${
        scrolled || menuOpen ? 'shadow-lg shadow-black/30' : ''
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-3 group focus:outline-none focus-visible:ring-2 focus-visible:ring-gold rounded-sm"
            aria-label="Solved Financial Services — Home"
          >
            <SolvedLogo height={52} />
          </Link>

          {/* Desktop nav links */}
          <nav className="hidden lg:flex items-center gap-1" aria-label="Main navigation">
            {NAV_LINKS.map(({ label, to }) => (
              <Link
                key={to}
                to={to}
                className={`relative px-4 py-2 text-sm font-medium tracking-wide transition-colors duration-200 rounded-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-gold
                  ${
                    isActive(to)
                      ? 'text-gold'
                      : 'text-cream/80 hover:text-white'
                  }
                `}
              >
                {label}
                {isActive(to) && (
                  <motion.span
                    layoutId="nav-active-underline"
                    className="absolute bottom-0 left-4 right-4 h-[2px] bg-gold rounded-full"
                    transition={{ type: 'spring', stiffness: 380, damping: 34 }}
                  />
                )}
              </Link>
            ))}
          </nav>

          {/* Desktop CTA */}
          <div className="hidden lg:block">
            <Link
              to="/contact"
              className={`inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold tracking-wide rounded-sm
                bg-gold text-midnight hover:bg-gold-light active:bg-gold-dark
                transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-midnight
                ${isActive('/contact') ? 'ring-2 ring-gold ring-offset-2 ring-offset-midnight' : ''}
              `}
            >
              Contact us
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            className="lg:hidden p-2 rounded-sm text-cream/80 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-gold transition-colors duration-200"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
          >
            <AnimatePresence mode="wait" initial={false}>
              {menuOpen ? (
                <motion.span
                  key="close"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.18 }}
                >
                  <X size={24} />
                </motion.span>
              ) : (
                <motion.span
                  key="menu"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                  transition={{ duration: 0.18 }}
                >
                  <Menu size={24} />
                </motion.span>
              )}
            </AnimatePresence>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            id="mobile-menu"
            key="mobile-menu"
            variants={mobileMenuVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="lg:hidden overflow-hidden bg-midnight border-t border-white/10"
          >
            <nav className="flex flex-col px-4 py-4 gap-1" aria-label="Mobile navigation">
              {NAV_LINKS.map(({ label, to }, i) => (
                <motion.div
                  key={to}
                  custom={i}
                  variants={mobileLinkVariants}
                  initial="hidden"
                  animate="visible"
                >
                  <Link
                    to={to}
                    className={`flex items-center px-4 py-3 rounded-sm text-sm font-medium tracking-wide border-l-2 transition-colors duration-200
                      ${
                        isActive(to)
                          ? 'border-gold text-gold bg-gold/5'
                          : 'border-transparent text-cream/75 hover:text-white hover:border-gold/40 hover:bg-white/5'
                      }
                    `}
                  >
                    {label}
                  </Link>
                </motion.div>
              ))}

              <motion.div
                custom={NAV_LINKS.length}
                variants={mobileLinkVariants}
                initial="hidden"
                animate="visible"
                className="mt-3 px-4"
              >
                <Link
                  to="/contact"
                  className="block w-full text-center px-5 py-3 text-sm font-semibold tracking-wide rounded-sm
                    bg-gold text-midnight hover:bg-gold-light active:bg-gold-dark transition-colors duration-200"
                >
                  Contact us
                </Link>
              </motion.div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
