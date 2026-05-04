import React, { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import { Save, Shield, FileText, AlertTriangle, Cookie } from 'lucide-react';
import api from '../utils/api';

const LEGAL_SECTIONS = [
  {
    key: 'legal_privacy_policy',
    label: 'Privacy Policy',
    icon: Shield,
    placeholder: 'Enter the full Privacy Policy content here...',
    hint: 'Shown on /privacy-policy',
  },
  {
    key: 'legal_terms_of_service',
    label: 'Terms of Service',
    icon: FileText,
    placeholder: 'Enter the full Terms of Service content here...',
    hint: 'Shown on /terms-of-service',
  },
  {
    key: 'legal_cookie_policy',
    label: 'Cookie Policy',
    icon: Cookie,
    placeholder: 'Enter the full Cookie Policy content here...',
    hint: 'Shown on /cookie-policy',
  },
  {
    key: 'legal_regulatory_disclosure',
    label: 'Regulatory Disclosure',
    icon: AlertTriangle,
    placeholder: 'Enter regulatory disclosure and compliance statements here...',
    hint: 'Shown on /regulatory-disclosure',
  },
];

export default function LegalPages() {
  const [values, setValues] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState({});
  const [activeTab, setActiveTab] = useState(LEGAL_SECTIONS[0].key);

  const fetchSettings = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get('/settings');
      const data = res.data?.settings ?? res.data ?? {};
      const initial = {};
      LEGAL_SECTIONS.forEach(({ key }) => {
        initial[key] = data[key] ?? '';
      });
      setValues(initial);
    } catch {
      toast.error('Failed to load legal content');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchSettings(); }, [fetchSettings]);

  const handleSave = async (key) => {
    setSaving((prev) => ({ ...prev, [key]: true }));
    try {
      await api.put('/settings', { [key]: values[key] });
      toast.success('Saved successfully');
    } catch {
      toast.error('Save failed');
    } finally {
      setSaving((prev) => ({ ...prev, [key]: false }));
    }
  };

  const active = LEGAL_SECTIONS.find((s) => s.key === activeTab);

  return (
    <div className="max-w-4xl">
      {/* Tab bar */}
      <div className="flex gap-1 bg-gray-100 p-1 rounded-xl mb-6 w-fit">
        {LEGAL_SECTIONS.map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === key
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <Icon size={14} />
            {label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="bg-white rounded-xl p-12 text-center text-gray-400 shadow-sm border border-gray-100">
          Loading content…
        </div>
      ) : active ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#E6EDF3' }}>
                <active.icon size={16} style={{ color: '#001B2F' }} />
              </div>
              <div>
                <h2 className="font-semibold text-gray-900">{active.label}</h2>
                <p className="text-xs text-gray-400">{active.hint}</p>
              </div>
            </div>
            <button
              onClick={() => handleSave(active.key)}
              disabled={saving[active.key]}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white rounded-lg disabled:opacity-60 transition-all"
              style={{ backgroundColor: '#001B2F' }}
            >
              <Save size={14} />
              {saving[active.key] ? 'Saving…' : 'Save'}
            </button>
          </div>

          <div className="p-6">
            <textarea
              rows={28}
              value={values[active.key] || ''}
              onChange={(e) =>
                setValues((prev) => ({ ...prev, [active.key]: e.target.value }))
              }
              className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm text-gray-800 focus:outline-none focus:border-gray-400 resize-y font-mono leading-relaxed"
              placeholder={active.placeholder}
            />
            <p className="mt-2 text-xs text-gray-400">
              {(values[active.key] || '').length} characters
            </p>
          </div>
        </div>
      ) : null}
    </div>
  );
}
