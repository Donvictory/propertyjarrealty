'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { ArrowUpRight, BriefcaseBusiness, KeyRound } from 'lucide-react';

export const ROLES = [
  {
    role: 'client' as const,
    icon: KeyRound,
    title: 'Client',
    body: 'Buy or invest in property. Save listings, follow your payments and see what you have spent.',
  },
  {
    role: 'realtor' as const,
    icon: BriefcaseBusiness,
    title: 'Realtor',
    body: 'Refer clients with your own link and track the sales and commission you earn.',
  },
];

/** Two role cards. Carries ?ref (a realtor's invite) and ?next through to the chosen form. */
export default function RoleChooser() {
  const q = useSearchParams();
  const carry = new URLSearchParams();
  for (const k of ['ref', 'next']) {
    const v = q.get(k);
    if (v) carry.set(k, v);
  }
  const suffix = carry.toString() ? `?${carry}` : '';

  return (
    <ul className="space-y-3">
      {ROLES.map(({ role, icon: Icon, title, body }) => (
        <li key={role}>
          <Link
            href={`/sign-up/${role}${suffix}`}
            className="group flex items-start gap-4 rounded-xl border border-line bg-paper p-5 transition-colors hover:border-ink focus-visible:border-ink focus-visible:outline-none"
          >
            <span className="icon-fill h-11 w-11 shrink-0 border border-line text-brand [--fill-bg:var(--color-brand)] [--fill-fg:#fff]">
              <Icon size={20} strokeWidth={1.5} aria-hidden />
            </span>
            <span className="min-w-0 flex-1">
              <span className="font-display flex items-center justify-between gap-3 text-lg">
                {title}
                <ArrowUpRight size={18} strokeWidth={1.5} aria-hidden className="text-muted transition-colors group-hover:text-brand" />
              </span>
              <span className="mt-1 block text-sm leading-relaxed text-muted">{body}</span>
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
