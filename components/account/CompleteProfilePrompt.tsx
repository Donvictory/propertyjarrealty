'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { Landmark, X } from 'lucide-react';

/**
 * Shown to realtors whose payout details are missing: opens as a centred modal each time they land on
 * the dashboard or Profile, until the details are saved. "Later" just closes it for this visit.
 * On the Profile page the action scrolls to the form instead of navigating.
 */
export default function CompleteProfilePrompt({ onProfilePage = false }: { onProfilePage?: boolean }) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const t = setTimeout(() => ref.current?.showModal(), 500);
    return () => clearTimeout(t);
  }, []);

  const close = () => ref.current?.close();
  const goToForm = () => {
    close();
    const section = document.getElementById('payout-details');
    section?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    section?.querySelector<HTMLElement>('select, input')?.focus({ preventScroll: true });
  };

  return (
    <dialog
      ref={ref}
      aria-labelledby="complete-profile-title"
      onClick={(e) => {
        if (e.target === ref.current) close();
      }}
      className="get-started-modal m-auto w-[calc(100%-2rem)] max-w-[440px] bg-paper p-0 text-ink shadow-[0_30px_80px_rgba(28,28,27,0.35)] backdrop:bg-ink/60 backdrop:backdrop-blur-sm"
    >
      <div className="relative px-7 pb-8 pt-10 text-center sm:px-10">
        <button
          type="button"
          onClick={close}
          aria-label="Close"
          className="absolute right-3 top-3 flex h-10 w-10 items-center justify-center text-muted hover:text-ink"
        >
          <X size={20} strokeWidth={1.5} />
        </button>
        <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-brand text-white">
          <Landmark size={24} strokeWidth={1.5} aria-hidden />
        </span>
        <h2 id="complete-profile-title" className="mt-6 text-3xl font-medium tracking-[-0.02em]">
          Complete your profile
        </h2>
        <p className="mx-auto mt-3 max-w-xs text-sm leading-relaxed text-muted">
          Add your bank details, date of birth and house address so we can pay your commission when your clients
          close a deal.
        </p>
        <div className="mt-8 space-y-3">
          {onProfilePage ? (
            <button
              type="button"
              autoFocus
              onClick={goToForm}
              className="btn-fill btn-brand flex h-12 w-full items-center justify-center bg-brand text-sm font-medium text-white"
            >
              Complete now
            </button>
          ) : (
            <Link
              href="/account/profile#payout-details"
              autoFocus
              onClick={close}
              className="btn-fill btn-brand flex h-12 w-full items-center justify-center bg-brand text-sm font-medium text-white"
            >
              Complete now
            </Link>
          )}
          <button
            type="button"
            onClick={close}
            className="btn-fill btn-ink flex h-12 w-full items-center justify-center border border-line text-sm font-medium"
          >
            Later
          </button>
        </div>
      </div>
    </dialog>
  );
}
