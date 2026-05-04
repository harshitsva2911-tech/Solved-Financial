import React, { useEffect, useState, useCallback } from 'react';
import toast from 'react-hot-toast';
import { X, Mail, Building2, Globe, User, Calendar, Phone, Briefcase, FileText, Download, Trash2, MessageSquare } from 'lucide-react';
import api from '../utils/api';

const STATUS_CONFIG = {
  new:         { label: 'New',         classes: 'bg-blue-100 text-blue-700',    dot: 'bg-blue-500' },
  reviewed:    { label: 'Reviewed',    classes: 'bg-purple-100 text-purple-700', dot: 'bg-purple-500' },
  quoted:      { label: 'Quoted',      classes: 'bg-amber-100 text-amber-700',  dot: 'bg-amber-500' },
  in_progress: { label: 'In Progress', classes: 'bg-sky-100 text-sky-700',      dot: 'bg-sky-500' },
  won:         { label: 'Won',         classes: 'bg-green-100 text-green-700',  dot: 'bg-green-500' },
  lost:        { label: 'Lost',        classes: 'bg-red-100 text-red-600',      dot: 'bg-red-500' },
  archived:    { label: 'Archived',    classes: 'bg-gray-100 text-gray-500',    dot: 'bg-gray-400' },
};

const TABS = ['all', 'new', 'reviewed', 'quoted', 'in_progress', 'won', 'lost', 'archived'];

const TAB_LABELS = {
  all: 'All', new: 'New', reviewed: 'Reviewed', quoted: 'Quoted',
  in_progress: 'In Progress', won: 'Won', lost: 'Lost', archived: 'Archived',
};

const STATS_CARDS = [
  { key: 'all',         label: 'Total',       color: '#001B2F' },
  { key: 'new',         label: 'New',         color: '#2563EB' },
  { key: 'quoted',      label: 'Quoted',      color: '#D97706' },
  { key: 'in_progress', label: 'In Progress', color: '#0284C7' },
  { key: 'won',         label: 'Won',         color: '#16A34A' },
  { key: 'lost',        label: 'Lost',        color: '#DC2626' },
];

function StatusBadge({ status }) {
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.new;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${cfg.classes}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
      {cfg.label}
    </span>
  );
}

export default function Contacts() {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const [selected, setSelected] = useState(null);
  const [notes, setNotes] = useState('');
  const [saving, setSaving] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [search, setSearch] = useState('');

  const fetchContacts = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get('/contact');
      const data = Array.isArray(res.data) ? res.data : res.data.contacts || [];
      setContacts(data);
    } catch {
      toast.error('Failed to load contacts');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchContacts(); }, [fetchContacts]);

  const openContact = (contact) => {
    setSelected(contact);
    setNotes(contact.notes || '');
    // Auto-mark as reviewed when opened if still 'new'
    if (contact.status === 'new') {
      handleUpdate(contact._id, { status: 'reviewed' }, false);
    }
  };

  const handleUpdate = async (id, updates, showToast = true) => {
    setSaving(true);
    try {
      await api.put(`/contact/${id}`, updates);
      if (showToast) toast.success('Updated');
      setContacts((prev) => prev.map((c) => c._id === id ? { ...c, ...updates } : c));
      if (selected?._id === id) setSelected((prev) => ({ ...prev, ...updates }));
    } catch {
      if (showToast) toast.error('Update failed');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this inquiry? This cannot be undone.')) return;
    setDeleting(true);
    try {
      await api.delete(`/contact/${id}`);
      toast.success('Inquiry deleted');
      setContacts((prev) => prev.filter((c) => c._id !== id));
      if (selected?._id === id) setSelected(null);
    } catch {
      toast.error('Delete failed');
    } finally {
      setDeleting(false);
    }
  };

  const handleExport = async () => {
    setExporting(true);
    try {
      const params = activeTab !== 'all' ? `?status=${activeTab}` : '';
      const res = await api.get(`/contact/export${params}`, { responseType: 'blob' });
      const url = URL.createObjectURL(new Blob([res.data], { type: 'text/csv' }));
      const a = document.createElement('a');
      a.href = url;
      a.download = `inquiries${activeTab !== 'all' ? `-${activeTab}` : ''}.csv`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success('Export downloaded');
    } catch {
      toast.error('Export failed');
    } finally {
      setExporting(false);
    }
  };

  const counts = TABS.reduce((acc, tab) => {
    acc[tab] = tab === 'all' ? contacts.length : contacts.filter((c) => c.status === tab).length;
    return acc;
  }, {});

  const filtered = (activeTab === 'all' ? contacts : contacts.filter((c) => c.status === activeTab))
    .filter((c) => {
      if (!search) return true;
      const q = search.toLowerCase();
      return (
        (c.fullName || '').toLowerCase().includes(q) ||
        (c.email || '').toLowerCase().includes(q) ||
        (c.organizationName || '').toLowerCase().includes(q) ||
        (c.jurisdiction || '').toLowerCase().includes(q)
      );
    });

  return (
    <div>
      {/* Stats cards */}
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-3 mb-6">
        {STATS_CARDS.map((s) => (
          <div
            key={s.key}
            onClick={() => setActiveTab(s.key)}
            className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 cursor-pointer hover:shadow-md transition-shadow"
          >
            <p className="text-xs text-gray-400 mb-1">{s.label}</p>
            <p className="text-2xl font-bold" style={{ color: s.color }}>{counts[s.key]}</p>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <input
          type="text"
          placeholder="Search by name, email, organisation..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-gray-400 bg-white"
        />
        <button
          onClick={handleExport}
          disabled={exporting}
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white rounded-lg disabled:opacity-60 whitespace-nowrap"
          style={{ backgroundColor: '#001B2F' }}
        >
          <Download size={15} />
          {exporting ? 'Exporting…' : `Export CSV${activeTab !== 'all' ? ` (${TAB_LABELS[activeTab]})` : ''}`}
        </button>
      </div>

      {/* Filter tabs */}
      <div className="flex flex-wrap gap-1 mb-4 bg-gray-100 p-1 rounded-xl w-fit max-w-full">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeTab === tab ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {TAB_LABELS[tab]}
            {counts[tab] > 0 && (
              <span className="ml-1 opacity-60">({counts[tab]})</span>
            )}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-gray-400">Loading inquiries…</div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center text-gray-400">No inquiries found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100 text-xs text-gray-400 uppercase tracking-wide bg-gray-50">
                  <th className="text-left px-5 py-3 font-medium">Name</th>
                  <th className="text-left px-5 py-3 font-medium">Organisation</th>
                  <th className="text-left px-5 py-3 font-medium">Jurisdiction</th>
                  <th className="text-left px-5 py-3 font-medium">Status</th>
                  <th className="text-left px-5 py-3 font-medium">Submitted</th>
                  <th className="text-right px-5 py-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((contact) => (
                  <tr
                    key={contact._id}
                    className="border-b border-gray-50 hover:bg-gray-50 transition-colors cursor-pointer"
                    onClick={() => openContact(contact)}
                  >
                    <td className="px-5 py-4">
                      <p className="text-sm font-medium text-gray-900">{contact.fullName || '—'}</p>
                      <p className="text-xs text-gray-400">{contact.email}</p>
                    </td>
                    <td className="px-5 py-4">
                      <p className="text-sm text-gray-600">{contact.organizationName || '—'}</p>
                      {contact.executiveRole && (
                        <p className="text-xs text-gray-400">{contact.executiveRole}</p>
                      )}
                    </td>
                    <td className="px-5 py-4 text-sm text-gray-500">{contact.jurisdiction || '—'}</td>
                    <td className="px-5 py-4">
                      <StatusBadge status={contact.status} />
                    </td>
                    <td className="px-5 py-4 text-sm text-gray-400 whitespace-nowrap">
                      {new Date(contact.createdAt).toLocaleDateString('en-GB', {
                        day: '2-digit', month: 'short', year: 'numeric'
                      })}
                    </td>
                    <td className="px-5 py-4 text-right" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-2">
                        <select
                          value={contact.status || 'new'}
                          onChange={(e) => handleUpdate(contact._id, { status: e.target.value })}
                          className="text-xs border border-gray-200 rounded-lg px-2 py-1.5 bg-white focus:outline-none focus:border-gray-400"
                        >
                          {Object.entries(STATUS_CONFIG).map(([val, cfg]) => (
                            <option key={val} value={val}>{cfg.label}</option>
                          ))}
                        </select>
                        <button
                          onClick={() => handleDelete(contact._id)}
                          className="p-1.5 text-gray-400 hover:text-red-500 transition-colors rounded"
                          title="Delete"
                        >
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

      {/* Detail side panel */}
      {selected && (
        <div
          className="fixed inset-0 z-50 flex justify-end"
          style={{ backgroundColor: 'rgba(0,0,0,0.35)' }}
          onClick={() => setSelected(null)}
        >
          <div
            className="bg-white w-full max-w-lg h-full overflow-y-auto shadow-2xl flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Panel header */}
            <div className="flex items-start justify-between px-6 py-5 border-b border-gray-100 flex-shrink-0" style={{ backgroundColor: '#001B2F' }}>
              <div>
                <h2 className="text-white font-semibold text-base">{selected.fullName}</h2>
                <p className="text-sm mt-0.5" style={{ color: '#D4B684' }}>{selected.email}</p>
                <div className="mt-2">
                  <StatusBadge status={selected.status} />
                </div>
              </div>
              <button onClick={() => setSelected(null)} className="text-white opacity-60 hover:opacity-100 mt-1">
                <X size={20} />
              </button>
            </div>

            <div className="p-6 flex-1 space-y-6">

              {/* Inquiry Details */}
              {selected.inquiryDetails && (
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <MessageSquare size={14} className="text-gray-400" />
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Inquiry Details</p>
                  </div>
                  <p className="text-sm text-gray-700 bg-amber-50 border border-amber-100 rounded-lg p-4 leading-relaxed">
                    {selected.inquiryDetails}
                  </p>
                </div>
              )}

              {/* Contact Info */}
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Contact Information</p>
                <div className="space-y-3">
                  {[
                    { icon: User,      label: 'Full Name',       value: selected.fullName },
                    { icon: Mail,      label: 'Email',           value: selected.email },
                    { icon: Phone,     label: 'Phone',           value: selected.phoneNumber },
                    { icon: Building2, label: 'Organisation',    value: selected.organizationName },
                    { icon: Briefcase, label: 'Executive Role',  value: selected.executiveRole },
                    { icon: Globe,     label: 'Jurisdiction',    value: selected.jurisdiction },
                    { icon: Calendar,  label: 'Submitted',       value: selected.createdAt ? new Date(selected.createdAt).toLocaleString('en-GB', { dateStyle: 'long', timeStyle: 'short' }) : null },
                  ].map(({ icon: Icon, label, value }) =>
                    value ? (
                      <div key={label} className="flex items-start gap-3">
                        <div className="flex-shrink-0 w-7 h-7 rounded-lg bg-gray-100 flex items-center justify-center mt-0.5">
                          <Icon size={13} className="text-gray-500" />
                        </div>
                        <div>
                          <p className="text-xs text-gray-400">{label}</p>
                          <p className="text-sm text-gray-800 font-medium">{value}</p>
                        </div>
                      </div>
                    ) : null
                  )}
                </div>
              </div>

              {/* Status update */}
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                  Update Status
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {Object.entries(STATUS_CONFIG).map(([val, cfg]) => (
                    <button
                      key={val}
                      onClick={() => handleUpdate(selected._id, { status: val })}
                      className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-xs font-medium transition-all ${
                        selected.status === val
                          ? `${cfg.classes} border-current`
                          : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300'
                      }`}
                    >
                      <span className={`w-2 h-2 rounded-full ${cfg.dot}`} />
                      {cfg.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                  <FileText size={12} className="inline mr-1" />
                  Internal Notes
                </label>
                <textarea
                  rows={4}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-gray-400 resize-none"
                  placeholder="Add private notes about this inquiry…"
                />
                <div className="flex gap-2 mt-2">
                  <button
                    onClick={() => handleUpdate(selected._id, { notes })}
                    disabled={saving}
                    className="flex-1 px-4 py-2 text-sm font-medium text-white rounded-lg disabled:opacity-60"
                    style={{ backgroundColor: '#001B2F' }}
                  >
                    {saving ? 'Saving…' : 'Save Notes'}
                  </button>
                  <button
                    onClick={() => handleDelete(selected._id)}
                    disabled={deleting}
                    className="px-4 py-2 text-sm font-medium text-red-600 border border-red-200 rounded-lg hover:bg-red-50 disabled:opacity-60"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
