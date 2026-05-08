'use client';

import { useState, useEffect } from 'react';
import type { SessionPayload } from '@/lib/types';

interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: 'super_admin' | 'admin';
  createdAt: string;
}

interface InviteForm {
  name: string;
  email: string;
  password: string;
  role: 'admin' | 'super_admin';
}

const EMPTY_FORM: InviteForm = { name: '', email: '', password: '', role: 'admin' };

export default function AdminUsersClient({ session }: { session: SessionPayload }) {
  const [admins, setAdmins] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<InviteForm>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const isSuperAdmin = session.role === 'super_admin';

  useEffect(() => {
    fetch('/api/admins')
      .then((r) => r.json())
      .then((data) => {
        setAdmins(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleInvite(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');
    try {
      const res = await fetch('/api/admins', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setAdmins((prev) => [...prev, data]);
      setForm(EMPTY_FORM);
      setShowForm(false);
      setSuccess(`Admin "${data.name}" has been added successfully.`);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to add admin');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string, name: string) {
    if (!confirm(`Remove ${name} as admin? They will lose all access immediately.`)) return;
    setDeletingId(id);
    try {
      const res = await fetch('/api/admins', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error);
      }
      setAdmins((prev) => prev.filter((a) => a.id !== id));
      setSuccess(`${name} has been removed.`);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to delete admin');
    } finally {
      setDeletingId(null);
    }
  }

  const inputClass = 'w-full bg-[#1a1a1a] border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder:text-gray-600 focus:outline-none focus:border-brand transition-colors';
  const labelClass = 'block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-1.5';

  return (
    <div>
      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <p className="text-gray-500 text-xs uppercase tracking-widest font-bold mb-1">Admin Console</p>
          <h1 className="text-3xl font-bold text-white">Admin Users</h1>
          <p className="text-gray-500 text-sm mt-1">Manage who has access to this dashboard.</p>
        </div>
        {isSuperAdmin && (
          <button
            onClick={() => { setShowForm(true); setError(''); setSuccess(''); }}
            className="flex items-center gap-2 bg-brand text-white px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-brand-hover transition-all"
          >
            <span>+</span> Add Admin
          </button>
        )}
      </div>

      {/* Alerts */}
      {error && (
        <div className="mb-4 bg-red-900/20 border border-red-500/30 rounded-xl px-4 py-3">
          <p className="text-red-400 text-sm">{error}</p>
        </div>
      )}
      {success && (
        <div className="mb-4 bg-green-900/20 border border-green-500/30 rounded-xl px-4 py-3">
          <p className="text-green-400 text-sm">{success}</p>
        </div>
      )}

      {/* Invite Form */}
      {showForm && isSuperAdmin && (
        <div className="bg-[#111111] border border-brand/30 rounded-2xl p-6 mb-6">
          <h2 className="text-white font-bold mb-4">Add New Admin</h2>
          <form onSubmit={handleInvite} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={labelClass} htmlFor="au-name">Full Name</label>
              <input id="au-name" name="name" required value={form.name} onChange={handleChange} placeholder="Jane Doe" className={inputClass} />
            </div>
            <div>
              <label className={labelClass} htmlFor="au-email">Email</label>
              <input id="au-email" name="email" type="email" required value={form.email} onChange={handleChange} placeholder="jane@example.com" className={inputClass} />
            </div>
            <div>
              <label className={labelClass} htmlFor="au-password">Initial Password</label>
              <input id="au-password" name="password" type="password" required minLength={8} value={form.password} onChange={handleChange} placeholder="Min 8 characters" className={inputClass} />
            </div>
            <div>
              <label className={labelClass} htmlFor="au-role">Role</label>
              <select id="au-role" name="role" value={form.role} onChange={handleChange} className={inputClass}>
                <option value="admin">Admin</option>
                <option value="super_admin">Super Admin</option>
              </select>
            </div>
            <div className="md:col-span-2 flex gap-3">
              <button type="button" onClick={() => setShowForm(false)} className="flex-1 border border-white/10 text-gray-400 py-2.5 rounded-xl font-bold text-sm hover:bg-white/5 transition-all">
                Cancel
              </button>
              <button type="submit" disabled={saving} className="flex-1 bg-brand text-white py-2.5 rounded-xl font-bold text-sm hover:bg-brand-hover transition-all disabled:opacity-60">
                {saving ? 'Adding...' : 'Add Admin'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Admins List */}
      <div className="bg-[#111111] border border-white/5 rounded-2xl overflow-hidden">
        {loading ? (
          <div className="text-center py-16 text-gray-600 text-sm">Loading...</div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/5">
                <th className="text-left px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-gray-500">Admin</th>
                <th className="text-left px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-gray-500 hidden md:table-cell">Email</th>
                <th className="text-left px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-gray-500">Role</th>
                <th className="text-left px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-gray-500 hidden lg:table-cell">Added</th>
                {isSuperAdmin && <th className="text-right px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-gray-500">Actions</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {admins.map((admin) => (
                <tr key={admin.id} className="hover:bg-white/2 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-brand/20 border border-brand/20 flex items-center justify-center text-brand text-sm font-bold flex-shrink-0">
                        {admin.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-semibold text-white">{admin.name}</p>
                        {admin.id === session.adminId && <p className="text-[10px] text-brand uppercase tracking-widest">You</p>}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-400 hidden md:table-cell">{admin.email}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border ${
                      admin.role === 'super_admin'
                        ? 'bg-brand/20 text-brand border-brand/20'
                        : 'bg-white/5 text-gray-400 border-white/10'
                    }`}>
                      {admin.role.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-600 text-xs hidden lg:table-cell">
                    {new Date(admin.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </td>
                  {isSuperAdmin && (
                    <td className="px-6 py-4 text-right">
                      {admin.id !== session.adminId && (
                        <button
                          onClick={() => handleDelete(admin.id, admin.name)}
                          disabled={deletingId === admin.id}
                          className="px-3 py-1.5 rounded-lg text-xs font-bold text-red-500 hover:text-white hover:bg-red-600 transition-all border border-red-500/20 disabled:opacity-50"
                        >
                          {deletingId === admin.id ? '...' : 'Remove'}
                        </button>
                      )}
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        )}
        <div className="border-t border-white/5 px-6 py-3 text-xs text-gray-600">
          {admins.length} admin{admins.length !== 1 ? 's' : ''} total
        </div>
      </div>
    </div>
  );
}
