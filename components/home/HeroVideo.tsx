'use client';

import { useEffect, useRef } from 'react';

/** Placeholder footage: Mixkit clip #254 (free under the Mixkit licence). Swap for brand footage. */
export const HERO_VIDEO_SRC = '/videos/hero-placeholder.mp4';

/** Full-bleed looping background video. Parent must be `relative`. */
export default function HeroVideo() {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    // Respect reduced-motion: hold the first frame instead of looping.
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      ref.current?.pause();
    }
  }, []);

  return (
    <video
      ref={ref}
      className="absolute inset-0 h-full w-full object-cover"
      autoPlay
      muted
      loop
      playsInline
      preload="auto"
      aria-hidden
    >
      <source src={HERO_VIDEO_SRC} type="video/mp4" />
    </video>
  );
}
