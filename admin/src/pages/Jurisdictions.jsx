import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Plus, Edit2, Trash2, X, PlusCircle, MinusCircle } from 'lucide-react';
import api from '../utils/api';

const emptyService = { title: '', description: '', features: '' };
const emptyPivot = { title: '', description: '' };
const emptyForm = {
  country: '', slug: '', tagline: '', intro: '',
  partnerFirm: { name: '', description: '' },
  strategyPivot: { heading: 'Strategy Pivot', points: [{ ...emptyPivot }, { ...emptyPivot }] },
  services: [{ ...emptyService }],
  order: 0, active: true,
};

export default function Jurisdictions() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);
  const [tab, setTab] = useState('basic');

  const load = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/jurisdictions/admin/all');
      setItems(data);
    } catch { toast.error('Failed to load'); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const open = (item = null) => {
    if (item) {
      setForm({
        ...item,
        partnerFirm: item.partnerFirm || { name: '', description: '' },
        strategyPivot: item.strategyPivot || { heading: 'Strategy Pivot', points: [emptyPivot, emptyPivot] },
        services: (item.services || []).map(s => ({
          ...s,
          features: Array.isArray(s.features) ? s.features.join('\n') : s.features || '',
        })),
      });
      setEditing(item._id);
    } else {
      setForm({ ...emptyForm, strategyPivot: { heading: 'Strategy Pivot', points: [{ ...emptyPivot }, { ...emptyPivot }] }, services: [{ ...emptyService }] });
      setEditing(null);
    }
    setTab('basic');
    setModal(true);
  };

  const close = () => { setModal(false); setEditing(null); };

  const updateField = (path, value) => {
    setForm(f => {
      const clone = JSON.parse(JSON.stringify(f));
      const keys = path.split('.');
      let obj = clone;
      for (let i = 0; i < keys.length - 1; i++) obj = obj[keys[i]];
      obj[keys[keys.length - 1]] = value;
      return clone;
    });
  };

  const addPivotPoint = () => setForm(f => ({ ...f, strategyPivot: { ...f.strategyPivot, points: [...f.strategyPivot.points, { ...emptyPivot }] } }));
  const removePivotPoint = (i) => setForm(f => ({ ...f, strategyPivot: { ...f.strategyPivot, points: f.strategyPivot.points.filter((_, idx) => idx !== i) } }));

  const addService = () => setForm(f => ({ ...f, services: [...f.services, { ...emptyService }] }));
  const removeService = (i) => setForm(f => ({ ...f, services: f.services.filter((_, idx) => idx !== i) }));
  const updateService = (i, key, val) => setForm(f => {
    const services = [...f.services];
    services[i] = { ...services[i], [key]: val };
    return { ...f, services };
  });

  const submit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        ...form,
        services: form.services.map(s => ({
          ...s,
          features: s.features.split('\n').map(x => x.trim()).filter(Boolean),
        })),
      };
      if (editing) await api.put(`/jurisdictions/${editing}`, payload);
      else await api.post('/jurisdictions', payload);
      toast.success(editing ? 'Updated' : 'Created');
      close(); load();
    } catch (err) { toast.error(err.response?.data?.message || 'Save failed'); }
    finally { setSaving(false); }
  };

  const remove = async (id) => {
    if (!window.confirm('Delete this jurisdiction?')) return;
    try { await api.delete(`/jurisdictions/${id}`); toast.success('Deleted'); load(); }
    catch { toast.error('Delete failed'); }
  };

  const tabs = [
    { id: 'basic', label: 'Basic Info' },
    { id: 'strategy', label: 'Strategy Pivot' },
    { id: 'services', label: 'Services' },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Jurisdictions</h1>
          <p className="text-sm text-gray-500 mt-0.5">Manage country-specific content for Cyprus, Netherlands, and Greece</p>
        </div>
        <button className="btn-primary" onClick={() => open()}><Plus size={16} /> Add Jurisdiction</button>
      </div>

      <div className="card p-0 overflow-hidden">
        {loading ? <div className="p-8 text-center text-gray-400">Loading...</div> : (
          <table className="w-full">
            <thead>
              <tr>
                <th className="table-header">Country</th>
                <th className="table-header">Slug</th>
                <th className="table-header">Services</th>
                <th className="table-header">Status</th>
                <th className="table-header w-28">Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map(item => (
                <tr key={item._id} className="hover:bg-gray-50/50">
                  <td className="table-cell font-semibold text-gray-900">{item.country}</td>
                  <td className="table-cell font-mono text-xs text-gray-500">{item.slug}</td>
                  <td className="table-cell text-gray-500">{item.services?.length || 0} services</td>
                  <td className="table-cell">
                    <span className={`badge ${item.active ? 'badge-published' : 'badge-draft'}`}>{item.active ? 'Active' : 'Hidden'}</span>
                  </td>
                  <td className="table-cell">
                    <div className="flex items-center gap-2">
                      <button onClick={() => open(item)} className="p-1.5 rounded-lg hover:bg-blue-50 text-blue-600 transition-colors"><Edit2 size={14} /></button>
                      <button onClick={() => remove(item._id)} className="p-1.5 rounded-lg hover:bg-red-50 text-red-500 transition-colors"><Trash2 size={14} /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {!items.length && <tr><td colSpan={5} className="text-center py-12 text-gray-400">No jurisdictions found.</td></tr>}
            </tbody>
          </table>
        )}
      </div>

      {modal && (
        <div className="modal-overlay" onClick={close}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[92vh] flex flex-col" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between p-5 border-b border-gray-100 flex-shrink-0">
              <h2 className="font-bold text-gray-900">{editing ? `Edit ${form.country}` : 'Add Jurisdiction'}</h2>
              <button onClick={close} className="text-gray-400 hover:text-gray-700"><X size={20} /></button>
            </div>

            {/* Tab bar */}
            <div className="flex border-b border-gray-100 px-5 flex-shrink-0">
              {tabs.map(t => (
                <button key={t.id} onClick={() => setTab(t.id)}
                  className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${tab === t.id ? 'border-gold-400 text-midnight-500' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                  style={tab === t.id ? { borderBottomColor: '#D4B684', color: '#001B2F' } : {}}>
                  {t.label}
                </button>
              ))}
            </div>

            <form onSubmit={submit} className="flex-1 overflow-y-auto p-5">
              {/* Basic Info Tab */}
              {tab === 'basic' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="label">Country Name *</label>
                      <input className="input-field" value={form.country} onChange={e => setForm(f => ({ ...f, country: e.target.value }))} required placeholder="e.g. Cyprus" />
                    </div>
                    <div>
                      <label className="label">Slug *</label>
                      <input className="input-field font-mono" value={form.slug} onChange={e => setForm(f => ({ ...f, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') }))} required placeholder="e.g. cyprus" />
                    </div>
                    <div className="col-span-2">
                      <label className="label">Tagline</label>
                      <input className="input-field" value={form.tagline} onChange={e => setForm(f => ({ ...f, tagline: e.target.value }))} placeholder="A strategic gateway for international business..." />
                    </div>
                    <div className="col-span-2">
                      <label className="label">Intro Paragraph</label>
                      <textarea className="input-field resize-none" rows={4} value={form.intro} onChange={e => setForm(f => ({ ...f, intro: e.target.value }))} placeholder="Overview of this jurisdiction..." />
                    </div>
                  </div>
                  <div className="border border-gray-200 rounded-xl p-4 bg-amber-50/40">
                    <h3 className="text-sm font-semibold text-gray-700 mb-3">Partner Firm (optional — e.g. for Greece)</h3>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="label">Firm Name</label>
                        <input className="input-field" value={form.partnerFirm?.name || ''} onChange={e => updateField('partnerFirm.name', e.target.value)} placeholder="e.g. Revival Consulting Services" />
                      </div>
                      <div>
                        <label className="label text-transparent select-none">_</label>
                      </div>
                      <div className="col-span-2">
                        <label className="label">Firm Description</label>
                        <textarea className="input-field resize-none" rows={2} value={form.partnerFirm?.description || ''} onChange={e => updateField('partnerFirm.description', e.target.value)} placeholder="Brief description of the partner relationship..." />
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div>
                      <label className="label">Display Order</label>
                      <input type="number" className="input-field w-24" value={form.order} onChange={e => setForm(f => ({ ...f, order: Number(e.target.value) }))} min={0} />
                    </div>
                    <div className="pt-6 flex items-center gap-2">
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" checked={form.active} onChange={e => setForm(f => ({ ...f, active: e.target.checked }))} />
                        <div className="w-10 h-5 bg-gray-200 rounded-full peer peer-checked:after:translate-x-5 after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all" style={form.active ? { backgroundColor: '#D4B684' } : {}} />
                      </label>
                      <span className="text-sm text-gray-600">Active on site</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Strategy Pivot Tab */}
              {tab === 'strategy' && (
                <div className="space-y-4">
                  <div>
                    <label className="label">Section Heading</label>
                    <input className="input-field" value={form.strategyPivot?.heading || ''} onChange={e => updateField('strategyPivot.heading', e.target.value)} />
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="label mb-0">Strategy Points</label>
                      <button type="button" onClick={addPivotPoint} className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1"><PlusCircle size={14} /> Add Point</button>
                    </div>
                    <div className="space-y-3">
                      {(form.strategyPivot?.points || []).map((pt, i) => (
                        <div key={i} className="border border-gray-200 rounded-xl p-4 relative">
                          <button type="button" onClick={() => removePivotPoint(i)} className="absolute top-3 right-3 text-gray-300 hover:text-red-500"><MinusCircle size={16} /></button>
                          <div className="grid grid-cols-2 gap-3 pr-6">
                            <div>
                              <label className="label">Title</label>
                              <input className="input-field" value={pt.title} onChange={e => { const pts = [...form.strategyPivot.points]; pts[i] = { ...pts[i], title: e.target.value }; updateField('strategyPivot.points', pts); }} placeholder="e.g. Low Corporate Tax" />
                            </div>
                            <div className="col-span-2">
                              <label className="label">Description</label>
                              <textarea className="input-field resize-none" rows={2} value={pt.description} onChange={e => { const pts = [...form.strategyPivot.points]; pts[i] = { ...pts[i], description: e.target.value }; updateField('strategyPivot.points', pts); }} placeholder="Explanation of this strategic point..." />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Services Tab */}
              {tab === 'services' && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-sm text-gray-500">Add services offered in this jurisdiction. Each appears as a tab on the jurisdiction page.</p>
                    <button type="button" onClick={addService} className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1 whitespace-nowrap"><PlusCircle size={14} /> Add Service</button>
                  </div>
                  {form.services.map((svc, i) => (
                    <div key={i} className="border border-gray-200 rounded-xl p-4 relative">
                      <button type="button" onClick={() => removeService(i)} className="absolute top-3 right-3 text-gray-300 hover:text-red-500"><MinusCircle size={16} /></button>
                      <div className="grid grid-cols-2 gap-3 pr-6">
                        <div className="col-span-2">
                          <label className="label">Service Title</label>
                          <input className="input-field" value={svc.title} onChange={e => updateService(i, 'title', e.target.value)} placeholder="e.g. Accounting & Financial Structuring" />
                        </div>
                        <div className="col-span-2">
                          <label className="label">Description</label>
                          <textarea className="input-field resize-none" rows={2} value={svc.description} onChange={e => updateService(i, 'description', e.target.value)} placeholder="Description of this service in this jurisdiction..." />
                        </div>
                        <div className="col-span-2">
                          <label className="label">Features (one per line)</label>
                          <textarea className="input-field resize-none font-mono text-xs" rows={3} value={svc.features} onChange={e => updateService(i, 'features', e.target.value)} placeholder={"Statutory financial statements\nRegulatory filings\nVAT compliance"} />
                        </div>
                        <div className="col-span-2">
                          <label className="label">Image URL (optional)</label>
                          <input className="input-field" value={svc.image || ''} onChange={e => updateService(i, 'image', e.target.value)} placeholder="https://..." />
                        </div>
                      </div>
                    </div>
                  ))}
                  {!form.services.length && <div className="text-center py-8 text-gray-400 text-sm">No services added yet. Click "Add Service" above.</div>}
                </div>
              )}

              <div className="flex justify-end gap-3 pt-4 mt-4 border-t border-gray-100">
                <button type="button" className="btn-secondary" onClick={close}>Cancel</button>
                <button type="submit" className="btn-primary" disabled={saving}>
                  {saving ? 'Saving...' : editing ? 'Update Jurisdiction' : 'Create Jurisdiction'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
