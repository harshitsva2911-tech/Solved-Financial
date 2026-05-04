import React, { useEffect, useState, useCallback } from 'react';
import toast from 'react-hot-toast';
import { Plus, Edit2, Trash2, X, ChevronUp, ChevronDown } from 'lucide-react';
import api from '../utils/api';
import ImageUpload from '../components/ImageUpload';

const emptyForm = {
  title: '',
  subtitle: '',
  situation: '',
  approach: '',
  outcomes: '',
  image: '',
  order: 0,
  active: true,
};

export default function CaseStudies() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const fetchItems = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get('/case-studies');
      const data = Array.isArray(res.data) ? res.data : res.data.caseStudies || [];
      setItems(data.sort((a, b) => (a.order ?? 0) - (b.order ?? 0)));
    } catch (e) {
      toast.error('Failed to load case studies');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchItems(); }, [fetchItems]);

  const openNew = () => {
    setForm({ ...emptyForm, order: items.length });
    setEditingId(null);
    setShowModal(true);
  };

  const openEdit = (item) => {
    setForm({
      title: item.title || '',
      subtitle: item.subtitle || '',
      situation: item.situation || '',
      approach: item.approach || '',
      outcomes: Array.isArray(item.outcomes) ? item.outcomes.join('\n') : item.outcomes || '',
      image: item.image || '',
      order: item.order ?? 0,
      active: item.active !== false,
    });
    setEditingId(item._id);
    setShowModal(true);
  };

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Delete "${title}"?`)) return;
    try {
      await api.delete(`/case-studies/${id}`);
      toast.success('Case study deleted');
      fetchItems();
    } catch (e) {
      toast.error('Delete failed');
    }
  };

  const handleReorder = async (index, direction) => {
    const newItems = [...items];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newItems.length) return;
    [newItems[index], newItems[targetIndex]] = [newItems[targetIndex], newItems[index]];
    const updated = newItems.map((s, i) => ({ ...s, order: i }));
    setItems(updated);
    try {
      await Promise.all([
        api.put(`/case-studies/${updated[index]._id}`, { order: updated[index].order }),
        api.put(`/case-studies/${updated[targetIndex]._id}`, { order: updated[targetIndex].order }),
      ]);
    } catch (e) {
      toast.error('Reorder failed');
      fetchItems();
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        ...form,
        outcomes: form.outcomes.split('\n').map((o) => o.trim()).filter(Boolean),
        order: Number(form.order),
      };
      if (editingId) {
        await api.put(`/case-studies/${editingId}`, payload);
        toast.success('Case study updated');
      } else {
        await api.post('/case-studies', payload);
        toast.success('Case study created');
      }
      setShowModal(false);
      fetchItems();
    } catch (e) {
      toast.error(e.response?.data?.message || 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <p className="text-gray-500 text-sm">{items.length} case studies</p>
        <button
          onClick={openNew}
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium text-white"
          style={{ backgroundColor: '#001B2F' }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#002d4f')}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#001B2F')}
        >
          <Plus size={16} /> New Case Study
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-gray-400">Loading...</div>
        ) : items.length === 0 ? (
          <div className="p-12 text-center text-gray-400">No case studies yet.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100 text-xs text-gray-400 uppercase tracking-wide">
                  <th className="text-left px-4 py-3 font-medium w-16">Order</th>
                  <th className="text-left px-6 py-3 font-medium">Title</th>
                  <th className="text-left px-6 py-3 font-medium">Subtitle</th>
                  <th className="text-left px-6 py-3 font-medium">Active</th>
                  <th className="text-right px-6 py-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item, index) => (
                  <tr key={item._id} className="border-b border-gray-50 hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div className="flex flex-col gap-0.5 items-center">
                        <button
                          onClick={() => handleReorder(index, 'up')}
                          disabled={index === 0}
                          className="p-0.5 rounded text-gray-300 hover:text-gray-600 disabled:opacity-30"
                        >
                          <ChevronUp size={14} />
                        </button>
                        <span className="text-xs text-gray-400">{index + 1}</span>
                        <button
                          onClick={() => handleReorder(index, 'down')}
                          disabled={index === items.length - 1}
                          className="p-0.5 rounded text-gray-300 hover:text-gray-600 disabled:opacity-30"
                        >
                          <ChevronDown size={14} />
                        </button>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{item.title}</td>
                    <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">{item.subtitle}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${item.active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                        {item.active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 justify-end">
                        <button onClick={() => openEdit(item)} className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100">
                          <Edit2 size={14} />
                        </button>
                        <button onClick={() => handleDelete(item._id, item.title)} className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50">
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
              <h2 className="text-lg font-semibold text-gray-900">{editingId ? 'Edit Case Study' : 'New Case Study'}</h2>
              <button onClick={() => setShowModal(false)} className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100">
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Title *</label>
                <input
                  required
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none"
                  onFocus={(e) => (e.target.style.borderColor = '#001B2F')}
                  onBlur={(e) => (e.target.style.borderColor = '#D1D5DB')}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Subtitle</label>
                <input
                  value={form.subtitle}
                  onChange={(e) => setForm({ ...form, subtitle: e.target.value })}
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none"
                  onFocus={(e) => (e.target.style.borderColor = '#001B2F')}
                  onBlur={(e) => (e.target.style.borderColor = '#D1D5DB')}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Situation</label>
                <textarea
                  rows={3}
                  value={form.situation}
                  onChange={(e) => setForm({ ...form, situation: e.target.value })}
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none resize-none"
                  onFocus={(e) => (e.target.style.borderColor = '#001B2F')}
                  onBlur={(e) => (e.target.style.borderColor = '#D1D5DB')}
                  placeholder="Describe the client situation..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Approach</label>
                <textarea
                  rows={3}
                  value={form.approach}
                  onChange={(e) => setForm({ ...form, approach: e.target.value })}
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none resize-none"
                  onFocus={(e) => (e.target.style.borderColor = '#001B2F')}
                  onBlur={(e) => (e.target.style.borderColor = '#D1D5DB')}
                  placeholder="Describe the approach taken..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Outcomes <span className="text-gray-400 font-normal">(one per line)</span>
                </label>
                <textarea
                  rows={4}
                  value={form.outcomes}
                  onChange={(e) => setForm({ ...form, outcomes: e.target.value })}
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none resize-none font-mono"
                  onFocus={(e) => (e.target.style.borderColor = '#001B2F')}
                  onBlur={(e) => (e.target.style.borderColor = '#D1D5DB')}
                  placeholder="Reduced tax liability by 30%&#10;Achieved compliance in 3 months&#10;Expanded to 2 new jurisdictions"
                />
              </div>

              <div>
                <ImageUpload
                  value={form.image}
                  onChange={(url) => setForm({ ...form, image: url })}
                  label="Case Study Image"
                  hint="900 × 560 px"
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
