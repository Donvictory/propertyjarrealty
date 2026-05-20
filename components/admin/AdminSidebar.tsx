'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useTransition } from 'react';
import { logoutAction } from '@/app/actions/auth';
import type { SessionPayload } from '@/lib/types';

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: '▦' },
  { href: '/admin/admins', label: 'Admin Users', icon: '👤' },
  { href: '/admin/settings', label: 'Settings', icon: '⚙️' },
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
    <aside className="fixed left-0 top-0 h-full w-64 bg-white border-r border-gray-100 flex flex-col z-50 shadow-sm">
      {/* Logo */}
      <div className="p-6 border-b border-gray-500">
        <Link href="/" className="block">
          <Image
            src="/newlogo.JPEG"
            alt="PropertyJar Realty Ltd"
            width={180}
            height={50}
            className="h-10 w-auto object-contain rounded-md"
          />
          
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
              className={`flex items-center gap-3 px-4 py-3 rounded-[3px] text-sm font-semibold transition-all ${
                isActive
                  ? 'bg-brand text-white shadow-md'
                  : 'text-gray-500 hover:text-charcoal hover:bg-gray-50'
              }`}
            >
              <span className="text-base">{item.icon}</span>
              {item.label}
            </Link>
          );
        })}

        <div className="pt-4 border-t border-gray-100 mt-4">
          <Link
            href="/"
            target="_blank"
            className="flex items-center gap-3 px-4 py-3 rounded-[3px] text-sm font-semibold text-gray-500 hover:text-charcoal hover:bg-gray-50 transition-all"
          >
            <span className="text-base">🌐</span>
            View Website
          </Link>
        </div>
      </nav>

      {/* User Info + Logout */}
      <div className="p-4 border-t border-gray-100">
        <div className="flex items-center gap-3 px-4 py-3 rounded-[3px] bg-gray-50 mb-2">
          <div className="w-8 h-8 rounded-full bg-brand flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
            {session.adminName.charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0">
            <p className="text-charcoal text-sm font-bold truncate">{session.adminName}</p>
            <p className="text-gray-400 text-[10px] uppercase font-bold tracking-widest truncate">{session.role.replace('_', ' ')}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          disabled={pending}
          className="w-full flex items-center gap-3 px-4 py-2.5 rounded-[3px] text-sm font-semibold text-gray-500 hover:text-red-600 hover:bg-red-50 transition-all disabled:opacity-50"
        >
          <span>→</span>
          {pending ? 'Signing out...' : 'Sign Out'}
        </button>
      </div>
    </aside>
  );
}
