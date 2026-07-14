import React, { useState, useEffect, useCallback, useRef } from 'react';
import toast from 'react-hot-toast';
import { Upload, Trash2, Download, FileText, File, X, Loader2 } from 'lucide-react';
import api from '../utils/api';

const MIME_ICONS = {
  'application/pdf': { icon: FileText, color: '#DC2626', label: 'PDF' },
  'application/msword': { icon: File, color: '#2563EB', label: 'DOC' },
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': { icon: File, color: '#2563EB', label: 'DOCX' },
  'application/vnd.ms-excel': { icon: File, color: '#16A34A', label: 'XLS' },
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': { icon: File, color: '#16A34A', label: 'XLSX' },
  'application/vnd.ms-powerpoint': { icon: File, color: '#D97706', label: 'PPT' },
  'application/vnd.openxmlformats-officedocument.presentationml.presentation': { icon: File, color: '#D97706', label: 'PPTX' },
};

function formatSize(bytes) {
  if (!bytes) return '—';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function FileIcon({ mimeType }) {
  const info = MIME_ICONS[mimeType] || { icon: File, color: '#6B7280', label: 'FILE' };
  const Icon = info.icon;
  return (
    <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${info.color}15` }}>
      <Icon size={18} style={{ color: info.color }} />
    </div>
  );
}

export default function Documents() {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [showUpload, setShowUpload] = useState(false);
  const [form, setForm] = useState({ name: '', description: '' });
  const [file, setFile] = useState(null);
  const fileRef = useRef();

  const fetchDocs = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get('/documents');
      setDocuments(Array.isArray(res.data) ? res.data : []);
    } catch {
      toast.error('Failed to load documents');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchDocs(); }, [fetchDocs]);

  const handleFileChange = (e) => {
    const f = e.target.files[0];
    if (!f) return;
    setFile(f);
    if (!form.name) setForm((prev) => ({ ...prev, name: f.name.replace(/\.[^/.]+$/, '') }));
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return toast.error('Please select a file');
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append('file', file);
      fd.append('name', form.name || file.name);
      fd.append('description', form.description);
      const res = await api.post('/documents', fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setDocuments((prev) => [res.data, ...prev]);
      toast.success('Document uploaded');
      setShowUpload(false);
      setForm({ name: '', description: '' });
      setFile(null);
      if (fileRef.current) fileRef.current.value = '';
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this document? This cannot be undone.')) return;
    try {
      await api.delete(`/documents/${id}`);
      setDocuments((prev) => prev.filter((d) => d._id !== id));
      toast.success('Deleted');
    } catch {
      toast.error('Delete failed');
    }
  };

  return (
    <div>
      {/* Header actions */}
      <div className="flex items-center justify-between mb-6">
        <p className="text-sm text-gray-500">
          {documents.length} document{documents.length !== 1 ? 's' : ''} uploaded
        </p>
        <button
          onClick={() => setShowUpload(true)}
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white rounded-lg transition-all"
          style={{ backgroundColor: '#001B2F' }}
        >
          <Upload size={15} />
          Upload Document
        </button>
      </div>

      {/* Upload modal */}
      {showUpload && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{ backgroundColor: 'rgba(0,0,0,0.4)' }}
          onClick={() => setShowUpload(false)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100" style={{ backgroundColor: '#001B2F' }}>
              <h2 className="text-white font-semibold">Upload Document</h2>
              <button onClick={() => setShowUpload(false)} className="text-white opacity-60 hover:opacity-100">
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleUpload} className="p-6 space-y-4">
              {/* File picker */}
              <div
                className="border-2 border-dashed border-gray-200 rounded-xl p-6 text-center cursor-pointer hover:border-gray-400 transition-colors"
                onClick={() => fileRef.current?.click()}
              >
                {file ? (
                  <div className="flex items-center justify-center gap-3">
                    <FileText size={24} className="text-gray-400" />
                    <div className="text-left">
                      <p className="text-sm font-medium text-gray-700">{file.name}</p>
                      <p className="text-xs text-gray-400">{formatSize(file.size)}</p>
                    </div>
                  </div>
                ) : (
                  <>
                    <Upload size={24} className="text-gray-300 mx-auto mb-2" />
                    <p className="text-sm text-gray-500">Click to select a file</p>
                    <p className="text-xs text-gray-400 mt-1">PDF, Word, Excel, PowerPoint — max 20 MB</p>
                  </>
                )}
              </div>
              <input
                ref={fileRef}
                type="file"
                accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx"
                className="hidden"
                onChange={handleFileChange}
              />

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Document Name</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-gray-400"
                  placeholder="e.g. Annual Report 2024"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description <span className="text-gray-400 font-normal">(optional)</span></label>
                <input
                  type="text"
                  value={form.description}
                  onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-gray-400"
                  placeholder="Brief description of this document"
                />
              </div>

              <button
                type="submit"
                disabled={uploading || !file}
                className="w-full flex items-center justify-center gap-2 py-2.5 text-sm font-medium text-white rounded-lg disabled:opacity-60"
                style={{ backgroundColor: '#001B2F' }}
              >
                {uploading ? <><Loader2 size={15} className="animate-spin" /> Uploading…</> : <><Upload size={15} /> Upload</>}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Document list */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-gray-400">Loading documents…</div>
        ) : documents.length === 0 ? (
          <div className="p-12 text-center">
            <FileText size={36} className="text-gray-200 mx-auto mb-3" />
            <p className="text-gray-400 text-sm">No documents uploaded yet.</p>
            <button
              onClick={() => setShowUpload(true)}
              className="mt-4 text-sm font-medium underline"
              style={{ color: '#001B2F' }}
            >
              Upload your first document
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50 text-xs text-gray-400 uppercase tracking-wide">
                <th className="text-left px-6 py-3 font-medium">Document</th>
                <th className="text-left px-6 py-3 font-medium">Type</th>
                <th className="text-left px-6 py-3 font-medium">Size</th>
                <th className="text-left px-6 py-3 font-medium">Uploaded</th>
                <th className="text-right px-6 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {documents.map((doc) => {
                const info = MIME_ICONS[doc.mimeType] || { label: 'FILE' };
                return (
                  <tr key={doc._id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <FileIcon mimeType={doc.mimeType} />
                        <div>
                          <p className="text-sm font-medium text-gray-900 max-w-xs truncate">{doc.name}</p>
                          {doc.description && (
                            <p className="text-xs text-gray-400 max-w-xs truncate">{doc.description}</p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-600">
                        {info.label}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-400">{formatSize(doc.fileSize)}</td>
                    <td className="px-6 py-4 text-sm text-gray-400">
                      {new Date(doc.createdAt).toLocaleDateString('en-GB', {
                        day: '2-digit', month: 'short', year: 'numeric',
                      })}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <a
                          href={doc.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 text-gray-400 hover:text-blue-500 transition-colors rounded"
                          title="Download / View"
                        >
                          <Download size={14} />
                        </a>
                        <button
                          onClick={() => handleDelete(doc._id)}
                          className="p-1.5 text-gray-400 hover:text-red-500 transition-colors rounded"
                          title="Delete"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          </div>
        )}
      </div>
    </div>
  );
}
