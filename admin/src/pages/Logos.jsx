import React, { useEffect, useState, useCallback } from 'react';
import toast from 'react-hot-toast';
import { Plus, Trash2, X, ToggleLeft, ToggleRight, ExternalLink } from 'lucide-react';
import api from '../utils/api';
import ImageUpload from '../components/ImageUpload';

const emptyForm = {
  name: '',
  image: '',
  url: '',
  order: 0,
  active: true,
};

export default function Logos() {
  const [logos, setLogos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const fetchLogos = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get('/logos');
      const data = Array.isArray(res.data) ? res.data : res.data.logos || [];
      setLogos(data.sort((a, b) => (a.order ?? 0) - (b.order ?? 0)));
    } catch (e) {
      toast.error('Failed to load logos');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchLogos(); }, [fetchLogos]);

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Remove logo "${name}"?`)) return;
    try {
      await api.delete(`/logos/${id}`);
      toast.success('Logo removed');
      fetchLogos();
    } catch (e) {
      toast.error('Delete failed');
    }
  };

  const handleToggleActive = async (logo) => {
    try {
      await api.put(`/logos/${logo._id}`, { active: !logo.active });
      setLogos((prev) => prev.map((l) => l._id === logo._id ? { ...l, active: !l.active } : l));
      toast.success(`Logo ${!logo.active ? 'shown' : 'hidden'}`);
    } catch (e) {
      toast.error('Update failed');
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.post('/logos', { ...form, order: Number(form.order) });
      toast.success('Logo added');
      setShowModal(false);
      setForm(emptyForm);
      fetchLogos();
    } catch (e) {
      toast.error(e.response?.data?.message || 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <p className="text-gray-500 text-sm">{logos.length} partner logos</p>
        <button
          onClick={() => { setForm({ ...emptyForm, order: logos.length }); setShowModal(true); }}
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium text-white"
          style={{ backgroundColor: '#001B2F' }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#002d4f')}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#001B2F')}
        >
          <Plus size={16} /> Add Logo
        </button>
      </div>

      {loading ? (
        <div className="text-center py-12 text-gray-400">Loading...</div>
      ) : logos.length === 0 ? (
        <div className="text-center py-12 text-gray-400 bg-white rounded-xl border border-gray-100">
          <p className="mb-3">No partner logos yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-4">
          {logos.map((logo) => (
            <div
              key={logo._id}
              className={`bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden transition-all hover:shadow-md ${!logo.active ? 'opacity-50' : ''}`}
            >
              {/* Logo image */}
              <div className="h-32 flex items-center justify-center p-4 bg-gray-50">
                {logo.image ? (
                  <img
                    src={logo.image}
                    alt={logo.name}
                    className="max-h-full max-w-full object-contain"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                ) : null}
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold ${logo.image ? 'hidden' : 'flex'}`}
                  style={{ backgroundColor: '#E6EDF3', color: '#001B2F' }}
                >
                  {logo.name?.[0]?.toUpperCase() || '?'}
                </div>
              </div>

              <div className="p-3">
                <p className="text-sm font-medium text-gray-900 truncate">{logo.name}</p>
                {logo.url && (
                  <a
                    href={logo.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-gray-400 flex items-center gap-1 mt-0.5 hover:text-blue-500 truncate"
                  >
                    <ExternalLink size={10} />
                    {logo.url.replace(/^https?:\/\//, '')}
                  </a>
                )}

                <div className="flex items-center justify-between mt-3 pt-2 border-t border-gray-100">
                  <button
                    onClick={() => handleToggleActive(logo)}
                    className="transition-colors"
                    title={logo.active ? 'Hide' : 'Show'}
                  >
                    {logo.active ? (
                      <ToggleRight size={20} style={{ color: '#16A34A' }} />
                    ) : (
                      <ToggleLeft size={20} className="text-gray-300" />
                    )}
                  </button>
                  <button
                    onClick={() => handleDelete(logo._id, logo.name)}
                    className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h2 className="text-lg font-semibold text-gray-900">Add Partner Logo</h2>
              <button onClick={() => setShowModal(false)} className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100">
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Partner Name *</label>
                <input
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none"
                  onFocus={(e) => (e.target.style.borderColor = '#001B2F')}
                  onBlur={(e) => (e.target.style.borderColor = '#D1D5DB')}
                  placeholder="Partner company name"
                />
              </div>

              <div>
                <ImageUpload
                  value={form.image}
                  onChange={(url) => setForm({ ...form, image: url })}
                  label="Logo Image"
                  hint="300 × 120 px"
                  aspectHint="5:2"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Website URL</label>
                <input
                  value={form.url}
                  onChange={(e) => setForm({ ...form, url: e.target.value })}
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none"
                  onFocus={(e) => (e.target.style.borderColor = '#001B2F')}
                  onBlur={(e) => (e.target.style.borderColor = '#D1D5DB')}
                  placeholder="https://partner.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Display Order</label>
                <input
                  type="number"
                  value={form.order}
                  onChange={(e) => setForm({ ...form, order: e.target.value })}
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none"
                  onFocus={(e) => (e.target.style.borderColor = '#001B2F')}
                  onBlur={(e) => (e.target.style.borderColor = '#D1D5DB')}
                />
              </div>

              <div className="flex justify-end gap-3 pt-2 border-t border-gray-100">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-sm font-medium text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50">
                  Cancel
                </button>
                <button type="submit" disabled={saving} className="px-5 py-2 text-sm font-medium text-white rounded-lg disabled:opacity-60" style={{ backgroundColor: '#001B2F' }}>
                  {saving ? 'Saving...' : 'Add Logo'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
