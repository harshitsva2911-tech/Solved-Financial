import React, { useEffect, useState, useCallback } from 'react';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import toast from 'react-hot-toast';
import { Plus, Edit2, Trash2, X, Star, Eye, EyeOff } from 'lucide-react';
import ImageUpload from '../components/ImageUpload';
import api from '../utils/api';

const CATEGORIES = ['Tax', 'Compliance', 'Strategy', 'Insights', 'News', 'Case Study', 'Other'];

const emptyForm = {
  title: '',
  category: 'Insights',
  excerpt: '',
  content: '',
  image: '',
  featured: false,
  published: false,
};

export default function Articles() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const fetchArticles = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get('/articles/admin/all');
      const data = Array.isArray(res.data) ? res.data : res.data.articles || [];
      setArticles(data);
    } catch (e) {
      toast.error('Failed to load articles');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchArticles(); }, [fetchArticles]);

  const openNew = () => {
    setForm(emptyForm);
    setEditingId(null);
    setShowModal(true);
  };

  const openEdit = (article) => {
    setForm({
      title: article.title || '',
      category: article.category || 'Insights',
      excerpt: article.excerpt || '',
      content: article.content || '',
      image: article.image || '',
      featured: !!article.featured,
      published: !!article.published,
    });
    setEditingId(article._id);
    setShowModal(true);
  };

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Delete "${title}"? This cannot be undone.`)) return;
    try {
      await api.delete(`/articles/${id}`);
      toast.success('Article deleted');
      fetchArticles();
    } catch (e) {
      toast.error('Failed to delete article');
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editingId) {
        await api.put(`/articles/${editingId}`, form);
        toast.success('Article updated');
      } else {
        await api.post('/articles', form);
        toast.success('Article created');
      }
      setShowModal(false);
      fetchArticles();
    } catch (e) {
      toast.error(e.response?.data?.message || 'Save failed');
    } finally {
      setSaving(false);
    }
  };

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

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-gray-500 text-sm mt-1">{articles.length} articles total</p>
        </div>
        <button
          onClick={openNew}
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium text-white transition-all"
          style={{ backgroundColor: '#001B2F' }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#002d4f')}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#001B2F')}
        >
          <Plus size={16} /> New Article
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-gray-400">Loading articles...</div>
        ) : articles.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-gray-400 mb-3">No articles yet.</p>
            <button onClick={openNew} className="text-sm font-medium" style={{ color: '#001B2F' }}>Create your first article</button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100 text-xs text-gray-400 uppercase tracking-wide">
                  <th className="text-left px-6 py-3 font-medium">Title</th>
                  <th className="text-left px-6 py-3 font-medium">Category</th>
                  <th className="text-left px-6 py-3 font-medium">Status</th>
                  <th className="text-left px-6 py-3 font-medium">Featured</th>
                  <th className="text-left px-6 py-3 font-medium">Date</th>
                  <th className="text-right px-6 py-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {articles.map((article) => (
                  <tr key={article._id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <p className="text-sm font-medium text-gray-900 max-w-xs truncate">{article.title}</p>
                      {article.excerpt && (
                        <p className="text-xs text-gray-400 mt-0.5 max-w-xs truncate">{article.excerpt}</p>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-700">
                        {article.category}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${article.published ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                        {article.published ? 'Published' : 'Draft'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {article.featured ? (
                        <Star size={15} className="fill-current" style={{ color: '#D4B684' }} />
                      ) : (
                        <Star size={15} className="text-gray-300" />
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-400">
                      {new Date(article.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 justify-end">
                        <button
                          onClick={() => openEdit(article)}
                          className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
                        >
                          <Edit2 size={14} />
                        </button>
                        <button
                          onClick={() => handleDelete(article._id, article.title)}
                          className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
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

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-start justify-center p-4 overflow-y-auto" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl my-8">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h2 className="text-lg font-semibold text-gray-900">
                {editingId ? 'Edit Article' : 'New Article'}
              </h2>
              <button onClick={() => setShowModal(false)} className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Title *</label>
                  <input
                    required
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none"
                    onFocus={(e) => (e.target.style.borderColor = '#001B2F')}
                    onBlur={(e) => (e.target.style.borderColor = '#D1D5DB')}
                    placeholder="Article title..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Category</label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none bg-white"
                    onFocus={(e) => (e.target.style.borderColor = '#001B2F')}
                    onBlur={(e) => (e.target.style.borderColor = '#D1D5DB')}
                  >
                    {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
                  </select>
                </div>

                <div>
                  <ImageUpload
                    value={form.image}
                    onChange={(url) => setForm({ ...form, image: url })}
                    label="Article Image"
                    hint="1200 × 630 px"
                    aspectHint="16:9"
                  />
                </div>

                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Excerpt</label>
                  <textarea
                    rows={2}
                    value={form.excerpt}
                    onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none resize-none"
                    onFocus={(e) => (e.target.style.borderColor = '#001B2F')}
                    onBlur={(e) => (e.target.style.borderColor = '#D1D5DB')}
                    placeholder="Short summary..."
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Content</label>
                <div className="border border-gray-300 rounded-lg overflow-hidden">
                  <ReactQuill
                    value={form.content}
                    onChange={(val) => setForm({ ...form, content: val })}
                    modules={quillModules}
                    style={{ minHeight: '200px' }}
                  />
                </div>
              </div>

              <div className="flex items-center gap-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <div
                    className={`w-10 h-5 rounded-full transition-colors relative ${form.featured ? '' : 'bg-gray-200'}`}
                    style={{ backgroundColor: form.featured ? '#D4B684' : '' }}
                    onClick={() => setForm({ ...form, featured: !form.featured })}
                  >
                    <div className={`w-4 h-4 bg-white rounded-full absolute top-0.5 transition-transform shadow ${form.featured ? 'translate-x-5' : 'translate-x-0.5'}`} />
                  </div>
                  <span className="text-sm text-gray-700 flex items-center gap-1"><Star size={14} /> Featured</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <div
                    className={`w-10 h-5 rounded-full transition-colors relative`}
                    style={{ backgroundColor: form.published ? '#001B2F' : '#E5E7EB' }}
                    onClick={() => setForm({ ...form, published: !form.published })}
                  >
                    <div className={`w-4 h-4 bg-white rounded-full absolute top-0.5 transition-transform shadow ${form.published ? 'translate-x-5' : 'translate-x-0.5'}`} />
                  </div>
                  <span className="text-sm text-gray-700 flex items-center gap-1">
                    {form.published ? <Eye size={14} /> : <EyeOff size={14} />}
                    {form.published ? 'Published' : 'Draft'}
                  </span>
                </label>
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
                  {saving ? 'Saving...' : editingId ? 'Update Article' : 'Create Article'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
