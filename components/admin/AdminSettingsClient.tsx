'use client';

import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { changePasswordAction } from '@/app/actions/admin';

export default function AdminSettingsClient() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  async function handlePasswordChange(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    const formData = new FormData(e.currentTarget);
    const result = await changePasswordAction(formData);

    setLoading(false);
    if (result.error) {
      setError(result.error);
    } else {
      setSuccess('Password updated successfully.');
      e.currentTarget.reset();
    }
  }

  const inputClass = 'w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-charcoal text-sm placeholder:text-gray-300 focus:outline-none focus:border-brand transition-colors shadow-sm pr-12';
  const labelClass = 'block text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 mb-2';

  return (
    <div className="max-w-2xl">
      <div className="mb-10">
        <p className="text-gray-400 text-xs uppercase tracking-widest font-bold mb-1">Account Management</p>
        <h1 className="text-3xl font-bold text-charcoal">Settings</h1>
        <p className="text-gray-500 text-sm mt-1">Manage your administrative security and preferences.</p>
      </div>

      <div className="space-y-8">
        {/* Password Section */}
        <div className="bg-white border border-gray-100 rounded-2xl p-8 shadow-sm">
          <h2 className="text-lg font-bold text-charcoal mb-6">Security & Password</h2>
          
          <form onSubmit={handlePasswordChange} className="space-y-6">
            <div>
              <label className={labelClass} htmlFor="currentPassword">Current Password</label>
              <div className="relative">
                <input 
                  id="currentPassword" 
                  name="currentPassword" 
                  type={showCurrent ? "text" : "password"} 
                  required 
                  placeholder="••••••••" 
                  className={inputClass} 
                />
                <button
                  type="button"
                  onClick={() => setShowCurrent(!showCurrent)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-brand transition-colors p-1"
                >
                  {showCurrent ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className={labelClass} htmlFor="newPassword">New Password</label>
                <div className="relative">
                  <input 
                    id="newPassword" 
                    name="newPassword" 
                    type={showNew ? "text" : "password"} 
                    required 
                    minLength={8} 
                    placeholder="••••••••" 
                    className={inputClass} 
                  />
                  <button
                    type="button"
                    onClick={() => setShowNew(!showNew)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-brand transition-colors p-1"
                  >
                    {showNew ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
              <div>
                <label className={labelClass} htmlFor="confirmPassword">Confirm New Password</label>
                <div className="relative">
                  <input 
                    id="confirmPassword" 
                    name="confirmPassword" 
                    type={showConfirm ? "text" : "password"} 
                    required 
                    minLength={8} 
                    placeholder="••••••••" 
                    className={inputClass} 
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm(!showConfirm)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-brand transition-colors p-1"
                  >
                    {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-100 rounded-xl px-4 py-3">
                <p className="text-red-500 text-sm font-bold">{error}</p>
              </div>
            )}
            {success && (
              <div className="bg-green-50 border border-green-100 rounded-xl px-4 py-3">
                <p className="text-green-600 text-sm font-bold">{success}</p>
              </div>
            )}

            <button 
              type="submit" 
              disabled={loading}
              className="bg-brand text-white px-8 py-3.5 rounded-xl font-bold text-sm hover:bg-brand-hover transition-all shadow-lg shadow-brand/20 disabled:opacity-60 active:scale-95"
            >
              {loading ? 'Updating...' : 'Update Password'}
            </button>
          </form>
        </div>

        {/* Profile Info (Read Only for now) */}
        <div className="bg-white border border-gray-100 rounded-2xl p-8 shadow-sm">
          <h2 className="text-lg font-bold text-charcoal mb-4">Account Information</h2>
          <p className="text-gray-400 text-xs mb-6">Your profile details are managed by the System Administrator.</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <p className={labelClass}>System Access Level</p>
              <p className="text-charcoal font-bold text-sm bg-gray-50 px-4 py-3 rounded-xl border border-gray-100 inline-block">
                Authorized Administrator
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
