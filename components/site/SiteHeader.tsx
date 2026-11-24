'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { X } from 'lucide-react';
import Logo from './Logo';
import { useMe } from '@/lib/use-me';
import { signOutAction } from '@/app/actions/account';
import GetStarted, { GetStartedOptions } from './GetStarted';
import QrShare from './QrShare';

function initialsOf(name: string) {
  return name.split(' ').filter(Boolean).slice(0, 2).map((w) => w[0]?.toUpperCase()).join('') || '•';
}

export const NAV_LINKS = [
  { name: 'Home', href: '/' },
  { name: 'Properties', href: '/properties' },
  { name: 'Investments', href: '/campaign' },
  { name: 'Services', href: '/services' },
  { name: 'About', href: '/about' },
  { name: 'Contact', href: '/contact' },
];

function isActive(pathname: string | null, href: string) {
  if (!pathname) return false;
  // Every path starts with "/", so Home only matches exactly.
  if (href === '/') return pathname === '/';
  return pathname === href || pathname.startsWith(`${href}/`);
}

export default function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const closeMenu = useCallback(() => {
    setOpen(false);
    menuButtonRef.current?.focus();
  }, []);

  return (
    <>
    <header className="fixed inset-x-0 top-0 z-50 border-b border-line bg-paper/95 backdrop-blur-md">
      <div className="shell flex h-20 items-center justify-between gap-6">
        <Logo />

        <nav aria-label="Main" className="hidden lg:block">
          <ul className="flex items-center gap-1 xl:gap-5">
            {NAV_LINKS.map((link) => {
              const active = isActive(pathname, link.href);
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    aria-current={active ? 'page' : undefined}
                    className={`btn-fill btn-accent inline-flex px-4 py-2.5 text-sm outline-none ${
                      active ? 'text-brand' : 'text-ink'
                    }`}
                  >
                    {link.name}
                    {active && <span aria-hidden className="absolute inset-x-4 bottom-1 h-px bg-current" />}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Right side: one QR button for every size, then the account button (desktop) or menu (mobile). */}
        <div className="flex items-center gap-3">
          <QrShare />
          <div className="hidden lg:block">
            <AccountButton />
          </div>

        <button
          ref={menuButtonRef}
          type="button"
          onClick={() => setOpen(true)}
          aria-expanded={open}
          aria-controls="mobile-nav"
          aria-label="Open menu"
          className="btn-fill btn-ink group/menu flex h-11 w-11 flex-col items-center justify-center gap-[6px] rounded-full border border-ink/20 text-ink lg:hidden"
        >
          {/* Two hairlines, the lower one shorter; it extends to full length on hover. */}
          <span aria-hidden className="block h-px w-[18px] bg-current" />
          <span
            aria-hidden
            className="block h-px w-[10px] translate-x-[4px] bg-current transition-[width,transform] duration-300 ease-out group-hover/menu:w-[18px] group-hover/menu:translate-x-0"
          />
        </button>
        </div>
      </div>
    </header>

    {/* Rendered outside <header>: its backdrop-blur would otherwise trap position:fixed children. */}
    <MobileMenu
      open={open}
      pathname={pathname}
      onClose={closeMenu}
    />
    </>
  );
}

/** Bottom sheet: slides up from the bottom, stops at ~78% of the screen, swipe down or tap outside to close. */
function MobileMenu({ open, pathname, onClose }: { open: boolean; pathname: string | null; onClose: () => void }) {
  const sheetRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    // Lock page scroll behind the sheet.
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    sheetRef.current?.querySelector<HTMLElement>('a, button')?.focus();
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [open, onClose]);

  const slide = reduceMotion ? { duration: 0 } : { type: 'spring' as const, stiffness: 380, damping: 38 };

  return (
    <AnimatePresence>
      {open && (
        <div className="lg:hidden">
          <motion.div
            aria-hidden
            className="fixed inset-0 z-[60] bg-ink/55"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduceMotion ? 0 : 0.25 }}
            onClick={onClose}
          />
          <motion.div
            ref={sheetRef}
            id="mobile-nav"
            role="dialog"
            aria-modal="true"
            aria-label="Menu"
            className="fixed inset-x-0 bottom-0 z-[61] flex max-h-[78svh] flex-col rounded-t-[20px] bg-paper pb-[max(1.25rem,env(safe-area-inset-bottom))] shadow-[0_-12px_40px_rgba(28,28,27,0.18)]"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={slide}
            drag={reduceMotion ? false : 'y'}
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={{ top: 0, bottom: 0.6 }}
            onDragEnd={(_, info) => {
              if (info.offset.y > 90 || info.velocity.y > 500) onClose();
            }}
          >
            <div className="flex justify-center pt-3" aria-hidden>
              <span className="h-1 w-10 rounded-full bg-line" />
            </div>
            <div className="flex items-center justify-between px-5 pb-2 pt-3">
              <p className="eyebrow text-muted">Menu</p>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close menu"
                className="-mr-2 flex h-11 w-11 items-center justify-center text-ink"
              >
                <X size={22} strokeWidth={1.5} />
              </button>
            </div>

            <nav aria-label="Mobile" className="overflow-y-auto px-5">
              <ul className="divide-y divide-line border-y border-line">
                {NAV_LINKS.map((link) => {
                  const active = isActive(pathname, link.href);
                  return (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        onClick={onClose}
                        aria-current={active ? 'page' : undefined}
                        className={`btn-fill btn-accent flex items-center justify-between px-2 py-4 text-2xl font-medium tracking-[-0.01em] ${
                          active ? 'text-brand' : 'text-ink'
                        }`}
                      >
                        {link.name}
                        {active && <span aria-hidden className="h-1.5 w-1.5 bg-current" />}
                      </Link>
                    </li>
                  );
                })}
              </ul>
              <MobileAccountActions onClose={onClose} />
              <a
                href="https://wa.me/2349153869750"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 block pb-1 text-center text-sm text-muted underline-offset-4 hover:underline"
              >
                Chat with us on WhatsApp
              </a>
            </nav>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

/** Desktop: "Sign in", or the signed-in user's initials + "Account". Holds its width while loading. */
function AccountButton() {
  const me = useMe();
  if (me.status === 'loading') {
    return <span aria-hidden className="inline-block h-11 w-[132px] bg-line/40" />;
  }
  if (!me.user) return <GetStarted />;
  const first = me.user.name.split(' ')[0] || me.user.name;
  return (
    <Link
      href="/account"
      aria-label={`${me.user.name}, open your account`}
      title={me.user.name}
      className="btn-fill btn-ink inline-flex h-11 max-w-[200px] items-center gap-3 border border-line bg-paper pl-1.5 pr-5 text-sm font-medium text-ink outline-none"
    >
      <span
        aria-hidden
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand text-[11px] font-semibold tracking-wide text-white"
      >
        {initialsOf(me.user.name)}
      </span>
      <span className="truncate">{first}</span>
    </Link>
  );
}

/** Mobile sheet footer: Sign in, or Account + Sign out. */
function MobileAccountActions({ onClose }: { onClose: () => void }) {
  const me = useMe();
  if (!me.user) {
    return (
      <div className="mt-5">
        <GetStartedOptions onChoose={onClose} />
      </div>
    );
  }
  return (
    <div className="mt-5 grid grid-cols-2 gap-3">
      <Link
        href="/account"
        onClick={onClose}
        className="btn-fill btn-accent flex h-12 items-center justify-center bg-ink text-sm font-medium text-paper"
      >
        Your account
      </Link>
      <form action={signOutAction}>
        <button
          type="submit"
          className="btn-fill btn-ink flex h-12 w-full items-center justify-center border border-line text-sm font-medium"
        >
          Sign out
        </button>
      </form>
    </div>
  );
}
