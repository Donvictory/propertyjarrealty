'use client';

import { useState } from 'react';
import Image from 'next/image';

export default function Gallery({ images, title }: { images: string[]; title: string }) {
  const [index, setIndex] = useState(0);
  const count = images.length;
  const go = (dir: 1 | -1) => setIndex((i) => (i + dir + count) % count);
  const src = images[index];

  return (
    <figure className="flex h-full flex-col bg-panel">
      <div className="relative aspect-[16/10] w-full lg:aspect-auto lg:flex-1">
        <Image
          key={src}
          src={src}
          alt={`${title}, image ${index + 1} of ${count}`}
          fill
          priority={index === 0}
          sizes="(min-width: 1024px) 62vw, 100vw"
          unoptimized={src.endsWith('.svg')}
          className="rounded-none object-contain p-4 lg:p-6"
        />
      </div>
      <figcaption className="flex h-12 items-center justify-between border-t border-line/70 px-5 text-xs">
        <span className="tabular-nums">
          {String(index + 1).padStart(2, '0')} / {String(count).padStart(2, '0')}
          <span className="ml-3 text-muted">Photo</span>
        </span>
        {count > 1 && (
          <span className="flex gap-1">
            <button type="button" onClick={() => go(-1)} aria-label="Previous image" className="h-9 w-9 hover:text-brand">
              ←
            </button>
            <button type="button" onClick={() => go(1)} aria-label="Next image" className="h-9 w-9 hover:text-brand">
              →
            </button>
          </span>
        )}
      </figcaption>
    </figure>
  );
}
