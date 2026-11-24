'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import PropertyCard from '@/components/property/PropertyCard';
import type { PropertyCardData } from '@/lib/property-display';

const GAP_PX = 24;

export default function PropertyCarousel({ properties }: { properties: PropertyCardData[] }) {
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
