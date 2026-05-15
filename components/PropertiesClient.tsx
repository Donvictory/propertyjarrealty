'use client';

import { useState, useMemo } from 'react';
import type { Property } from '@/lib/types';
import PropertyCard from '@/components/PropertyCard';
import Link from 'next/link';

// ─── Types ───────────────────────────────────────────────────────────────────
type Currency = 'NGN' | 'USD' | 'GBP';

// Approximate exchange rates relative to NGN (base currency)
const NGN_RATES: Record<Currency, number> = {
  NGN: 1,
  USD: 1 / 1400,   // 1 NGN = 0.000714 USD (1 USD = 1400 NGN)
  GBP: 1 / 1850,   // 1 NGN = 0.000540 GBP (1 GBP = 1850 NGN)
};

const SYMBOLS: Record<Currency, string> = {
  NGN: '₦',
  USD: '$',
  GBP: '£',
};

const CURRENCY_LABELS: Record<Currency, string> = {
  NGN: 'Nigerian Naira (₦)',
  USD: 'US Dollar ($)',
  GBP: 'British Pound (£)',
};

const PROPERTY_TYPES = ['All', 'Residential', 'Commercial', 'Industrial', 'Land'];

// Price ranges defined in NGN (tens of millions / billions)
const PRICE_RANGES: { label: string; minNGN: number; maxNGN: number }[] = [
  { label: 'All Prices',          minNGN: 0,              maxNGN: Infinity },
  { label: 'Under ₦50M',          minNGN: 0,              maxNGN: 50_000_000 },
  { label: '₦50M – ₦100M',        minNGN: 50_000_000,     maxNGN: 100_000_000 },
  { label: '₦100M – ₦300M',       minNGN: 100_000_000,    maxNGN: 300_000_000 },
  { label: '₦300M – ₦1B',         minNGN: 300_000_000,    maxNGN: 1_000_000_000 },
  { label: '₦1B – ₦5B',           minNGN: 1_000_000_000,  maxNGN: 5_000_000_000 },
  { label: 'Above ₦5B',           minNGN: 5_000_000_000,  maxNGN: Infinity },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────
/** Detect which currency a stored price string is in */
function detectStoredCurrency(price: string): Currency {
  if (price.includes('£')) return 'GBP';
  if (price.includes('$')) return 'USD';
  return 'NGN'; // default assumption
}

/** Parse any price string into NGN */
function parsePriceNGN(price: string): number {
  const stored = detectStoredCurrency(price);
  const cleaned = price.replace(/[^0-9.]/g, '');
  if (!cleaned) return 0;
  let val = parseFloat(cleaned);
  // Handle "M" shorthand
  if (/\d\s*[Mm]/.test(price) && val < 100_000) val *= 1_000_000;
  // Convert to NGN
  return val / NGN_RATES[stored]; // stored → NGN
}

/** Format an NGN amount into the target display currency */
function formatDisplay(ngn: number, currency: Currency): string {
  const val = ngn * NGN_RATES[currency];
  const sym = SYMBOLS[currency];

  if (currency === 'NGN') {
    if (val >= 1_000_000_000) return `${sym}${(val / 1_000_000_000).toFixed(2)}B`;
    if (val >= 1_000_000)     return `${sym}${(val / 1_000_000).toFixed(1)}M`;
    return `${sym}${val.toLocaleString('en-NG', { maximumFractionDigits: 0 })}`;
  }
  if (val >= 1_000_000) return `${sym}${(val / 1_000_000).toFixed(2)}M`;
  if (val >= 1_000)     return `${sym}${(val / 1_000).toFixed(1)}K`;
  return `${sym}${val.toLocaleString('en-US', { maximumFractionDigits: 0 })}`;
}

/** Build a human-readable range label for the current currency */
function rangeLabelInCurrency(range: typeof PRICE_RANGES[number], cur: Currency): string {
  if (range.minNGN === 0 && range.maxNGN === Infinity) return 'All Prices';

  function fmtNGN(n: number) {
    const v = n * NGN_RATES[cur];
    const sym = SYMBOLS[cur];
    if (cur === 'NGN') {
      if (v >= 1_000_000_000) return `${sym}${(v / 1_000_000_000).toFixed(0)}B`;
      return `${sym}${(v / 1_000_000).toFixed(0)}M`;
    }
    if (v >= 1_000_000) return `${sym}${(v / 1_000_000).toFixed(1)}M`;
    if (v >= 1_000)     return `${sym}${(v / 1_000).toFixed(0)}K`;
    return `${sym}${v.toFixed(0)}`;
  }

  if (range.maxNGN === Infinity) return `Above ${fmtNGN(range.minNGN)}`;
  return `${fmtNGN(range.minNGN)} – ${fmtNGN(range.maxNGN)}`;
}

// ─── Dropdown component ───────────────────────────────────────────────────────
function FilterSelect({
  id,
  label,
  value,
  onChange,
  options,
  icon,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
  icon?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5 flex-1 min-w-[200px]">
      <label htmlFor={id} className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">
        {label}
      </label>
      <div className="relative group">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-brand group-hover:scale-110 transition-transform">
          {icon}
        </div>
        <select
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="appearance-none w-full bg-white border border-gray-100 text-charcoal text-sm font-bold rounded-2xl pl-11 pr-10 py-3.5 focus:outline-none focus:border-brand focus:ring-4 focus:ring-brand/5 transition-all shadow-sm cursor-pointer hover:border-brand/50"
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 group-hover:text-brand transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
        </span>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
interface PropertiesClientProps {
  properties: Property[];
}

export default function PropertiesClient({ properties }: PropertiesClientProps) {
  const [activeType, setActiveType]     = useState('All');
  const [activePriceIdx, setActivePriceIdx] = useState(0);
  const [currency, setCurrency]         = useState<Currency>('NGN');

  // Filtered list
  const filtered = useMemo(() => {
    const range = PRICE_RANGES[activePriceIdx];
    return properties.filter((p) => {
      const matchType  = activeType === 'All' || p.type === activeType;
      const ngnVal     = parsePriceNGN(p.price);
      const matchPrice = ngnVal >= range.minNGN && ngnVal < range.maxNGN;
      return matchType && matchPrice;
    });
  }, [properties, activeType, activePriceIdx]);

  return (
    <>
      {/* ── Header ─────────────────────────────────────── */}
      <section className="bg-off-white pt-16 pb-8">
        <div className="container mx-auto px-6">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
            <div className="max-w-2xl">
              <h1 className="text-4xl md:text-5xl font-bold text-charcoal tracking-tight">
                Our <span className="text-brand">Exclusive</span> Properties
              </h1>
              <p className="mt-4 text-gray-600 text-lg leading-relaxed">
                Discover a curated selection of the most prestigious properties in the world&apos;s most desirable locations.
              </p>
              </div>
              <Link
                href="/campaign"
                className="bg-brand text-white px-8 py-4 rounded-2xl font-bold text-sm hover:bg-brand-hover transition-all shadow-lg shadow-brand/20 active:scale-95 whitespace-nowrap"
              >
                Investor Campaign →
              </Link>
            </div>
          </div>
        </div>
      </section>

       
      <section className="bg-off-white/80 backdrop-blur-xl border-y border-gray-100 sticky top-[72px] z-40 py-6">
        <div className="container mx-auto px-6">
          <div className="bg-white/50 p-2 rounded-[2.5rem] border border-white/20 shadow-xl shadow-gray-200/50">
            <div className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-center">

              {/* Type dropdown */}
              <FilterSelect
                id="filter-type"
                label="Property Category"
                value={activeType}
                onChange={setActiveType}
                options={PROPERTY_TYPES.map((t) => ({ value: t, label: t }))}
                icon={<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>}
              />

              <div className="hidden lg:block w-px h-12 bg-gray-100 mx-2" />

              {/* Price range dropdown */}
              <FilterSelect
                id="filter-price"
                label="Price Range"
                value={String(activePriceIdx)}
                onChange={(v) => setActivePriceIdx(Number(v))}
                options={PRICE_RANGES.map((r, i) => ({
                  value: String(i),
                  label: rangeLabelInCurrency(r, currency),
                }))}
                icon={<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>}
              />

              <div className="hidden lg:block w-px h-12 bg-gray-100 mx-2" />

              {/* Currency dropdown */}
              <FilterSelect
                id="filter-currency"
                label="Market Currency"
                value={currency}
                onChange={(v) => setCurrency(v as Currency)}
                options={(Object.keys(CURRENCY_LABELS) as Currency[]).map((c) => ({
                  value: c,
                  label: CURRENCY_LABELS[c],
                }))}
                icon={<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>}
              />

              {/* Clear button - only show if filters are applied */}
              {(activeType !== 'All' || activePriceIdx !== 0) && (
                <button 
                  onClick={() => { setActiveType('All'); setActivePriceIdx(0); }}
                  className="lg:ml-2 px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest text-red-500 hover:bg-red-50 transition-colors whitespace-nowrap"
                >
                  Reset Filters
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ── Grid ───────────────────────────────────────── */}
      <section className="py-20 bg-off-white">
        <div className="container mx-auto px-6">
          {filtered.length === 0 ? (
            <div className="text-center py-32 bg-white rounded-[3rem] border border-gray-100 shadow-sm">
              <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-gray-300"><circle cx="12" cy="12" r="10"/><line x1="8" y1="12" x2="16" y2="12"/></svg>
              </div>
              <p className="text-2xl font-bold text-charcoal mb-2">No matches found</p>
              <p className="text-gray-400 text-sm max-w-xs mx-auto">Try adjusting your filters or search criteria to find what you&apos;re looking for.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 lg:gap-12">
              {filtered.map((property) => {
                const ngnVal      = parsePriceNGN(property.price);
                const displayPrice = ngnVal > 0 ? formatDisplay(ngnVal, currency) : property.price;
                return (
                  <PropertyCard
                    key={property.id}
                    property={property}
                    displayPrice={displayPrice}
                  />
                );
              })}
            </div>
          )}
        </div>
      </section>
    </>
  );
}

