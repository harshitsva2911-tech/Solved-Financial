import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Plus, Edit2, Trash2, X, ChevronUp, ChevronDown } from 'lucide-react';
import api from '../utils/api';
import ImageUpload from '../components/ImageUpload';

const empty = { title: '', description: '', image: '', challenges: '', support: '', order: 0, active: true };

export default function Industries() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState(empty);
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/industries/admin/all');
      setItems(data);
    } catch { toast.error('Failed to load industries'); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const open = (item = null) => {
    if (item) {
      setForm({
        ...item,
        challenges: Array.isArray(item.challenges) ? item.challenges.join('\n') : item.challenges || '',
        support: Array.isArray(item.support) ? item.support.join('\n') : item.support || '',
      });
      setEditing(item._id);
    } else {
      setForm(empty);
      setEditing(null);
    }
    setModal(true);
  };

  const close = () => { setModal(false); setForm(empty); setEditing(null); };

  const submit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        ...form,
        challenges: form.challenges.split('\n').map(s => s.trim()).filter(Boolean),
        support: form.support.split('\n').map(s => s.trim()).filter(Boolean),
      };
      if (editing) await api.put(`/industries/${editing}`, payload);
      else await api.post('/industries', payload);
      toast.success(editing ? 'Industry updated' : 'Industry created');
      close(); load();
    } catch (err) { toast.error(err.response?.data?.message || 'Save failed'); }
    finally { setSaving(false); }
  };

  const remove = async (id) => {
    if (!window.confirm('Delete this industry?')) return;
    try {
      await api.delete(`/industries/${id}`);
      toast.success('Deleted');
      load();
    } catch { toast.error('Delete failed'); }
  };

  const reorder = async (id, dir) => {
    const idx = items.findIndex(i => i._id === id);
    const other = dir === 'up' ? items[idx - 1] : items[idx + 1];
    if (!other) return;
    try {
      await Promise.all([
        api.put(`/industries/${id}`, { order: other.order }),
        api.put(`/industries/${other._id}`, { order: items[idx].order }),
      ]);
      load();
    } catch { toast.error('Reorder failed'); }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Industries</h1>
          <p className="text-sm text-gray-500 mt-0.5">Manage industry sectors displayed on the website</p>
        </div>
        <button className="btn-primary" onClick={() => open()}>
          <Plus size={16} /> Add Industry
        </button>
      </div>

      <div className="card p-0 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-400">Loading...</div>
        ) : (
          <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr>
                <th className="table-header w-12">Order</th>
                <th className="table-header">Title</th>
                <th className="table-header hidden md:table-cell">Description</th>
                <th className="table-header">Status</th>
                <th className="table-header w-32">Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, i) => (
                <tr key={item._id} className="hover:bg-gray-50/50">
                  <td className="table-cell">
                    <div className="flex flex-col gap-1 items-center">
                      <button onClick={() => reorder(item._id, 'up')} disabled={i === 0} className="text-gray-400 hover:text-gray-700 disabled:opacity-20"><ChevronUp size={14} /></button>
                      <span className="text-xs text-gray-400 font-mono">{item.order}</span>
                      <button onClick={() => reorder(item._id, 'down')} disabled={i === items.length - 1} className="text-gray-400 hover:text-gray-700 disabled:opacity-20"><ChevronDown size={14} /></button>
                    </div>
                  </td>
                  <td className="table-cell font-medium text-gray-900">{item.title}</td>
                  <td className="table-cell hidden md:table-cell text-gray-500 max-w-xs">
                    <span className="line-clamp-2 text-xs">{item.description}</span>
                  </td>
                  <td className="table-cell">
                    <span className={`badge ${item.active ? 'badge-published' : 'badge-draft'}`}>
                      {item.active ? 'Active' : 'Hidden'}
                    </span>
                  </td>
                  <td className="table-cell">
                    <div className="flex items-center gap-2">
                      <button onClick={() => open(item)} className="p-1.5 rounded-lg hover:bg-blue-50 text-blue-600 transition-colors"><Edit2 size={14} /></button>
                      <button onClick={() => remove(item._id)} className="p-1.5 rounded-lg hover:bg-red-50 text-red-500 transition-colors"><Trash2 size={14} /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {!items.length && <tr><td colSpan={5} className="text-center py-12 text-gray-400">No industries yet. Add one to get started.</td></tr>}
            </tbody>
          </table>
          </div>
        )}
      </div>

      {modal && (
        <div className="modal-overlay" onClick={close}>
          <div className="modal-box" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between p-5 border-b border-gray-100">
              <h2 className="font-bold text-gray-900">{editing ? 'Edit Industry' : 'Add Industry'}</h2>
              <button onClick={close} className="text-gray-400 hover:text-gray-700"><X size={20} /></button>
            </div>
            <form onSubmit={submit} className="p-5 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="col-span-1 sm:col-span-2">
                  <label className="label">Title *</label>
                  <input className="input-field" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} required placeholder="e.g. Startups & Scale-ups" />
                </div>
                <div className="col-span-1 sm:col-span-2">
                  <label className="label">Description</label>
                  <textarea className="input-field resize-none" rows={3} value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="Brief description of this industry sector..." />
                </div>
                <div className="col-span-1 sm:col-span-2">
                  <label className="label">Challenges (one per line)</label>
                  <textarea className="input-field resize-none font-mono text-xs" rows={4} value={form.challenges} onChange={e => setForm(f => ({ ...f, challenges: e.target.value }))} placeholder={"Rapid growth without financial infrastructure\nInvestor reporting requirements\nCash flow management"} />
                </div>
                <div className="col-span-1 sm:col-span-2">
                  <label className="label">How We Support (one per line)</label>
                  <textarea className="input-field resize-none font-mono text-xs" rows={4} value={form.support} onChange={e => setForm(f => ({ ...f, support: e.target.value }))} placeholder={"Fractional CFO services\nInvestor-ready financial reporting\nGrowth financial modelling"} />
                </div>
                <div className="col-span-1 sm:col-span-2">
                  <ImageUpload
                    value={form.image}
                    onChange={(url) => setForm(f => ({ ...f, image: url }))}
                    label="Industry Image"
                    hint="900 Ã— 560 px"
                    aspectHint="16:10"
                  />
                </div>
                <div>
                  <label className="label">Display Order</label>
                  <input type="number" className="input-field" value={form.order} onChange={e => setForm(f => ({ ...f, order: Number(e.target.value) }))} min={0} />
                </div>
                <div className="flex items-center gap-3 pt-6">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" checked={form.active} onChange={e => setForm(f => ({ ...f, active: e.target.checked }))} />
                    <div className="w-10 h-5 bg-gray-200 rounded-full peer peer-checked:bg-gold-400 after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-5" />
                  </label>
                  <span className="text-sm text-gray-600">Active (visible on site)</span>
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-2 border-t border-gray-100">
                <button type="button" className="btn-secondary" onClick={close}>Cancel</button>
                <button type="submit" className="btn-primary" disabled={saving}>
                  {saving ? 'Saving...' : editing ? 'Update Industry' : 'Create Industry'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
