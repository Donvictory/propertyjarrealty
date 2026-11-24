'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Heart } from 'lucide-react';
import { toggleSaved, useMe } from '@/lib/use-me';

const BASE =
  'btn-fill btn-accent flex h-10 w-10 items-center justify-center rounded-full bg-paper/95 shadow-[0_2px_10px_rgba(28,28,27,0.15)]';

/**
 * Heart on a property card. Signed out: links to sign-in and saves after. Signed in: toggles in place.
 */
export default function FavouriteButton({ propertyId, title }: { propertyId: string; title: string }) {
  const me = useMe();
  const pathname = usePathname();
  const router = useRouter();
  const saved = me.savedIds.includes(propertyId);

  if (!me.user) {
    const next = `/campaign/${propertyId}`;
    return (
      <Link
        href={`/sign-in?next=${encodeURIComponent(next)}&save=${encodeURIComponent(propertyId)}`}
        aria-label={`Add ${title} to favourites`}
        title="Add to favourites"
        className={`${BASE} text-ink`}
      >
        <Heart size={18} strokeWidth={1.75} aria-hidden />
      </Link>
    );
  }

  return (
    <button
      type="button"
      onClick={async () => {
        await toggleSaved(propertyId, !saved);
        // On the account's Saved page, re-render so the list and count update.
        if (pathname?.startsWith('/account')) router.refresh();
      }}
      aria-pressed={saved}
      aria-label={saved ? `Remove ${title} from favourites` : `Add ${title} to favourites`}
      title={saved ? 'Saved to favourites' : 'Add to favourites'}
      className={`${BASE} ${saved ? 'text-brand' : 'text-ink'}`}
    >
      <Heart size={18} strokeWidth={1.75} aria-hidden fill={saved ? 'currentColor' : 'none'} />
    </button>
  );
}
