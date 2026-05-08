'use client';

import { useActionState } from 'react';
import { loginAction, type LoginState } from '@/app/actions/auth';

export default function AdminLoginPage() {
  const [state, formAction, pending] = useActionState<LoginState, FormData>(loginAction, {});

  return (
    <div className="min-h-screen bg-off-white flex items-center justify-center p-4 relative overflow-hidden">
       
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: 'linear-gradient(#800020 1px, transparent 1px), linear-gradient(90deg, #800020 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />

      <div className="relative w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-10">
          <p className="text-3xl font-bold text-charcoal tracking-tighter">
            PROPERTYJAR<span className="text-brand">REALTY</span>
          </p>
          <p className="text-gray-400 text-sm mt-2 font-bold uppercase tracking-widest">Admin Portal</p>
        </div>

        {/* Card */}
        <div className="bg-white border border-gray-100 rounded-3xl p-10 shadow-xl">
          <h1 className="text-2xl font-bold text-charcoal mb-2 tracking-tight">Welcome back</h1>
          <p className="text-gray-400 text-sm mb-8">Sign in to manage PropertyJar Realty.</p>

          <form action={formAction} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 mb-2">
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                autoComplete="email"
                placeholder="admin@propertyjarrealty.com"
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-charcoal text-sm placeholder:text-gray-300 focus:outline-none focus:border-brand transition-colors"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 mb-2">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                autoComplete="current-password"
                placeholder="••••••••"
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-charcoal text-sm placeholder:text-gray-300 focus:outline-none focus:border-brand transition-colors"
              />
            </div>

            {state?.error && (
              <div className="bg-red-50 border border-red-100 rounded-xl px-4 py-3">
                <p className="text-red-500 text-sm font-bold">{state.error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={pending}
              className="w-full bg-brand text-white py-4 rounded-xl font-bold text-sm hover:bg-brand-hover transition-all shadow-lg shadow-brand/20 disabled:opacity-60 mt-2 active:scale-95"
            >
              {pending ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
        </div>

        <p className="text-center text-gray-400 text-xs mt-8 font-medium uppercase tracking-widest">
          Authorized personnel only
        </p>
      </div>
    </div>
  );
}
