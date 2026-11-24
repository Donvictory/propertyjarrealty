'use client';

import { useMemo, useState } from 'react';
import { CURRENCY_LABELS, type Currency } from '@/lib/currency';
import type { PropertyCardData, PropertyCategory } from '@/lib/property-display';
import PropertyCard from './PropertyCard';

type Filter = 'all' | PropertyCategory;

const FILTERS: { value: Filter; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'land', label: 'Land' },
  { value: 'residential', label: 'Residential' },
  { value: 'commercial', label: 'Commercial' },
  { value: 'shortlet', label: 'Short-let' },
];

type Props = {
  properties: PropertyCardData[];
  /** Override the empty-state message. */
  emptyMessage?: string;
};

export default function PropertiesBrowser({ properties, emptyMessage }: Props) {
  const [filter, setFilter] = useState<Filter>('all');
  const [query, setQuery] = useState('');
  const [currency, setCurrency] = useState<Currency>('NGN');

  // Only offer category tabs that have at least one listing.
  const filters = useMemo(
    () => FILTERS.filter((f) => f.value === 'all' || properties.some((p) => p.categories.includes(f.value as PropertyCategory))),
    [properties],
  );

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return properties.filter((p) => {
      if (filter !== 'all' && !p.categories.includes(filter)) return false;
      if (q && !`${p.title} ${p.location} ${p.kind}`.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [properties, filter, query]);

  const reset = () => {
    setFilter('all');
    setQuery('');
  };

  return (
    <div>
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div
          role="group"
          aria-label="Filter by type"
          className="scrollbar-hide -mx-4 flex snap-x gap-3 overflow-x-auto scroll-px-4 px-4 sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0"
        >
          {filters.map((f) => {
            const active = filter === f.value;
            return (
              <button
                key={f.value}
                type="button"
                aria-pressed={active}
                onClick={() => setFilter(f.value)}
                className={`h-12 min-w-24 shrink-0 snap-start rounded-lg border px-4 text-left text-[15px] font-medium sm:min-w-28 lg:min-w-36 ${
                  active ? 'border-brand bg-brand text-white' : 'border-line text-ink btn-fill btn-accent'
                }`}
              >
                {f.label}
              </button>
            );
          })}
        </div>

        <label className="relative block w-full lg:max-w-[460px]">
          <span className="sr-only">Search by name or location</span>
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name or location"
            className="h-12 w-full border border-line bg-transparent px-4 text-[15px] placeholder:text-muted focus:border-ink focus:outline-none"
          />
        </label>
      </div>

      <div className="mt-12 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm font-medium" aria-live="polite">
          {visible.length} {visible.length === 1 ? 'property' : 'properties'}
        </p>
        <label className="flex items-center gap-2 text-sm text-muted">
          Show prices in
          <select
            value={currency}
            onChange={(e) => setCurrency(e.target.value as Currency)}
            className="border-b border-line bg-transparent py-1 pr-1 text-ink focus:border-ink focus:outline-none"
          >
            {(Object.keys(CURRENCY_LABELS) as Currency[]).map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </label>
      </div>
      {currency !== 'NGN' && (
        <p className="mt-2 text-xs text-muted">Converted from naira at an indicative rate. Payments are made in naira.</p>
      )}

      {visible.length > 0 ? (
        <ul
          className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6"
        >
          {visible.map((p) => (
            <li key={p.id}>
              <PropertyCard property={p} currency={currency} />
            </li>
          ))}
        </ul>
      ) : (
        <div className="mt-8 bg-panel px-6 py-16 text-center">
          <p className="text-lg font-medium">{emptyMessage ?? 'No properties match.'}</p>
          <p className="mt-2 text-sm text-muted">Try another type or search term.</p>
          <button
            type="button"
            onClick={reset}
            className="mt-6 h-11 border border-ink px-5 text-sm font-medium btn-fill btn-ink"
          >
            Clear filters
          </button>
        </div>
      )}
    </div>
  );
}
