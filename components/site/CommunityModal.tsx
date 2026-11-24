'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { Users, X } from 'lucide-react';
import { dismissCommunityPrompt, useMe } from '@/lib/use-me';

export const WHATSAPP_COMMUNITY_URL = 'https://chat.whatsapp.com/FfyrsnS2nWULdzfc4PBXn0';

/** Screens where the invite would get in the way (the person is mid sign-in / sign-up). */
const HIDE_ON = ['/sign-in', '/sign-up', '/sign-up/client', '/sign-up/realtor', '/forgot-password', '/reset-password', '/check-email', '/signed-out'];

/**
 * Once a member is signed in, invite them to the WhatsApp community. Shown once per account:
 * joining or choosing "Maybe later" records the answer on the account, on every device.
 */
export default function CommunityModal() {
  const me = useMe();
  const pathname = usePathname();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const shouldShow = Boolean(me.user && me.showCommunityPrompt && !HIDE_ON.includes(pathname ?? ''));

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (shouldShow && !dialog.open) {
      // A beat after the page settles, so it doesn't fight the page's own entrance.
      const t = setTimeout(() => dialog.showModal(), 700);
      return () => clearTimeout(t);
    }
    if (!shouldShow && dialog.open) dialog.close();
  }, [shouldShow]);

  const answer = () => {
    dialogRef.current?.close();
    dismissCommunityPrompt();
  };


  return (
    <dialog
      ref={dialogRef}
      aria-labelledby="community-title"
      // Esc counts as "maybe later".
      onCancel={answer}
      onClick={(e) => {
        if (e.target === dialogRef.current) answer();
      }}
      className="get-started-modal m-auto w-[calc(100%-2rem)] max-w-[460px] bg-paper p-0 text-ink shadow-[0_30px_80px_rgba(28,28,27,0.35)] backdrop:bg-ink/60 backdrop:backdrop-blur-sm"
    >
      <div className="relative overflow-hidden">
        <div className="relative bg-ink px-8 pb-10 pt-12 text-center text-paper">
          <button
            type="button"
            onClick={answer}
            aria-label="Close"
            className="absolute right-3 top-3 flex h-10 w-10 items-center justify-center text-paper/60 hover:text-paper"
          >
            <X size={20} strokeWidth={1.5} />
          </button>
          <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#25D366] text-white">
            <Users size={28} strokeWidth={1.75} aria-hidden />
          </span>
          <h2 id="community-title" className="mt-6 text-3xl font-medium tracking-[-0.02em]">
            Join our WhatsApp community
          </h2>
        </div>

        <div className="px-8 pb-8 pt-7 sm:px-10">
          <p className="text-center leading-relaxed text-muted">
            Be first to hear about new listings, investment opportunities and site inspections, and ask our team
            questions directly.
          </p>
          <div className="mt-7 space-y-3">
            <a
              href={WHATSAPP_COMMUNITY_URL}
              target="_blank"
              rel="noopener noreferrer"
              onClick={answer}
              className="btn-fill btn-ink flex h-12 w-full items-center justify-center gap-3 bg-[#25D366] text-sm font-semibold text-white [--fill-bg:#1da851] [--fill-fg:#fff]"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden fill="currentColor">
                <path d="M17.47 14.38c-.3-.15-1.75-.86-2.02-.96-.27-.1-.47-.15-.67.15-.2.3-.77.96-.94 1.16-.17.2-.35.22-.64.07-.3-.15-1.25-.46-2.38-1.47-.88-.79-1.47-1.76-1.65-2.06-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.61-.92-2.2-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48s1.07 2.88 1.21 3.08c.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.69.63.71.23 1.36.2 1.87.12.57-.09 1.75-.72 2-1.41.25-.69.25-1.29.17-1.41-.07-.12-.27-.2-.57-.35M12.05 21.8h-.01a9.87 9.87 0 0 1-5.03-1.38l-.36-.21-3.74.98 1-3.65-.24-.37a9.86 9.86 0 0 1-1.51-5.26c0-5.45 4.44-9.88 9.89-9.88a9.82 9.82 0 0 1 6.99 2.9 9.82 9.82 0 0 1 2.89 6.99c0 5.45-4.44 9.88-9.88 9.88m8.41-18.3A11.81 11.81 0 0 0 12.05 0C5.5 0 .16 5.34.16 11.89c0 2.1.55 4.14 1.59 5.95L.06 24l6.3-1.65a11.88 11.88 0 0 0 5.68 1.45h.01c6.55 0 11.89-5.34 11.89-11.89 0-3.18-1.24-6.16-3.48-8.41" />
              </svg>
              Join on WhatsApp
            </a>
            <button
              type="button"
              onClick={answer}
              className="btn-fill btn-ink flex h-12 w-full items-center justify-center border border-line text-sm font-medium"
            >
              Maybe later
            </button>
          </div>
          <p className="mt-5 text-center text-xs text-muted">You can also find the link in the footer any time.</p>
        </div>
      </div>
    </dialog>
  );
}
