import React, { useEffect, useState, useCallback } from 'react';
import toast from 'react-hot-toast';
import { Plus, Edit2, Trash2, X, ChevronUp, ChevronDown, ToggleLeft, ToggleRight } from 'lucide-react';
import api from '../utils/api';
import ImageUpload from '../components/ImageUpload';

const slugify = (str) =>
  str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

const emptyForm = {
  title: '',
  slug: '',
  excerpt: '',
  description: '',
  features: '',
  image: '',
  order: 0,
  active: true,
};

export default function Services() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const fetchServices = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get('/services/admin/all');
      const data = Array.isArray(res.data) ? res.data : res.data.services || [];
      setServices(data.sort((a, b) => (a.order ?? 0) - (b.order ?? 0)));
    } catch (e) {
      toast.error('Failed to load services');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchServices(); }, [fetchServices]);

  const openNew = () => {
    setForm({ ...emptyForm, order: services.length });
    setEditingId(null);
    setShowModal(true);
  };

  const openEdit = (service) => {
    setForm({
      title: service.title || '',
      slug: service.slug || '',
      excerpt: service.excerpt || '',
      description: service.description || '',
      features: Array.isArray(service.features) ? service.features.join(', ') : service.features || '',
      image: service.image || '',
      order: service.order ?? 0,
      active: service.active !== false,
    });
    setEditingId(service._id);
    setShowModal(true);
  };

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Delete "${title}"?`)) return;
    try {
      await api.delete(`/services/${id}`);
      toast.success('Service deleted');
      fetchServices();
    } catch (e) {
      toast.error('Delete failed');
    }
  };

  const handleToggleActive = async (service) => {
    try {
      await api.put(`/services/${service._id}`, { active: !service.active });
      setServices((prev) => prev.map((s) => s._id === service._id ? { ...s, active: !s.active } : s));
      toast.success(`Service ${!service.active ? 'activated' : 'deactivated'}`);
    } catch (e) {
      toast.error('Update failed');
    }
  };

  const handleReorder = async (index, direction) => {
    const newServices = [...services];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newServices.length) return;
    [newServices[index], newServices[targetIndex]] = [newServices[targetIndex], newServices[index]];

    const updated = newServices.map((s, i) => ({ ...s, order: i }));
    setServices(updated);

    try {
      await Promise.all([
        api.put(`/services/${updated[index]._id}`, { order: updated[index].order }),
        api.put(`/services/${updated[targetIndex]._id}`, { order: updated[targetIndex].order }),
      ]);
    } catch (e) {
      toast.error('Reorder failed');
      fetchServices();
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        ...form,
        features: form.features.split(',').map((f) => f.trim()).filter(Boolean),
        order: Number(form.order),
      };
      if (editingId) {
        await api.put(`/services/${editingId}`, payload);
        toast.success('Service updated');
      } else {
        await api.post('/services', payload);
        toast.success('Service created');
      }
      setShowModal(false);
      fetchServices();
    } catch (e) {
      toast.error(e.response?.data?.message || 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <p className="text-gray-500 text-sm">{services.length} services</p>
        <button
          onClick={openNew}
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium text-white"
          style={{ backgroundColor: '#001B2F' }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#002d4f')}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#001B2F')}
        >
          <Plus size={16} /> New Service
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-gray-400">Loading...</div>
        ) : services.length === 0 ? (
          <div className="p-12 text-center text-gray-400">No services yet.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100 text-xs text-gray-400 uppercase tracking-wide">
                  <th className="text-left px-4 py-3 font-medium w-16">Order</th>
                  <th className="text-left px-4 py-3 font-medium">Title</th>
                  <th className="text-left px-4 py-3 font-medium">Excerpt</th>
                  <th className="text-left px-4 py-3 font-medium">Active</th>
                  <th className="text-right px-4 py-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {services.map((service, index) => (
                  <tr key={service._id} className="border-b border-gray-50 hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div className="flex flex-col gap-0.5">
                        <button
                          onClick={() => handleReorder(index, 'up')}
                          disabled={index === 0}
                          className="p-0.5 rounded text-gray-300 hover:text-gray-600 disabled:opacity-30"
                        >
                          <ChevronUp size={14} />
                        </button>
                        <span className="text-xs text-gray-400 text-center">{index + 1}</span>
                        <button
                          onClick={() => handleReorder(index, 'down')}
                          disabled={index === services.length - 1}
                          className="p-0.5 rounded text-gray-300 hover:text-gray-600 disabled:opacity-30"
                        >
                          <ChevronDown size={14} />
                        </button>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-sm font-medium text-gray-900">{service.title}</p>
                      <p className="text-xs text-gray-400">{service.slug}</p>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500 max-w-xs truncate">{service.excerpt}</td>
                    <td className="px-4 py-3">
                      <button onClick={() => handleToggleActive(service)} className="transition-colors">
                        {service.active ? (
                          <ToggleRight size={22} style={{ color: '#16A34A' }} />
                        ) : (
                          <ToggleLeft size={22} className="text-gray-300" />
                        )}
                      </button>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2 justify-end">
                        <button onClick={() => openEdit(service)} className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100">
                          <Edit2 size={14} />
                        </button>
                        <button onClick={() => handleDelete(service._id, service.title)} className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-start justify-center p-4 overflow-y-auto" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl my-8">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h2 className="text-lg font-semibold text-gray-900">{editingId ? 'Edit Service' : 'New Service'}</h2>
              <button onClick={() => setShowModal(false)} className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100">
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Title *</label>
                  <input
                    required
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value, slug: slugify(e.target.value) })}
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none"
                    onFocus={(e) => (e.target.style.borderColor = '#001B2F')}
                    onBlur={(e) => (e.target.style.borderColor = '#D1D5DB')}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Slug</label>
                  <input
                    value={form.slug}
                    onChange={(e) => setForm({ ...form, slug: e.target.value })}
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none bg-gray-50"
                    onFocus={(e) => (e.target.style.borderColor = '#001B2F')}
                    onBlur={(e) => (e.target.style.borderColor = '#D1D5DB')}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Excerpt</label>
                <textarea
                  rows={2}
                  value={form.excerpt}
                  onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none resize-none"
                  onFocus={(e) => (e.target.style.borderColor = '#001B2F')}
                  onBlur={(e) => (e.target.style.borderColor = '#D1D5DB')}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Description</label>
                <textarea
                  rows={4}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none resize-none"
                  onFocus={(e) => (e.target.style.borderColor = '#001B2F')}
                  onBlur={(e) => (e.target.style.borderColor = '#D1D5DB')}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Features <span className="text-gray-400 font-normal">(comma-separated)</span></label>
                <input
                  value={form.features}
                  onChange={(e) => setForm({ ...form, features: e.target.value })}
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none"
                  onFocus={(e) => (e.target.style.borderColor = '#001B2F')}
                  onBlur={(e) => (e.target.style.borderColor = '#D1D5DB')}
                  placeholder="Feature 1, Feature 2, Feature 3"
                />
              </div>

              <div>
                <ImageUpload
                  value={form.image}
                  onChange={(url) => setForm({ ...form, image: url })}
                  label="Service Image"
                  hint="800 × 500 px"
                  aspectHint="16:10"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Order #</label>
                  <input
                    type="number"
                    value={form.order}
                    onChange={(e) => setForm({ ...form, order: e.target.value })}
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none"
                    onFocus={(e) => (e.target.style.borderColor = '#001B2F')}
                    onBlur={(e) => (e.target.style.borderColor = '#D1D5DB')}
                  />
                </div>
              </div>

              <label className="flex items-center gap-3 cursor-pointer">
                <div
                  className="w-10 h-5 rounded-full relative transition-colors"
                  style={{ backgroundColor: form.active ? '#001B2F' : '#E5E7EB' }}
                  onClick={() => setForm({ ...form, active: !form.active })}
                >
                  <div className={`w-4 h-4 bg-white rounded-full absolute top-0.5 transition-transform shadow ${form.active ? 'translate-x-5' : 'translate-x-0.5'}`} />
                </div>
                <span className="text-sm text-gray-700">Active</span>
              </label>

              <div className="flex justify-end gap-3 pt-2 border-t border-gray-100">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-sm font-medium text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50">
                  Cancel
                </button>
                <button type="submit" disabled={saving} className="px-5 py-2 text-sm font-medium text-white rounded-lg disabled:opacity-60" style={{ backgroundColor: '#001B2F' }}>
                  {saving ? 'Saving...' : editingId ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
