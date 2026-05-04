import React, { useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  FileText,
  Mail,
  Briefcase,
  Users,
  BookOpen,
  Building2,
  Globe,
  BarChart3,
  Image,
  Settings,
  LogOut,
  ChevronRight,
  Menu,
  X,
  Scale,
  FolderOpen,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import SolvedLogo from './SolvedLogo';

const navItems = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard', exact: true },
  { to: '/articles', icon: FileText, label: 'Articles' },
  { to: '/contacts', icon: Mail, label: 'Contacts' },
  { to: '/services', icon: Briefcase, label: 'Services' },
  { to: '/team', icon: Users, label: 'Team' },
  { to: '/case-studies', icon: BookOpen, label: 'Case Studies' },
  { to: '/industries', icon: Building2, label: 'Industries' },
  { to: '/jurisdictions', icon: Globe, label: 'Jurisdictions' },
  { to: '/metrics', icon: BarChart3, label: 'Metrics' },
  { to: '/logos', icon: Image, label: 'Partner Logos' },
  { to: '/documents', icon: FolderOpen, label: 'Documents' },
  { to: '/legal', icon: Scale, label: 'Legal Pages' },
  { to: '/settings', icon: Settings, label: 'Settings' },
];

const pageTitles = {
  '/': 'Dashboard',
  '/articles': 'Articles',
  '/contacts': 'Contact Submissions',
  '/services': 'Services',
  '/team': 'Team Members',
  '/case-studies': 'Case Studies',
  '/industries': 'Industries',
  '/jurisdictions': 'Jurisdictions',
  '/metrics': 'Metrics',
  '/logos': 'Partner Logos',
  '/documents': 'Document Library',
  '/legal': 'Legal Pages',
  '/settings': 'Settings',
};

export default function Layout({ children }) {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const pageTitle = pageTitles[location.pathname] || 'Admin';

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const initials = user?.name
    ? user.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
    : 'AD';

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-30 w-60 bg-midnight flex flex-col transition-transform duration-300 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
        style={{ backgroundColor: '#001B2F' }}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-white border-opacity-10">
          <SolvedLogo height={34} />
          <button
            className="ml-auto lg:hidden text-white opacity-60 hover:opacity-100 flex-shrink-0"
            onClick={() => setSidebarOpen(false)}
          >
            <X size={18} />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-4 px-3">
          {navItems.map(({ to, icon: Icon, label, exact }) => (
            <NavLink
              key={to}
              to={to}
              end={exact}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg mb-0.5 text-sm font-medium transition-all duration-150 ${
                  isActive
                    ? 'text-midnight font-semibold'
                    : 'text-white text-opacity-70 hover:text-white hover:bg-white hover:bg-opacity-10'
                }`
              }
              style={({ isActive }) =>
                isActive
                  ? { backgroundColor: '#D4B684', color: '#001B2F' }
                  : {}
              }
            >
              <Icon size={17} />
              {label}
            </NavLink>
          ))}
        </nav>

        {/* User section */}
        <div className="border-t border-white border-opacity-10 p-4">
          <div className="flex items-center gap-3 mb-3">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
              style={{ backgroundColor: '#D4B684', color: '#001B2F' }}
            >
              {initials}
            </div>
            <div className="min-w-0">
              <div className="text-white text-sm font-medium truncate">{user?.name || 'Admin'}</div>
              <div className="text-xs text-white text-opacity-50 truncate">{user?.email || ''}</div>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-white text-opacity-60 hover:text-white hover:bg-white hover:bg-opacity-10 transition-all"
          >
            <LogOut size={15} />
            Sign out
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top bar */}
        <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center gap-4 flex-shrink-0">
          <button
            className="lg:hidden text-gray-500 hover:text-gray-700"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu size={20} />
          </button>
          <div>
            <h1 className="text-xl font-bold text-gray-900">{pageTitle}</h1>
            <div className="flex items-center gap-1 text-xs text-gray-400 mt-0.5">
              <span>SFS Admin</span>
              <ChevronRight size={12} />
              <span style={{ color: '#D4B684' }}>{pageTitle}</span>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
