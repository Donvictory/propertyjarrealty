import Link from 'next/link';
import { getCurrentUser } from '@/lib/user-session';
import { getProperties } from '@/lib/properties';
import { toPropertyCard } from '@/lib/property-display';
import PropertyCard from '@/components/property/PropertyCard';
import Reveal from '@/components/motion/Reveal';

export default async function AccountSavedPage() {
  const user = (await getCurrentUser())!;
  const ids = new Set(user.savedPropertyIds);
  const properties = ids.size ? (await getProperties().catch(() => [])).filter((p) => ids.has(p.id)) : [];
  const cards = properties.map(toPropertyCard);

  return (
    <div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-3xl font-medium tracking-[-0.02em]">Saved properties</h2>
          <p className="mt-3 text-muted">
            {cards.length
              ? `${cards.length} saved. Tap the heart on a property to remove it.`
              : 'Properties you save will appear here.'}
          </p>
        </div>
        {cards.length > 0 && (
          <Link
            href="/properties"
            className="btn-fill btn-ink inline-flex h-11 items-center self-start border border-line px-5 text-sm font-medium sm:self-auto"
          >
            Browse more
          </Link>
        )}
      </div>

      {cards.length > 0 ? (
        <ul className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
          {cards.map((p, i) => (
            <li key={p.id}>
              <Reveal from="below" delay={(i % 3) * 0.05} className="h-full">
                <PropertyCard property={p} />
              </Reveal>
            </li>
          ))}
        </ul>
      ) : (
        <div className="mt-10 border border-line px-6 py-16 text-center">
          <p className="text-lg font-medium">Nothing saved yet.</p>
          <p className="mx-auto mt-2 max-w-sm text-sm text-muted">
            Use the heart on any property to keep it here while you compare.
          </p>
          <Link
            href="/properties"
            className="btn-fill btn-brand mt-8 inline-flex h-12 items-center bg-brand px-8 text-sm font-medium text-on-brand"
          >
            Browse properties
          </Link>
        </div>
      )}
    </div>
  );
}
