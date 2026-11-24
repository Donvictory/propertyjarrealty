'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * Sets data-inview="true" on its wrapper while it is on screen, so CSS animations inside
 * (e.g. .drawing-cell) run only when visible and pause when scrolled away.
 */
export default function InViewPlay({ children, className }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { threshold: 0.25 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref} data-inview={inView} className={className}>
      {children}
    </div>
  );
}
