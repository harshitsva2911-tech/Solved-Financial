import React, { useEffect, useState, useCallback } from 'react';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import toast from 'react-hot-toast';
import { Plus, Edit2, Trash2, X, Star, Eye, EyeOff } from 'lucide-react';
import ImageUpload from '../components/ImageUpload';
import ConfirmModal from '../components/ConfirmModal';
import api from '../utils/api';

const CATEGORIES = ['Cyprus', 'Netherlands', 'CFO & Business Finance'];

const emptyForm = {
  title: '',
  category: 'Cyprus',
  excerpt: '',
  content: '',
  image: '',
  featured: false,
  published: true,
};

export default function Articles() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

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
      category: CATEGORIES.includes(article.category) ? article.category : 'Cyprus',
      excerpt: article.excerpt || '',
      content: article.content || '',
      image: article.image || '',
      featured: !!article.featured,
      published: article.published !== undefined ? !!article.published : true,
    });
    setEditingId(article._id);
    setShowModal(true);
  };

  const promptDelete = (article) => {
    setDeleteTarget({ id: article._id, title: article.title });
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await api.delete(`/articles/${deleteTarget.id}`);
      toast.success('Article deleted');
      setDeleteTarget(null);
      fetchArticles();
    } catch (e) {
      toast.error(e.response?.data?.message || 'Failed to delete article');
    } finally {
      setDeleting(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (imageUploading) {
      toast.error('Please wait for the image upload to finish');
      return;
    }
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
                  <th className="text-left px-6 py-3 font-medium">Image</th>
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
                      {article.image ? (
                        <img
                          src={article.image}
                          alt={article.title}
                          className="w-14 h-10 object-cover rounded-md border border-gray-200 shadow-sm"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                            if (e.currentTarget.nextSibling) {
                              e.currentTarget.nextSibling.style.display = 'flex';
                            }
                          }}
                        />
                      ) : null}
                      <div
                        className={`w-14 h-10 rounded-md bg-gray-100 border border-dashed border-gray-200 items-center justify-center text-[10px] text-gray-400 font-medium ${
                          article.image ? 'hidden' : 'flex'
                        }`}
                      >
                        No image
                      </div>
                    </td>
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
                          onClick={() => promptDelete(article)}
                          className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                          title="Delete article"
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
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="col-span-1 sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Title *</label>
                  <input
                    required
                    value={form.title}
                    onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))}
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
                    onChange={(e) => setForm((prev) => ({ ...prev, category: e.target.value }))}
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none bg-white"
                    onFocus={(e) => (e.target.style.borderColor = '#001B2F')}
                    onBlur={(e) => (e.target.style.borderColor = '#D1D5DB')}
                  >
                    {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>

                <div>
                  <ImageUpload
                    value={form.image}
                    onChange={(url) => setForm((prev) => ({ ...prev, image: url }))}
                    onUploadingChange={setImageUploading}
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
                    onChange={(e) => setForm((prev) => ({ ...prev, excerpt: e.target.value }))}
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
                    onChange={(val) => setForm((prev) => ({ ...prev, content: val }))}
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
                    onClick={() => setForm((prev) => ({ ...prev, featured: !prev.featured }))}
                  >
                    <div className={`w-4 h-4 bg-white rounded-full absolute top-0.5 transition-transform shadow ${form.featured ? 'translate-x-5' : 'translate-x-0.5'}`} />
                  </div>
                  <span className="text-sm text-gray-700 flex items-center gap-1"><Star size={14} /> Featured</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <div
                    className={`w-10 h-5 rounded-full transition-colors relative`}
                    style={{ backgroundColor: form.published ? '#001B2F' : '#E5E7EB' }}
                    onClick={() => setForm((prev) => ({ ...prev, published: !prev.published }))}
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
                  disabled={saving || imageUploading}
                  className="px-5 py-2 text-sm font-medium text-white rounded-lg disabled:opacity-60"
                  style={{ backgroundColor: '#001B2F' }}
                >
                  {imageUploading ? 'Uploading Image...' : saving ? 'Saving...' : editingId ? 'Update Article' : 'Create Article'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={!!deleteTarget}
        onClose={() => !deleting && setDeleteTarget(null)}
        onConfirm={confirmDelete}
        title="Delete Article"
        message={
          <span>
            Are you sure you want to delete <strong className="text-gray-900 font-semibold">{deleteTarget?.title}</strong>? This action cannot be undone.
          </span>
        }
        confirmText="Delete Article"
        confirmVariant="danger"
        loading={deleting}
      />
    </div>
  );
}
