'use client';

import { useActionState } from 'react';
import { loginAction, type LoginState } from '@/app/actions/auth';

export default function AdminLoginPage() {
  const [state, formAction, pending] = useActionState<LoginState, FormData>(loginAction, {});

  return (
    <div className="min-h-screen bg-charcoal flex items-center justify-center p-4">
       
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: 'linear-gradient(#800020 1px, transparent 1px), linear-gradient(90deg, #800020 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />

      <div className="relative w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-10">
          <p className="text-3xl font-bold text-white tracking-tighter">
            PROPERTYJAR<span className="text-brand">REALTY</span>
          </p>
          <p className="text-gray-500 text-sm mt-2 font-medium uppercase tracking-widest">Admin Portal</p>
        </div>

        {/* Card */}
        <div className="bg-charcoal-light border border-white/10 rounded-3xl p-8 shadow-2xl">
          <h1 className="text-2xl font-bold text-white mb-2">Welcome back</h1>
          <p className="text-gray-400 text-sm mb-8">Sign in to manage PropertyJar Realty.</p>

          <form action={formAction} className="space-y-5">
            <div>
              <label htmlFor="email" className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                autoComplete="email"
                placeholder="admin@propertyjarrealty.com"
                className="w-full bg-charcoal-muted border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder:text-gray-600 focus:outline-none focus:border-brand transition-colors"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                autoComplete="current-password"
                placeholder="••••••••"
                className="w-full bg-charcoal-muted border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder:text-gray-600 focus:outline-none focus:border-brand transition-colors"
              />
            </div>

            {state?.error && (
              <div className="bg-red-900/20 border border-red-500/30 rounded-xl px-4 py-3">
                <p className="text-red-400 text-sm font-medium">{state.error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={pending}
              className="w-full bg-brand text-white py-3.5 rounded-xl font-bold text-sm hover:bg-brand-hover transition-all disabled:opacity-60 mt-2"
            >
              {pending ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
        </div>

        <p className="text-center text-gray-600 text-xs mt-6">
          © 2026 PropertyJar Realty. Authorized personnel only.
        </p>
      </div>
    </div>
  );
}
