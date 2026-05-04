import React, { useEffect, useState, useCallback } from 'react';
import toast from 'react-hot-toast';
import { Plus, Edit2, Trash2, X, ToggleLeft, ToggleRight } from 'lucide-react';
import api from '../utils/api';
import ImageUpload from '../components/ImageUpload';

const LinkedInIcon = ({ size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
    <rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/>
  </svg>
);

const emptyForm = {
  name: '',
  role: '',
  bio: '',
  image: '',
  linkedin: '',
  order: 0,
  active: true,
};

export default function Team() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const fetchMembers = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get('/team');
      const data = Array.isArray(res.data) ? res.data : res.data.members || [];
      setMembers(data.sort((a, b) => (a.order ?? 0) - (b.order ?? 0)));
    } catch (e) {
      toast.error('Failed to load team members');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchMembers(); }, [fetchMembers]);

  const openNew = () => {
    setForm({ ...emptyForm, order: members.length });
    setEditingId(null);
    setShowModal(true);
  };

  const openEdit = (member) => {
    setForm({
      name: member.name || '',
      role: member.role || '',
      bio: member.bio || '',
      image: member.image || '',
      linkedin: member.linkedin || '',
      order: member.order ?? 0,
      active: member.active !== false,
    });
    setEditingId(member._id);
    setShowModal(true);
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Remove "${name}" from the team?`)) return;
    try {
      await api.delete(`/team/${id}`);
      toast.success('Member removed');
      fetchMembers();
    } catch (e) {
      toast.error('Delete failed');
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = { ...form, order: Number(form.order) };
      if (editingId) {
        await api.put(`/team/${editingId}`, payload);
        toast.success('Member updated');
      } else {
        await api.post('/team', payload);
        toast.success('Member added');
      }
      setShowModal(false);
      fetchMembers();
    } catch (e) {
      toast.error(e.response?.data?.message || 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  const getInitials = (name) =>
    name ? name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2) : 'TM';

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <p className="text-gray-500 text-sm">{members.length} team members</p>
        <button
          onClick={openNew}
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium text-white"
          style={{ backgroundColor: '#001B2F' }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#002d4f')}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#001B2F')}
        >
          <Plus size={16} /> Add Member
        </button>
      </div>

      {loading ? (
        <div className="text-center py-12 text-gray-400">Loading team...</div>
      ) : members.length === 0 ? (
        <div className="text-center py-12 text-gray-400">
          <p className="mb-3">No team members yet.</p>
          <button onClick={openNew} className="text-sm font-medium" style={{ color: '#001B2F' }}>Add first member</button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {members.map((member) => (
            <div key={member._id} className={`bg-white rounded-xl shadow-sm border overflow-hidden transition-all hover:shadow-md ${!member.active ? 'opacity-60' : ''} border-gray-100`}>
              {/* Card header */}
              <div className="relative p-6 text-center" style={{ background: 'linear-gradient(135deg, #001B2F 0%, #003059 100%)' }}>
                {member.image ? (
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-20 h-20 rounded-full object-cover mx-auto ring-4 ring-white ring-opacity-20"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                ) : null}
                <div
                  className={`w-20 h-20 rounded-full mx-auto flex items-center justify-center text-xl font-bold ring-4 ring-white ring-opacity-20 ${member.image ? 'hidden' : 'flex'}`}
                  style={{ backgroundColor: '#D4B684', color: '#001B2F' }}
                >
                  {getInitials(member.name)}
                </div>

                {!member.active && (
                  <span className="absolute top-3 right-3 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                    Inactive
                  </span>
                )}
              </div>

              <div className="p-4">
                <h3 className="font-semibold text-gray-900 text-center">{member.name}</h3>
                <p className="text-sm text-center mt-0.5" style={{ color: '#D4B684' }}>{member.role}</p>
                {member.bio && (
                  <p className="text-xs text-gray-500 mt-2 text-center line-clamp-3">{member.bio}</p>
                )}

                <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100">
                  <div className="flex items-center gap-1">
                    {member.linkedin && (
                      <a
                        href={member.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1.5 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                      >
                        <LinkedInIcon size={14} />
                      </a>
                    )}
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => openEdit(member)}
                      className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
                    >
                      <Edit2 size={13} />
                    </button>
                    <button
                      onClick={() => handleDelete(member._id, member.name)}
                      className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-start justify-center p-4 overflow-y-auto" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg my-8">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h2 className="text-lg font-semibold text-gray-900">{editingId ? 'Edit Member' : 'Add Team Member'}</h2>
              <button onClick={() => setShowModal(false)} className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100">
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Name *</label>
                  <input
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none"
                    onFocus={(e) => (e.target.style.borderColor = '#001B2F')}
                    onBlur={(e) => (e.target.style.borderColor = '#D1D5DB')}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Role *</label>
                  <input
                    required
                    value={form.role}
                    onChange={(e) => setForm({ ...form, role: e.target.value })}
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none"
                    onFocus={(e) => (e.target.style.borderColor = '#001B2F')}
                    onBlur={(e) => (e.target.style.borderColor = '#D1D5DB')}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Bio</label>
                <textarea
                  rows={3}
                  value={form.bio}
                  onChange={(e) => setForm({ ...form, bio: e.target.value })}
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none resize-none"
                  onFocus={(e) => (e.target.style.borderColor = '#001B2F')}
                  onBlur={(e) => (e.target.style.borderColor = '#D1D5DB')}
                />
              </div>

              <div>
                <ImageUpload
                  value={form.image}
                  onChange={(url) => setForm({ ...form, image: url })}
                  label="Profile Photo"
                  hint="400 × 400 px"
                  aspectHint="1:1"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">LinkedIn URL</label>
                <input
                  value={form.linkedin}
                  onChange={(e) => setForm({ ...form, linkedin: e.target.value })}
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none"
                  onFocus={(e) => (e.target.style.borderColor = '#001B2F')}
                  onBlur={(e) => (e.target.style.borderColor = '#D1D5DB')}
                  placeholder="https://linkedin.com/in/..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Display Order</label>
                  <input
                    type="number"
                    value={form.order}
                    onChange={(e) => setForm({ ...form, order: e.target.value })}
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none"
                    onFocus={(e) => (e.target.style.borderColor = '#001B2F')}
                    onBlur={(e) => (e.target.style.borderColor = '#D1D5DB')}
                  />
                </div>
                <div className="flex items-end pb-1">
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
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-2 border-t border-gray-100">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-sm font-medium text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50">
                  Cancel
                </button>
                <button type="submit" disabled={saving} className="px-5 py-2 text-sm font-medium text-white rounded-lg disabled:opacity-60" style={{ backgroundColor: '#001B2F' }}>
                  {saving ? 'Saving...' : editingId ? 'Update' : 'Add Member'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
