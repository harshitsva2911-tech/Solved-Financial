import React, { useEffect, useState, useCallback } from 'react';
import toast from 'react-hot-toast';
import { Edit2, Check, X, ChevronUp, ChevronDown } from 'lucide-react';
import api from '../utils/api';

export default function Metrics() {
  const [metrics, setMetrics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [saving, setSaving] = useState(false);

  const fetchMetrics = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get('/metrics');
      const data = Array.isArray(res.data) ? res.data : res.data.metrics || [];
      setMetrics(data.sort((a, b) => (a.order ?? 0) - (b.order ?? 0)));
    } catch (e) {
      toast.error('Failed to load metrics');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchMetrics(); }, [fetchMetrics]);

  const startEdit = (metric) => {
    setEditingId(metric._id);
    setEditForm({
      value: metric.value || '',
      label: metric.label || '',
      description: metric.description || '',
      active: metric.active !== false,
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditForm({});
  };

  const handleSave = async (id) => {
    setSaving(true);
    try {
      await api.put(`/metrics/${id}`, editForm);
      toast.success('Metric updated');
      setMetrics((prev) => prev.map((m) => m._id === id ? { ...m, ...editForm } : m));
      cancelEdit();
    } catch (e) {
      toast.error('Save failed');
    } finally {
      setSaving(false);
    }
  };

  const handleReorder = async (index, direction) => {
    const newMetrics = [...metrics];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newMetrics.length) return;
    [newMetrics[index], newMetrics[targetIndex]] = [newMetrics[targetIndex], newMetrics[index]];
    const updated = newMetrics.map((m, i) => ({ ...m, order: i }));
    setMetrics(updated);
    try {
      await Promise.all([
        api.put(`/metrics/${updated[index]._id}`, { order: updated[index].order }),
        api.put(`/metrics/${updated[targetIndex]._id}`, { order: updated[targetIndex].order }),
      ]);
    } catch (e) {
      toast.error('Reorder failed');
      fetchMetrics();
    }
  };

  if (loading) return <div className="text-center py-12 text-gray-400">Loading metrics...</div>;

  return (
    <div>
      <p className="text-gray-500 text-sm mb-6">
        These counters appear on the homepage. Edit values to update them.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {metrics.map((metric, index) => (
          <div
            key={metric._id}
            className={`bg-white rounded-xl shadow-sm border overflow-hidden transition-all ${!metric.active ? 'opacity-60' : ''} ${editingId === metric._id ? 'ring-2' : 'border-gray-100'}`}
            style={editingId === metric._id ? { ringColor: '#001B2F', borderColor: '#001B2F' } : {}}
          >
            {/* Card top accent */}
            <div className="h-1.5" style={{ backgroundColor: '#D4B684' }} />

            <div className="p-5">
              {editingId === metric._id ? (
                /* Edit mode */
                <div className="space-y-3">
                  <div>
                    <label className="text-xs text-gray-400 block mb-1">Value</label>
                    <input
                      value={editForm.value}
                      onChange={(e) => setEditForm({ ...editForm, value: e.target.value })}
                      className="w-full px-2.5 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none font-bold"
                      onFocus={(e) => (e.target.style.borderColor = '#001B2F')}
                      onBlur={(e) => (e.target.style.borderColor = '#D1D5DB')}
                      placeholder="e.g. 123k+"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-gray-400 block mb-1">Label</label>
                    <input
                      value={editForm.label}
                      onChange={(e) => setEditForm({ ...editForm, label: e.target.value })}
                      className="w-full px-2.5 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none"
                      onFocus={(e) => (e.target.style.borderColor = '#001B2F')}
                      onBlur={(e) => (e.target.style.borderColor = '#D1D5DB')}
                      placeholder="Label"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-gray-400 block mb-1">Description</label>
                    <input
                      value={editForm.description}
                      onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                      className="w-full px-2.5 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none"
                      onFocus={(e) => (e.target.style.borderColor = '#001B2F')}
                      onBlur={(e) => (e.target.style.borderColor = '#D1D5DB')}
                      placeholder="Short description"
                    />
                  </div>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <div
                      className="w-8 h-4 rounded-full relative transition-colors"
                      style={{ backgroundColor: editForm.active ? '#001B2F' : '#E5E7EB' }}
                      onClick={() => setEditForm({ ...editForm, active: !editForm.active })}
                    >
                      <div className={`w-3 h-3 bg-white rounded-full absolute top-0.5 transition-transform shadow ${editForm.active ? 'translate-x-4' : 'translate-x-0.5'}`} />
                    </div>
                    <span className="text-xs text-gray-600">Active</span>
                  </label>

                  <div className="flex gap-2 pt-1">
                    <button
                      onClick={() => handleSave(metric._id)}
                      disabled={saving}
                      className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-medium text-white"
                      style={{ backgroundColor: '#001B2F' }}
                    >
                      <Check size={12} /> Save
                    </button>
                    <button
                      onClick={cancelEdit}
                      className="px-3 py-1.5 rounded-lg text-xs font-medium text-gray-600 border border-gray-200 hover:bg-gray-50"
                    >
                      <X size={12} />
                    </button>
                  </div>
                </div>
              ) : (
                /* View mode */
                <>
                  <div className="text-3xl font-bold mb-1" style={{ color: '#001B2F' }}>
                    {metric.value}
                  </div>
                  <div className="font-semibold text-gray-700 text-sm">{metric.label}</div>
                  {metric.description && (
                    <p className="text-xs text-gray-400 mt-1 leading-relaxed">{metric.description}</p>
                  )}
                  {!metric.active && (
                    <span className="inline-block mt-2 text-xs text-red-500 bg-red-50 px-2 py-0.5 rounded">Inactive</span>
                  )}

                  <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100">
                    <div className="flex flex-col gap-0.5">
                      <button
                        onClick={() => handleReorder(index, 'up')}
                        disabled={index === 0}
                        className="p-0.5 rounded text-gray-300 hover:text-gray-600 disabled:opacity-30"
                      >
                        <ChevronUp size={13} />
                      </button>
                      <button
                        onClick={() => handleReorder(index, 'down')}
                        disabled={index === metrics.length - 1}
                        className="p-0.5 rounded text-gray-300 hover:text-gray-600 disabled:opacity-30"
                      >
                        <ChevronDown size={13} />
                      </button>
                    </div>
                    <button
                      onClick={() => startEdit(metric)}
                      className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
                    >
                      <Edit2 size={14} />
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        ))}
      </div>

      {metrics.length === 0 && (
        <div className="text-center py-12 text-gray-400 bg-white rounded-xl border border-gray-100">
          No metrics found. Add metrics via the API or database.
        </div>
      )}
    </div>
  );
}
