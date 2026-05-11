import React, { useEffect, useState, useCallback } from 'react';
import toast from 'react-hot-toast';
import { Save, MapPin, Phone, Mail, Layout, Database, RefreshCw } from 'lucide-react';
import api from '../utils/api';

const LinkedInIcon = ({ size = 18, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
    <rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/>
  </svg>
);

const TwitterIcon = ({ size = 18, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.737-8.835L1.254 2.25H8.08l4.253 5.622 5.911-5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
);

const InstagramIcon = ({ size = 18, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" fill="none" stroke="currentColor" strokeWidth="2"/>
    <circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" strokeWidth="2"/>
    <circle cx="17.5" cy="6.5" r="1.5"/>
  </svg>
);

const SectionCard = ({ title, icon: Icon, children, onSave, saving }) => (
  <div className="bg-white rounded-xl shadow-sm border border-gray-100">
    <div className="flex items-center gap-3 px-6 py-4 border-b border-gray-100">
      <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#E6EDF3' }}>
        <Icon size={16} style={{ color: '#001B2F' }} />
      </div>
      <h2 className="font-semibold text-gray-900">{title}</h2>
    </div>
    <div className="p-6">
      {children}
      <div className="mt-6 pt-4 border-t border-gray-100 flex justify-end">
        <button
          onClick={onSave}
          disabled={saving}
          className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium text-white disabled:opacity-60 transition-all"
          style={{ backgroundColor: '#001B2F' }}
          onMouseEnter={(e) => !saving && (e.currentTarget.style.backgroundColor = '#002d4f')}
          onMouseLeave={(e) => !saving && (e.currentTarget.style.backgroundColor = '#001B2F')}
        >
          <Save size={14} />
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </div>
  </div>
);

const Field = ({ label, value, onChange, type = 'text', placeholder, multiline }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1.5">{label}</label>
    {multiline ? (
      <textarea
        rows={3}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none resize-none"
        onFocus={(e) => (e.target.style.borderColor = '#001B2F')}
        onBlur={(e) => (e.target.style.borderColor = '#D1D5DB')}
        placeholder={placeholder}
      />
    ) : (
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none"
        onFocus={(e) => (e.target.style.borderColor = '#001B2F')}
        onBlur={(e) => (e.target.style.borderColor = '#D1D5DB')}
        placeholder={placeholder}
      />
    )}
  </div>
);

export default function Settings() {
  const [settings, setSettings] = useState({});
  const [loading, setLoading] = useState(true);
  const [savingSections, setSavingSections] = useState({});
  const [migratingImages, setMigratingImages] = useState(false);
  const [migrationLog, setMigrationLog] = useState(null);

  const fetchSettings = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get('/settings');
      setSettings(res.data || {});
    } catch (e) {
      toast.error('Failed to load settings');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchSettings(); }, [fetchSettings]);

  const updateField = (key, value) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const runImageMigration = async () => {
    setMigratingImages(true);
    setMigrationLog(null);
    try {
      const res = await api.post('/seed/migrate-images');
      const { fixed, log, message } = res.data;
      setMigrationLog(log || []);
      if (fixed === 0) {
        toast.success('All image URLs are already correct — nothing to fix!');
      } else {
        toast.success(`${message}`);
      }
    } catch (e) {
      toast.error(e?.response?.data?.message || 'Migration failed');
    } finally {
      setMigratingImages(false);
    }
  };

  const saveSection = async (sectionKey, fields) => {
    setSavingSections((prev) => ({ ...prev, [sectionKey]: true }));
    try {
      const payload = fields.reduce((acc, key) => ({ ...acc, [key]: settings[key] ?? '' }), {});
      await api.put('/settings', payload);
      toast.success('Settings saved');
    } catch (e) {
      toast.error('Failed to save settings');
    } finally {
      setSavingSections((prev) => ({ ...prev, [sectionKey]: false }));
    }
  };

  if (loading) return <div className="text-center py-12 text-gray-400">Loading settings...</div>;

  return (
    <div className="max-w-3xl space-y-6">
      {/* Contact Info */}
      <SectionCard
        title="Contact Information"
        icon={Phone}
        onSave={() => saveSection('contact', ['address', 'phone', 'email'])}
        saving={savingSections.contact}
      >
        <div className="space-y-4">
          <Field
            label="Office Address"
            value={settings.address || ''}
            onChange={(v) => updateField('address', v)}
            placeholder="123 Financial District, City, Country"
            multiline
          />
          <div className="grid grid-cols-2 gap-4">
            <Field
              label="Phone Number"
              value={settings.phone || ''}
              onChange={(v) => updateField('phone', v)}
              placeholder="+1 (555) 000-0000"
            />
            <Field
              label="Email Address"
              value={settings.email || ''}
              onChange={(v) => updateField('email', v)}
              type="email"
              placeholder="info@solvedfinancial.com"
            />
          </div>
        </div>
      </SectionCard>

      {/* Social Links */}
      <SectionCard
        title="Social Media Links"
        icon={LinkedInIcon}
        onSave={() => saveSection('social', ['linkedin', 'twitter', 'instagram'])}
        saving={savingSections.social}
      >
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <LinkedInIcon size={18} className="text-gray-400 flex-shrink-0" />
            <Field
              label="LinkedIn"
              value={settings.linkedin || ''}
              onChange={(v) => updateField('linkedin', v)}
              placeholder="https://linkedin.com/company/..."
            />
          </div>
          <div className="flex items-center gap-3">
            <TwitterIcon size={18} className="text-gray-400 flex-shrink-0" />
            <Field
              label="Twitter / X"
              value={settings.twitter || ''}
              onChange={(v) => updateField('twitter', v)}
              placeholder="https://twitter.com/..."
            />
          </div>
          <div className="flex items-center gap-3">
            <InstagramIcon size={18} className="text-gray-400 flex-shrink-0" />
            <Field
              label="Instagram"
              value={settings.instagram || ''}
              onChange={(v) => updateField('instagram', v)}
              placeholder="https://instagram.com/..."
            />
          </div>
        </div>
      </SectionCard>

      {/* Homepage Content */}
      <SectionCard
        title="Homepage Content"
        icon={Layout}
        onSave={() => saveSection('homepage', ['heroTitle', 'heroSubtitle', 'ctaTitle'])}
        saving={savingSections.homepage}
      >
        <div className="space-y-4">
          <Field
            label="Hero Title"
            value={settings.heroTitle || ''}
            onChange={(v) => updateField('heroTitle', v)}
            placeholder="Your Financial Future, Solved"
          />
          <Field
            label="Hero Subtitle"
            value={settings.heroSubtitle || ''}
            onChange={(v) => updateField('heroSubtitle', v)}
            placeholder="Expert financial advisory for global businesses..."
            multiline
          />
          <Field
            label="CTA Section Title"
            value={settings.ctaTitle || ''}
            onChange={(v) => updateField('ctaTitle', v)}
            placeholder="Ready to Solve Your Financial Challenges?"
          />
        </div>
      </SectionCard>

      {/* Address display */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <MapPin size={16} className="text-blue-500 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-sm font-medium text-blue-800">Settings API</p>
            <p className="text-xs text-blue-600 mt-0.5">
              Settings are stored as key-value pairs via <code className="bg-blue-100 px-1 rounded">PUT /api/settings</code>.
              Each section saves independently to avoid overwriting unrelated fields.
            </p>
          </div>
        </div>
      </div>

      {/* Database Maintenance */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="flex items-center gap-3 px-6 py-4 border-b border-gray-100">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#E6EDF3' }}>
            <Database size={16} style={{ color: '#001B2F' }} />
          </div>
          <h2 className="font-semibold text-gray-900">Database Maintenance</h2>
        </div>
        <div className="p-6 space-y-4">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-gray-800">Fix Image URLs</p>
              <p className="text-xs text-gray-500 mt-0.5">
                Scans all records in the database and replaces any broken Figma or localhost image URLs
                with the correct permanent S3 URLs. Safe to run multiple times — only broken URLs are updated.
              </p>
            </div>
            <button
              onClick={runImageMigration}
              disabled={migratingImages}
              className="flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-white disabled:opacity-60 transition-all"
              style={{ backgroundColor: '#001B2F' }}
              onMouseEnter={(e) => !migratingImages && (e.currentTarget.style.backgroundColor = '#002d4f')}
              onMouseLeave={(e) => !migratingImages && (e.currentTarget.style.backgroundColor = '#001B2F')}
            >
              <RefreshCw size={14} className={migratingImages ? 'animate-spin' : ''} />
              {migratingImages ? 'Running...' : 'Fix Image URLs'}
            </button>
          </div>

          {migrationLog !== null && (
            <div className="rounded-lg bg-gray-50 border border-gray-200 p-4 max-h-64 overflow-y-auto">
              <p className="text-xs font-semibold text-gray-600 mb-2">Migration Log</p>
              {migrationLog.length === 0 ? (
                <p className="text-xs text-gray-400">No broken URLs found — database is clean.</p>
              ) : (
                <ul className="space-y-1">
                  {migrationLog.map((line, i) => (
                    <li key={i} className={`text-xs font-mono ${line.startsWith('⚠') ? 'text-amber-600' : 'text-green-700'}`}>
                      {line}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
