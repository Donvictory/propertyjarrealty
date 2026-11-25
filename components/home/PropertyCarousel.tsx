'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import PropertyCard from '@/components/property/PropertyCard';
import type { PropertyCardData } from '@/lib/property-display';

const GAP_PX = 24;

type Props = {
  properties: PropertyCardData[];
  /** Ends the carousel with a card linking to every listing, when the home page shows only some. */
  viewAll?: { href: string; total: number };
};

export default function PropertyCarousel({ properties, viewAll }: Props) {
  const trackRef = useRef<HTMLUListElement>(null);
  const [index, setIndex] = useState(0);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  const sync = useCallback(() => {
    const el = trackRef.current;
    const first = el?.firstElementChild as HTMLElement | null;
    if (!el || !first) return;
    const step = first.offsetWidth + GAP_PX;
    setIndex(Math.min(properties.length - 1, Math.round(el.scrollLeft / step)));
    setAtStart(el.scrollLeft <= 2);
    setAtEnd(el.scrollLeft + el.clientWidth >= el.scrollWidth - 2);
  }, [properties.length]);

  useEffect(() => {
    sync();
    window.addEventListener('resize', sync);
    return () => window.removeEventListener('resize', sync);
  }, [sync]);

  const page = (dir: 1 | -1) => {
    const el = trackRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * (el.clientWidth + GAP_PX), behavior: 'smooth' });
  };

  const total = String(properties.length).padStart(2, '0');

  return (
    <div>
      <ul
        ref={trackRef}
        onScroll={sync}
        className="scrollbar-hide -mx-4 flex snap-x snap-mandatory gap-6 overflow-x-auto scroll-px-4 px-4 sm:mx-0 sm:scroll-px-0 sm:px-0"
        aria-label="Available properties"
      >
        {properties.map((p) => (
          <li
            key={p.id}
            className="w-[84%] shrink-0 snap-start sm:w-[calc((100%-24px)/2)] lg:w-[calc((100%-48px)/3)]"
          >
            <PropertyCard
              property={p}
              variant="compact"
              sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 84vw"
            />
          </li>
        ))}
        {viewAll && (
          <li className="w-[84%] shrink-0 snap-start sm:w-[calc((100%-24px)/2)] lg:w-[calc((100%-48px)/3)]">
            <Link
              href={viewAll.href}
              className="group flex h-full min-h-[320px] flex-col justify-between rounded-xl bg-ink p-6 text-paper sm:p-8"
            >
              <span className="font-display text-3xl leading-tight">See all {viewAll.total} properties</span>
              <span className="flex items-center justify-between gap-4 text-sm text-paper/70">
                Land, homes, commercial and short-lets
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-brand text-white transition-transform group-hover:translate-x-1">
                  <ArrowRight size={18} strokeWidth={1.75} aria-hidden />
                </span>
              </span>
            </Link>
          </li>
        )}
      </ul>

      <div className="mt-6 flex items-center justify-between">
        <p className="text-xs tabular-nums text-muted" aria-live="polite">
          {String(index + 1).padStart(2, '0')} / {total}
        </p>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => page(-1)}
            disabled={atStart}
            className="h-11 border border-line px-5 text-sm btn-fill btn-ink disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-line"
          >
            ← Previous
          </button>
          <button
            type="button"
            onClick={() => page(1)}
            disabled={atEnd}
            className="h-11 border border-line px-5 text-sm btn-fill btn-ink disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-line"
          >
            Next →
          </button>
        </div>
      </div>
    </div>
  );
}
