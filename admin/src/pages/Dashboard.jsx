import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, Mail, CheckCircle, Briefcase, Plus, Eye, TrendingUp, Clock, Database, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../utils/api';

const StatCard = ({ icon: Icon, label, value, color, bg }) => (
  <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 flex items-center gap-4">
    <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: bg }}>
      <Icon size={22} style={{ color }} />
    </div>
    <div>
      <p className="text-gray-500 text-sm">{label}</p>
      <p className="text-2xl font-bold text-gray-900">{value ?? '—'}</p>
    </div>
  </div>
);

const statusColors = {
  new:         'bg-blue-100 text-blue-700',
  reviewed:    'bg-purple-100 text-purple-700',
  quoted:      'bg-amber-100 text-amber-700',
  in_progress: 'bg-sky-100 text-sky-700',
  won:         'bg-green-100 text-green-700',
  lost:        'bg-red-100 text-red-600',
  archived:    'bg-gray-100 text-gray-500',
};

const STATUS_LABELS = {
  new: 'New', reviewed: 'Reviewed', quoted: 'Quoted',
  in_progress: 'In Progress', won: 'Won', lost: 'Lost', archived: 'Archived',
};

export default function Dashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({ totalArticles: null, newContacts: null, publishedArticles: null, totalServices: null });
  const [recentContacts, setRecentContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [seeding, setSeeding] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [articlesRes, contactsRes, servicesRes] = await Promise.allSettled([
          api.get('/articles/admin/all'),
          api.get('/contact'),
          api.get('/services/admin/all'),
        ]);

        const articles = articlesRes.status === 'fulfilled' ? articlesRes.value.data : [];
        const contacts = contactsRes.status === 'fulfilled' ? contactsRes.value.data : [];
        const services = servicesRes.status === 'fulfilled' ? servicesRes.value.data : [];

        const articleList = Array.isArray(articles) ? articles : articles.articles || [];
        const contactList = Array.isArray(contacts) ? contacts : contacts.contacts || [];
        const serviceList = Array.isArray(services) ? services : services.services || [];

        setStats({
          totalArticles: articleList.length,
          newContacts: contactList.filter((c) => c.status === 'new').length,
          publishedArticles: articleList.filter((a) => a.published).length,
          totalServices: serviceList.length,
        });
        setRecentContacts(contactList.slice(0, 5));
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleSeed = async (force = false) => {
    if (force && !window.confirm('This will REPLACE all existing CMS content with the website defaults. Continue?')) return;
    setSeeding(true);
    try {
      const endpoint = force ? '/seed/force' : '/seed';
      const res = await api.post(endpoint);
      toast.success(res.data.message || 'Content initialised successfully');
      window.location.reload();
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Seed failed');
    } finally {
      setSeeding(false);
    }
  };

  const statCards = [
    { icon: FileText, label: 'Total Articles', value: stats.totalArticles, color: '#001B2F', bg: '#E6EDF3' },
    { icon: Mail, label: 'New Contacts', value: stats.newContacts, color: '#2563EB', bg: '#EFF6FF' },
    { icon: CheckCircle, label: 'Published', value: stats.publishedArticles, color: '#16A34A', bg: '#F0FDF4' },
    { icon: Briefcase, label: 'Services', value: stats.totalServices, color: '#D97706', bg: '#FFFBEB' },
  ];

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {statCards.map((card) => (
          <StatCard key={card.label} {...card} />
        ))}
      </div>

      {/* Seed banner — shown when content is empty */}
      {!loading && stats.totalArticles === 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center">
            <Database size={18} className="text-amber-600" />
          </div>
          <div className="flex-1">
            <p className="font-semibold text-amber-900 text-sm">CMS is empty</p>
            <p className="text-amber-700 text-xs mt-0.5">Initialise with the website's existing content to populate all sections — articles, services, industries, case studies, jurisdictions, metrics, and team.</p>
          </div>
          <button
            onClick={() => handleSeed(false)}
            disabled={seeding}
            className="flex-shrink-0 inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white rounded-lg disabled:opacity-60"
            style={{ backgroundColor: '#001B2F' }}
          >
            <Database size={14} />
            {seeding ? 'Initialising…' : 'Initialise Content'}
          </button>
        </div>
      )}

      {/* Re-seed button for when content already exists */}
      {!loading && stats.totalArticles > 0 && (
        <div className="flex justify-end">
          <button
            onClick={() => handleSeed(true)}
            disabled={seeding}
            className="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-gray-500 border border-gray-200 rounded-lg hover:border-gray-300 disabled:opacity-60"
          >
            <RefreshCw size={12} />
            {seeding ? 'Resetting…' : 'Reset to website defaults'}
          </button>
        </div>
      )}

      {/* Main grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Recent Contacts */}
        <div className="xl:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <div>
              <h2 className="font-semibold text-gray-900">Recent Contacts</h2>
              <p className="text-xs text-gray-400 mt-0.5">Last 5 submissions</p>
            </div>
            <button
              onClick={() => navigate('/contacts')}
              className="text-sm font-medium flex items-center gap-1 transition-colors"
              style={{ color: '#001B2F' }}
            >
              <Eye size={14} /> View all
            </button>
          </div>
          <div className="overflow-x-auto">
            {loading ? (
              <div className="p-8 text-center text-gray-400 text-sm">Loading...</div>
            ) : recentContacts.length === 0 ? (
              <div className="p-8 text-center text-gray-400 text-sm">No contact submissions yet.</div>
            ) : (
              <table className="w-full">
                <thead>
                  <tr className="text-xs text-gray-400 border-b border-gray-100">
                    <th className="text-left px-6 py-3 font-medium">Name</th>
                    <th className="text-left px-6 py-3 font-medium">Email</th>
                    <th className="text-left px-6 py-3 font-medium">Status</th>
                    <th className="text-left px-6 py-3 font-medium">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {recentContacts.map((contact) => (
                    <tr key={contact._id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-3">
                        <p className="text-sm font-medium text-gray-900">{contact.fullName || '—'}</p>
                        <p className="text-xs text-gray-400">{contact.organizationName || ''}</p>
                      </td>
                      <td className="px-6 py-3 text-sm text-gray-500">{contact.email}</td>
                      <td className="px-6 py-3">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[contact.status] || 'bg-gray-100 text-gray-600'}`}>
                          {STATUS_LABELS[contact.status] || contact.status || 'New'}
                        </span>
                      </td>
                      <td className="px-6 py-3 text-sm text-gray-400">
                        {new Date(contact.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Quick Actions + Chart */}
        <div className="space-y-4">
          {/* Quick Actions */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="font-semibold text-gray-900 mb-4">Quick Actions</h2>
            <div className="space-y-2">
              <button
                onClick={() => navigate('/articles')}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-white transition-all"
                style={{ backgroundColor: '#001B2F' }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#002d4f')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#001B2F')}
              >
                <Plus size={16} /> New Article
              </button>
              <button
                onClick={() => navigate('/contacts')}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium border transition-all"
                style={{ borderColor: '#D4B684', color: '#001B2F' }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#FAF5EC')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
              >
                <Mail size={16} /> View Contacts
              </button>
            </div>
          </div>

          {/* Activity chart placeholder */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp size={16} style={{ color: '#D4B684' }} />
              <h2 className="font-semibold text-gray-900">Content Overview</h2>
            </div>
            <div className="space-y-3">
              {[
                { label: 'Published Articles', value: stats.publishedArticles || 0, total: stats.totalArticles || 1, color: '#001B2F' },
                { label: 'New Contacts', value: stats.newContacts || 0, total: Math.max(stats.newContacts || 0, 10), color: '#2563EB' },
                { label: 'Active Services', value: stats.totalServices || 0, total: Math.max(stats.totalServices || 0, 10), color: '#D4B684' },
              ].map((item) => (
                <div key={item.label}>
                  <div className="flex justify-between text-xs text-gray-500 mb-1">
                    <span>{item.label}</span>
                    <span className="font-medium text-gray-700">{item.value}</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <div
                      className="h-2 rounded-full transition-all duration-700"
                      style={{
                        backgroundColor: item.color,
                        width: `${Math.min(100, (item.value / item.total) * 100)}%`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent activity placeholder */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center gap-2 mb-3">
              <Clock size={16} style={{ color: '#D4B684' }} />
              <h2 className="font-semibold text-gray-900">System Info</h2>
            </div>
            <div className="space-y-2 text-sm text-gray-500">
              <div className="flex justify-between">
                <span>Admin Panel</span>
                <span className="text-green-600 font-medium">Online</span>
              </div>
              <div className="flex justify-between">
                <span>API Server</span>
                <span className="text-green-600 font-medium">{process.env.REACT_APP_API_URL || 'localhost:5000'}</span>
              </div>
              <div className="flex justify-between">
                <span>Last login</span>
                <span className="text-gray-700">{new Date().toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
