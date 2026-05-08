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

  const inputClass = 'w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-charcoal text-sm placeholder:text-gray-300 focus:outline-none focus:border-brand transition-colors shadow-sm';
  const labelClass = 'block text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 mb-2';

  return (
    <div>
      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <p className="text-gray-400 text-xs uppercase tracking-widest font-bold mb-1">Admin Console</p>
          <h1 className="text-3xl font-bold text-charcoal">Admin Users</h1>
          <p className="text-gray-500 text-sm mt-1">Manage who has access to this dashboard.</p>
        </div>
        {isSuperAdmin && (
          <button
            onClick={() => { setShowForm(true); setError(''); setSuccess(''); }}
            className="flex items-center gap-2 bg-brand text-white px-6 py-3 rounded-xl font-bold text-sm hover:bg-brand-hover transition-all shadow-lg shadow-brand/20 active:scale-95"
          >
            <span className="text-lg leading-none">+</span> Add Admin
          </button>
        )}
      </div>

      {/* Alerts */}
      {error && (
        <div className="mb-6 bg-red-50 border border-red-100 rounded-xl px-4 py-3">
          <p className="text-red-500 text-sm font-bold">{error}</p>
        </div>
      )}
      {success && (
        <div className="mb-6 bg-green-50 border border-green-100 rounded-xl px-4 py-3">
          <p className="text-green-600 text-sm font-bold">{success}</p>
        </div>
      )}

      {/* Invite Form */}
      {showForm && isSuperAdmin && (
        <div className="bg-white border border-brand/20 rounded-2xl p-8 mb-8 shadow-xl">
          <h2 className="text-charcoal font-bold mb-6 text-lg">Add New Admin</h2>
          <form onSubmit={handleInvite} className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
            <div className="md:col-span-2 flex gap-4 mt-2">
              <button type="button" onClick={() => setShowForm(false)} className="flex-1 border border-gray-200 text-gray-500 py-3 rounded-xl font-bold text-sm hover:bg-gray-50 transition-all">
                Cancel
              </button>
              <button type="submit" disabled={saving} className="flex-1 bg-brand text-white py-3 rounded-xl font-bold text-sm hover:bg-brand-hover transition-all disabled:opacity-60 shadow-lg shadow-brand/10">
                {saving ? 'Adding...' : 'Add Admin'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Admins List */}
      <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
        {loading ? (
          <div className="text-center py-20 text-gray-400 text-sm italic">Loading personnel data...</div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-50 bg-gray-50/50">
                <th className="text-left px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-gray-400">Admin</th>
                <th className="text-left px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-gray-400 hidden md:table-cell">Email</th>
                <th className="text-left px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-gray-400">Role</th>
                <th className="text-left px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-gray-400 hidden lg:table-cell">Added</th>
                {isSuperAdmin && <th className="text-right px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-gray-400">Actions</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {admins.map((admin) => (
                <tr key={admin.id} className="hover:bg-gray-50/30 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-brand/10 border border-brand/10 flex items-center justify-center text-brand text-sm font-bold flex-shrink-0">
                        {admin.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-bold text-charcoal">{admin.name}</p>
                        {admin.id === session.adminId && <p className="text-[10px] text-brand font-bold uppercase tracking-widest">Current User</p>}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-500 hidden md:table-cell">{admin.email}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border ${
                      admin.role === 'super_admin'
                        ? 'bg-brand/10 text-brand border-brand/20'
                        : 'bg-gray-100 text-gray-500 border-gray-200'
                    }`}>
                      {admin.role.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-400 text-xs hidden lg:table-cell">
                    {new Date(admin.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </td>
                  {isSuperAdmin && (
                    <td className="px-6 py-4 text-right">
                      {admin.id !== session.adminId && (
                        <button
                          onClick={() => handleDelete(admin.id, admin.name)}
                          disabled={deletingId === admin.id}
                          className="px-3 py-1.5 rounded-lg text-xs font-bold text-red-500 hover:text-white hover:bg-red-600 transition-all border border-red-100 disabled:opacity-50"
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
        <div className="border-t border-gray-50 px-6 py-3 text-xs text-gray-400 bg-gray-50/30 font-medium">
          {admins.length} total administrator{admins.length !== 1 ? 's' : ''}
        </div>
      </div>
    </div>
  );
}
