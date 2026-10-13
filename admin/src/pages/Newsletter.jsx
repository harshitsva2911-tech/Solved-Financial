import React, { useEffect, useState, useCallback } from 'react';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import toast from 'react-hot-toast';
import { Plus, Edit2, Trash2, X, Send, Users, Download, Mail, MailX } from 'lucide-react';
import ConfirmModal from '../components/ConfirmModal';
import api from '../utils/api';

const emptyForm = { subject: '', content: '' };

const quillModules = {
  toolbar: [
    [{ header: [1, 2, 3, false] }],
    ['bold', 'italic', 'underline', 'strike'],
    [{ list: 'ordered' }, { list: 'bullet' }],
    ['blockquote', 'code-block'],
    ['link', 'image'],
    ['clean'],
  ],
};

function StatCard({ icon: Icon, label, value }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 flex items-center gap-4">
      <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#D4B68420' }}>
        <Icon size={18} style={{ color: '#D4B684' }} />
      </div>
      <div>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
        <p className="text-xs text-gray-500">{label}</p>
      </div>
    </div>
  );
}

export default function Newsletter() {
  const [tab, setTab] = useState('campaigns');

  // Campaigns state
  const [newsletters, setNewsletters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [sendingId, setSendingId] = useState(null);
  const [deleteCampaignTarget, setDeleteCampaignTarget] = useState(null);
  const [deletingCampaign, setDeletingCampaign] = useState(false);
  const [sendCampaignTarget, setSendCampaignTarget] = useState(null);
  const [sendingCampaign, setSendingCampaign] = useState(false);
  const [deleteSubscriberTarget, setDeleteSubscriberTarget] = useState(null);
  const [deletingSubscriber, setDeletingSubscriber] = useState(false);

  // Subscribers state
  const [subscribers, setSubscribers] = useState([]);
  const [stats, setStats] = useState({ total: 0, active: 0, unsubscribed: 0 });
  const [subsLoading, setSubsLoading] = useState(true);

  const fetchNewsletters = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get('/newsletter');
      setNewsletters(Array.isArray(res.data) ? res.data : []);
    } catch (e) {
      toast.error('Failed to load newsletters');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchSubscribers = useCallback(async () => {
    setSubsLoading(true);
    try {
      const [subsRes, statsRes] = await Promise.all([
        api.get('/newsletter/subscribers'),
        api.get('/newsletter/subscribers/stats'),
      ]);
      setSubscribers(Array.isArray(subsRes.data) ? subsRes.data : []);
      setStats(statsRes.data || { total: 0, active: 0, unsubscribed: 0 });
    } catch (e) {
      toast.error('Failed to load subscribers');
    } finally {
      setSubsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNewsletters();
    fetchSubscribers();
  }, [fetchNewsletters, fetchSubscribers]);

  const openNew = () => {
    setForm(emptyForm);
    setEditingId(null);
    setShowModal(true);
  };

  const openEdit = (n) => {
    setForm({ subject: n.subject || '', content: n.content || '' });
    setEditingId(n._id);
    setShowModal(true);
  };

  const promptDeleteCampaign = (n) => {
    setDeleteCampaignTarget({ id: n._id, subject: n.subject });
  };

  const confirmDeleteCampaign = async () => {
    if (!deleteCampaignTarget) return;
    setDeletingCampaign(true);
    try {
      await api.delete(`/newsletter/${deleteCampaignTarget.id}`);
      toast.success('Newsletter deleted');
      setDeleteCampaignTarget(null);
      fetchNewsletters();
    } catch (e) {
      toast.error(e.response?.data?.message || 'Failed to delete newsletter');
    } finally {
      setDeletingCampaign(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.subject.trim() || !form.content.trim()) {
      toast.error('Subject and content are required');
      return;
    }
    setSaving(true);
    try {
      if (editingId) {
        await api.put(`/newsletter/${editingId}`, form);
        toast.success('Newsletter updated');
      } else {
        await api.post('/newsletter', form);
        toast.success('Newsletter draft created');
      }
      setShowModal(false);
      fetchNewsletters();
    } catch (e) {
      toast.error(e.response?.data?.message || 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  const promptSendCampaign = (n) => {
    setSendCampaignTarget(n);
  };

  const confirmSendCampaign = async () => {
    if (!sendCampaignTarget) return;
    setSendingCampaign(true);
    setSendingId(sendCampaignTarget._id);
    try {
      const res = await api.post(`/newsletter/${sendCampaignTarget._id}/send`);
      toast.success(res.data?.message || 'Newsletter sent successfully');
      setSendCampaignTarget(null);
      fetchNewsletters();
      fetchSubscribers();
    } catch (e) {
      toast.error(e.response?.data?.message || 'Failed to send newsletter');
    } finally {
      setSendingCampaign(false);
      setSendingId(null);
    }
  };

  const promptDeleteSubscriber = (s) => {
    setDeleteSubscriberTarget({ id: s._id, email: s.email });
  };

  const confirmDeleteSubscriber = async () => {
    if (!deleteSubscriberTarget) return;
    setDeletingSubscriber(true);
    try {
      await api.delete(`/newsletter/subscribers/${deleteSubscriberTarget.id}`);
      toast.success('Subscriber removed');
      setDeleteSubscriberTarget(null);
      fetchSubscribers();
    } catch (e) {
      toast.error(e.response?.data?.message || 'Failed to remove subscriber');
    } finally {
      setDeletingSubscriber(false);
    }
  };

  const handleExport = () => {
    const base = api.defaults.baseURL;
    const token = localStorage.getItem('adminToken');
    fetch(`${base}/newsletter/subscribers/export`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.blob())
      .then((blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'subscribers.csv';
        a.click();
        window.URL.revokeObjectURL(url);
      })
      .catch(() => toast.error('Export failed'));
  };

  const statusBadge = (n) => {
    if (n.status === 'sent' && n.recipientCount === 0 && n.failedCount > 0) {
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-700">
          failed
        </span>
      );
    }
    const styles = {
      draft: 'bg-yellow-100 text-yellow-700',
      sending: 'bg-blue-100 text-blue-700',
      sent: 'bg-green-100 text-green-700',
    };
    return (
      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${styles[n.status] || 'bg-gray-100 text-gray-700'}`}>
        {n.status}
      </span>
    );
  };

  return (
    <div>
      {/* Tabs */}
      <div className="flex items-center gap-2 mb-6 border-b border-gray-200">
        {[
          { id: 'campaigns', label: 'Campaigns' },
          { id: 'subscribers', label: 'Subscribers' },
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className="px-4 py-2.5 text-sm font-medium border-b-2 -mb-px transition-colors"
            style={
              tab === t.id
                ? { borderColor: '#D4B684', color: '#001B2F' }
                : { borderColor: 'transparent', color: '#9CA3AF' }
            }
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'campaigns' && (
        <div>

          <div className="flex items-center justify-between mb-6">
            <p className="text-gray-500 text-sm">{newsletters.length} campaigns total</p>
            <button
              onClick={openNew}
              className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium text-white transition-all"
              style={{ backgroundColor: '#001B2F' }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#002d4f')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#001B2F')}
            >
              <Plus size={16} /> New Newsletter
            </button>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            {loading ? (
              <div className="p-12 text-center text-gray-400">Loading campaigns...</div>
            ) : newsletters.length === 0 ? (
              <div className="p-12 text-center">
                <p className="text-gray-400 mb-3">No newsletters yet.</p>
                <button onClick={openNew} className="text-sm font-medium" style={{ color: '#001B2F' }}>
                  Create your first newsletter
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-100 text-xs text-gray-400 uppercase tracking-wide">
                      <th className="text-left px-6 py-3 font-medium">Subject</th>
                      <th className="text-left px-6 py-3 font-medium">Status</th>
                      <th className="text-left px-6 py-3 font-medium">Recipients</th>
                      <th className="text-left px-6 py-3 font-medium">Date</th>
                      <th className="text-right px-6 py-3 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {newsletters.map((n) => (
                      <tr key={n._id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4">
                          <p className="text-sm font-medium text-gray-900 max-w-sm truncate">{n.subject}</p>
                        </td>
                        <td className="px-6 py-4">{statusBadge(n)}</td>
                        <td className="px-6 py-4 text-sm text-gray-500">
                          {n.status === 'sent' ? `${n.recipientCount} sent${n.failedCount ? `, ${n.failedCount} failed` : ''}` : '—'}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-400">
                          {new Date(n.sentAt || n.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2 justify-end">
                            {(n.status === 'draft' || (n.recipientCount === 0 && n.failedCount > 0)) && (
                              <button
                                onClick={() => promptSendCampaign(n)}
                                disabled={sendingId === n._id}
                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-white disabled:opacity-60"
                                style={{ backgroundColor: '#D4B684', color: '#001B2F' }}
                              >
                                <Send size={13} />
                                {sendingId === n._id
                                  ? 'Sending...'
                                  : n.recipientCount === 0 && n.failedCount > 0
                                  ? 'Retry Send'
                                  : 'Send'}
                              </button>
                            )}
                            {(n.status !== 'sent' || (n.recipientCount === 0 && n.failedCount > 0)) && (
                              <button
                                onClick={() => openEdit(n)}
                                className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
                              >
                                <Edit2 size={14} />
                              </button>
                            )}
                            <button
                              onClick={() => promptDeleteCampaign(n)}
                              className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                              title="Delete newsletter"
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
        </div>
      )}

      {tab === 'subscribers' && (
        <div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <StatCard icon={Users} label="Total subscribers" value={stats.total} />
            <StatCard icon={Mail} label="Active" value={stats.active} />
            <StatCard icon={MailX} label="Unsubscribed" value={stats.unsubscribed} />
          </div>

          <div className="flex items-center justify-between mb-4">
            <p className="text-gray-500 text-sm">{subscribers.length} subscribers total</p>
            <button
              onClick={handleExport}
              className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium border border-gray-300 text-gray-700 hover:bg-gray-50 transition-all"
            >
              <Download size={15} /> Export CSV
            </button>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            {subsLoading ? (
              <div className="p-12 text-center text-gray-400">Loading subscribers...</div>
            ) : subscribers.length === 0 ? (
              <div className="p-12 text-center text-gray-400">No subscribers yet.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-100 text-xs text-gray-400 uppercase tracking-wide">
                      <th className="text-left px-6 py-3 font-medium">Email</th>
                      <th className="text-left px-6 py-3 font-medium">Status</th>
                      <th className="text-left px-6 py-3 font-medium">Subscribed</th>
                      <th className="text-right px-6 py-3 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {subscribers.map((s) => (
                      <tr key={s._id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 text-sm text-gray-900 max-w-[220px] truncate">{s.email}</td>
                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                              s.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                            }`}
                          >
                            {s.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-400">
                          {new Date(s.subscribedAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-end">
                            <button
                              onClick={() => promptDeleteSubscriber(s)}
                              className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                              title="Remove subscriber"
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
        </div>
      )}

      {/* Compose modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-start justify-center p-4 overflow-y-auto" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl my-8">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h2 className="text-lg font-semibold text-gray-900">
                {editingId ? 'Edit Newsletter' : 'New Newsletter'}
              </h2>
              <button onClick={() => setShowModal(false)} className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Subject *</label>
                <input
                  required
                  value={form.subject}
                  onChange={(e) => setForm({ ...form, subject: e.target.value })}
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none"
                  onFocus={(e) => (e.target.style.borderColor = '#001B2F')}
                  onBlur={(e) => (e.target.style.borderColor = '#D1D5DB')}
                  placeholder="e.g. Q3 Regulatory Update"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Content</label>
                <div className="border border-gray-300 rounded-lg overflow-hidden">
                  <ReactQuill
                    value={form.content}
                    onChange={(val) => setForm({ ...form, content: val })}
                    modules={quillModules}
                    style={{ minHeight: '220px' }}
                  />
                </div>
                <p className="text-xs text-gray-400 mt-2">
                  An unsubscribe link is automatically appended to every newsletter sent.
                </p>
              </div>

              <div className="flex justify-end gap-3 pt-2 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 text-sm font-medium text-white rounded-lg disabled:opacity-60"
                  style={{ backgroundColor: '#001B2F' }}
                >
                  {saving ? 'Saving...' : editingId ? 'Update Draft' : 'Save Draft'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Campaign Modal */}
      <ConfirmModal
        isOpen={!!deleteCampaignTarget}
        onClose={() => !deletingCampaign && setDeleteCampaignTarget(null)}
        onConfirm={confirmDeleteCampaign}
        title="Delete Newsletter Campaign"
        message={
          <span>
            Are you sure you want to delete <strong className="text-gray-900 font-semibold">{deleteCampaignTarget?.subject}</strong>? This action cannot be undone.
          </span>
        }
        confirmText="Delete Campaign"
        confirmVariant="danger"
        loading={deletingCampaign}
      />

      {/* Send Campaign Modal */}
      <ConfirmModal
        isOpen={!!sendCampaignTarget}
        onClose={() => !sendingCampaign && setSendCampaignTarget(null)}
        onConfirm={confirmSendCampaign}
        title="Send Newsletter Campaign"
        icon={Send}
        message={
          <div className="space-y-2">
            <p>
              Are you sure you want to send <strong className="text-gray-900 font-semibold">"{sendCampaignTarget?.subject}"</strong> to <strong className="text-gray-900 font-semibold">{stats.active}</strong> active subscriber{stats.active === 1 ? '' : 's'}?
            </p>
            <p className="text-xs text-gray-500">
              This campaign will be delivered to subscriber inboxes immediately and cannot be undone.
            </p>
          </div>
        }
        confirmText="Send Campaign"
        confirmVariant="gold"
        loading={sendingCampaign}
      />

      {/* Delete Subscriber Modal */}
      <ConfirmModal
        isOpen={!!deleteSubscriberTarget}
        onClose={() => !deletingSubscriber && setDeleteSubscriberTarget(null)}
        onConfirm={confirmDeleteSubscriber}
        title="Remove Subscriber"
        message={
          <span>
            Remove <strong className="text-gray-900 font-semibold">{deleteSubscriberTarget?.email}</strong> from active subscribers?
          </span>
        }
        confirmText="Remove Subscriber"
        confirmVariant="danger"
        loading={deletingSubscriber}
      />
    </div>
  );
}
