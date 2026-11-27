'use client';

import { useEffect, useSyncExternalStore } from 'react';
import { Moon, Sun } from 'lucide-react';

type Theme = 'light' | 'dark';

const THEME_KEY = 'pjr-theme';

function savedTheme(): Theme | null {
  try {
    const v = localStorage.getItem(THEME_KEY);
    return v === 'dark' || v === 'light' ? v : null;
  } catch {
    return null;
  }
}

/** The theme lives on <html data-theme> (set before paint in app/layout.tsx); this just watches it. */
function subscribe(onChange: () => void) {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
  return () => observer.disconnect();
}
const getTheme = (): Theme => (document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light');
// The server can't know the theme: render a neutral slot until hydrated.
const getServerTheme = () => null;

/**
 * Light / dark switch. The page starts on the system appearance and keeps following it until the visitor
 * picks one here; that choice is remembered on this device.
 */
export default function ThemeToggle({ className = '' }: { className?: string }) {
  const theme = useSyncExternalStore(subscribe, getTheme, getServerTheme);

  // Follow live system changes while the visitor hasn't chosen.
  useEffect(() => {
    const media = matchMedia('(prefers-color-scheme: dark)');
    const onSystemChange = (e: MediaQueryListEvent) => {
      if (!savedTheme()) document.documentElement.dataset.theme = e.matches ? 'dark' : 'light';
    };
    media.addEventListener('change', onSystemChange);
    return () => media.removeEventListener('change', onSystemChange);
  }, []);

  const toggle = () => {
    const next: Theme = getTheme() === 'dark' ? 'light' : 'dark';
    document.documentElement.dataset.theme = next;
    try {
      localStorage.setItem(THEME_KEY, next);
    } catch {
      // Storage blocked: the switch still applies for this visit.
    }
  };

  const dark = theme === 'dark';
  const label = dark ? 'Switch to light theme' : 'Switch to dark theme';

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={label}
      title={label}
      className={`btn-fill btn-ink flex h-11 w-11 items-center justify-center rounded-full border border-ink/20 text-ink ${className}`}
    >
      {theme === null ? (
        <span aria-hidden className="h-[18px] w-[18px]" />
      ) : dark ? (
        <Sun size={18} strokeWidth={1.5} aria-hidden />
      ) : (
        <Moon size={18} strokeWidth={1.5} aria-hidden />
      )}
    </button>
  );
}
