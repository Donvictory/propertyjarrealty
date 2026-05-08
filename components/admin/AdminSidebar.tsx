'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTransition } from 'react';
import { logoutAction } from '@/app/actions/auth';
import type { SessionPayload } from '@/lib/types';

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: '▦' },
  { href: '/admin/admins', label: 'Admin Users', icon: '👤' },
];

export default function AdminSidebar({ 
  session, 
  onClose 
}: { 
  session: SessionPayload,
  onClose?: () => void
}) {
  const pathname = usePathname();
  const [pending, startTransition] = useTransition();

  function handleLogout() {
    startTransition(async () => {
      await logoutAction();
    });
  }

  return (
    <aside className="fixed left-0 top-0 h-full w-64 bg-[#111111] border-r border-white/5 flex flex-col z-50">
      {/* Logo */}
      <div className="p-6 border-b border-white/5">
        <Link href="/" className="block">
          <p className="text-lg font-bold text-white tracking-tighter">
            PROPERTYJAR<span className="text-brand">REALTY</span>
          </p>
          <p className="text-[10px] uppercase tracking-widest text-gray-600 mt-0.5">Admin Console</p>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                isActive
                  ? 'bg-brand text-white'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <span className="text-base">{item.icon}</span>
              {item.label}
            </Link>
          );
        })}

        <div className="pt-4 border-t border-white/5 mt-4">
          <Link
            href="/"
            target="_blank"
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-gray-400 hover:text-white hover:bg-white/5 transition-all"
          >
            <span className="text-base">🌐</span>
            View Website
          </Link>
        </div>
      </nav>

      {/* User Info + Logout */}
      <div className="p-4 border-t border-white/5">
        <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/5 mb-2">
          <div className="w-8 h-8 rounded-full bg-brand flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
            {session.adminName.charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0">
            <p className="text-white text-sm font-semibold truncate">{session.adminName}</p>
            <p className="text-gray-500 text-[10px] uppercase tracking-widest truncate">{session.role.replace('_', ' ')}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          disabled={pending}
          className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-all disabled:opacity-50"
        >
          <span>→</span>
          {pending ? 'Signing out...' : 'Sign Out'}
        </button>
      </div>
    </aside>
  );
}
