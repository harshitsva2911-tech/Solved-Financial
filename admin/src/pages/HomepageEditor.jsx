import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Save } from 'lucide-react';
import API_BASE from '../utils/config';

export default function HomepageEditor() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await axios.get(`${API_BASE}/homepage`, { withCredentials: true });
      setData(res.data);
    } catch (error) {
      toast.error('Failed to load homepage data');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (section, field, value, subSection = null) => {
    setData((prev) => {
      const updated = { ...prev };
      if (subSection) {
        updated[section][subSection][field] = value;
      } else {
        updated[section][field] = value;
      }
      return updated;
    });
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await axios.put(`${API_BASE}/homepage`, data, { withCredentials: true });
      toast.success('Homepage data updated');
    } catch (error) {
      toast.error('Failed to update homepage');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (!data) return <div>No data found</div>;

  return (
    <div className="max-w-4xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Homepage Content</h1>
          <p className="text-sm text-gray-500 mt-1">Manage the 9 sections of the homepage</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
        >
          <Save size={18} />
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      <div className="space-y-8">
        {/* Hero Section */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">1. Hero Section</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Headline</label>
              <input
                type="text"
                value={data.hero?.headline || ''}
                onChange={(e) => handleChange('hero', 'headline', e.target.value)}
                className="w-full px-3 py-2 border rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Supporting Text</label>
              <textarea
                value={data.hero?.text || ''}
                onChange={(e) => handleChange('hero', 'text', e.target.value)}
                className="w-full px-3 py-2 border rounded-md h-24"
              />
            </div>
          </div>
        </div>

        {/* Cyprus Card */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">2a. Cyprus Card</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Text</label>
              <textarea
                value={data.countryCards?.cyprus?.text || ''}
                onChange={(e) => handleChange('countryCards', 'text', e.target.value, 'cyprus')}
                className="w-full px-3 py-2 border rounded-md h-24"
              />
            </div>
          </div>
        </div>

        {/* Netherlands Card */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">2b. Netherlands Card</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Text</label>
              <textarea
                value={data.countryCards?.netherlands?.text || ''}
                onChange={(e) => handleChange('countryCards', 'text', e.target.value, 'netherlands')}
                className="w-full px-3 py-2 border rounded-md h-24"
              />
            </div>
          </div>
        </div>

        {/* Boutique Section */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">3. Boutique Section</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Text</label>
              <textarea
                value={data.boutiqueSection?.text || ''}
                onChange={(e) => handleChange('boutiqueSection', 'text', e.target.value)}
                className="w-full px-3 py-2 border rounded-md h-24"
              />
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
