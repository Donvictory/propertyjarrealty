'use client';

import { useEffect, useRef, useState, useSyncExternalStore } from 'react';
import {
  animate,
  motion,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from 'framer-motion';

type Props = {
  children: React.ReactNode;
  /**
   * Side the content travels in from on desktop. On small screens everything rises instead.
   * "below" rises at every size (grid items such as property cards).
   */
  from?: 'left' | 'right' | 'below';
  /** Shifts when this block starts moving, as a fraction of the viewport (0.1 ≈ a little later). */
  delay?: number;
  /**
   * Multiplier on the travel distance. Items further down a stack use a larger value so they start
   * further out and arrive later, then settle into the stack one after another.
   */
  distance?: number;
  className?: string;
};

const MOBILE_QUERY = '(max-width: 767px)';
const EASE = [0.22, 1, 0.36, 1] as const;

function subscribe(onChange: () => void) {
  const mq = window.matchMedia(MOBILE_QUERY);
  mq.addEventListener('change', onChange);
  return () => mq.removeEventListener('change', onChange);
}

/** True on phone-width screens. Server snapshot is "desktop"; corrected on hydration. */
function useIsMobile() {
  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(MOBILE_QUERY).matches,
    () => false,
  );
}

/**
 * How a block enters, decided once on mount:
 * - "entrance": already on screen at load → short timed entrance to its final position, so nothing
 *   is left half-slid just because it happened to sit low in the first viewport.
 * - "scroll": below the fold → position is tied to scroll (moves in on scroll down, back out on scroll up).
 * - "in-view": below the fold but too close to the end of the page to ever reach the scroll-linked
 *   "fully in" line → timed entrance the first time it comes into view.
 */
type Mode = 'pending' | 'entrance' | 'scroll' | 'in-view';

export default function Reveal({ children, from = 'left', delay = 0, distance: travel = 1, className }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const isMobile = useIsMobile();
  const [mode, setMode] = useState<Mode>('pending');

  const startAt = Math.max(0.7, 0.98 - delay);
  const endAt = Math.max(0.35, 0.6 - delay);

  // Scroll-linked progress (used in "scroll" mode).
  const { scrollYProgress } = useScroll({ target: ref, offset: [`start ${startAt}`, `start ${endAt}`] });
  const scrollProgress = useSpring(scrollYProgress, { stiffness: 140, damping: 28, mass: 0.35, restDelta: 0.001 });

  // The value the transforms read. Fed by the spring in "scroll" mode, by a timed tween otherwise.
  const progress = useMotionValue(0);
  useMotionValueEvent(scrollProgress, 'change', (v) => {
    if (mode === 'scroll' && !reduceMotion) progress.set(v);
  });

  // Decide the mode once, from where the block sits when the page mounts.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const vh = window.innerHeight;
    const rect = el.getBoundingClientRect();
    const maxScroll = document.documentElement.scrollHeight - vh;
    const topAtMaxScroll = rect.top + window.scrollY - maxScroll;

    if (rect.top < vh && rect.bottom > 0) setMode('entrance');
    else if (topAtMaxScroll > vh * endAt) setMode('in-view');
    else setMode('scroll');
  }, [endAt]);

  useEffect(() => {
    // Reduced motion: jump straight to "in place". (We keep the style prop rather than dropping it,
    // because the server-rendered HTML carries the starting offset and React won't patch a style
    // attribute mismatch during hydration — dropping it could leave content stuck hidden.)
    if (reduceMotion) {
      progress.set(1);
      return;
    }
    if (mode === 'entrance') {
      const controls = animate(progress, 1, { duration: 0.9, ease: EASE, delay: delay * 2 });
      return () => controls.stop();
    }
    if (mode === 'scroll') {
      progress.set(scrollProgress.get());
      return;
    }
    if (mode === 'in-view') {
      const el = ref.current;
      if (!el) return;
      let controls: ReturnType<typeof animate> | undefined;
      const io = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            controls = animate(progress, 1, { duration: 0.9, ease: EASE });
            io.disconnect();
          }
        },
        { threshold: 0.15 },
      );
      io.observe(el);
      return () => {
        io.disconnect();
        controls?.stop();
      };
    }
  }, [mode, delay, progress, scrollProgress, reduceMotion]);

  const vw = Math.min(70, 45 * travel) * (from === 'left' ? -1 : 1);
  const x = useTransform(progress, [0, 1], [`${vw}vw`, '0vw']);
  const y = useTransform(progress, [0, 1], [48 * Math.min(travel, 1.6), 0]);
  const opacity = useTransform(progress, [0, 0.55], [0, 1]);

  const style = isMobile || from === 'below' ? { y, opacity } : { x, opacity };

  // The outer div never moves, so its position is a stable reference; only the inner div animates.
  return (
    <div ref={ref} className={className}>
      <motion.div style={style} className="h-full">
        {children}
      </motion.div>
    </div>
  );
}
