'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const TABS = [
  { href: '/account', label: 'Overview' },
  { href: '/account/network', label: 'Network', realtorOnly: true },
  { href: '/account/profile', label: 'Profile' },
  { href: '/account/saved', label: 'Saved' },
  { href: '/account/security', label: 'Security' },
];

export default function AccountNav({ savedCount, role }: { savedCount: number; role: 'client' | 'realtor' }) {
  const pathname = usePathname();
  const tabs = TABS.filter((t) => !t.realtorOnly || role === 'realtor');
  return (
    <nav aria-label="Account" className="scrollbar-hide -mx-4 overflow-x-auto px-4 sm:mx-0 sm:px-0">
      <ul className="flex gap-1">
        {tabs.map((t) => {
          const active = pathname === t.href;
          return (
            <li key={t.href} className="shrink-0">
              <Link
                href={t.href}
                aria-current={active ? 'page' : undefined}
                className={`btn-fill btn-paper relative inline-flex h-11 items-center gap-2 px-4 text-sm ${
                  active ? 'text-paper' : 'text-paper/65'
                }`}
              >
                {t.label}
                {t.href === '/account/saved' && savedCount > 0 && (
                  <span className="text-xs tabular-nums opacity-70">{savedCount}</span>
                )}
                {active && <span aria-hidden className="absolute inset-x-4 bottom-0 h-0.5 bg-brand" />}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
