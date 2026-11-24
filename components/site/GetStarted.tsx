'use client';

import { useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Mail, X } from 'lucide-react';
import { GoogleButton } from '@/components/auth/fields';

/** Where Google should send people back to: the page they started from. */
function googleHref(pathname: string | null) {
  const next = pathname && !pathname.startsWith('/sign') ? pathname : '/account';
  return `/api/auth/google?next=${encodeURIComponent(next)}`;
}

/**
 * The sign-up choices, shared by the modal and the mobile menu.
 * Google is always offered; if it isn't configured yet, /api/auth/google sends people to sign-in
 * with a clear "Google sign-in isn't available" notice rather than an error.
 */
export function GetStartedOptions({ onChoose }: { onChoose?: () => void }) {
  const pathname = usePathname();
  return (
    <div className="space-y-3">
      <div onClick={onChoose}>
        <GoogleButton href={googleHref(pathname)} label="Sign up with Google" />
      </div>
      <Link
        href="/sign-up"
        onClick={onChoose}
        className="btn-fill btn-ink flex h-12 w-full items-center justify-center gap-3 border border-line bg-paper text-sm font-medium"
      >
        <Mail size={18} strokeWidth={1.5} aria-hidden />
        Sign up with email
      </Link>
      <p className="pt-3 text-center text-sm text-muted">
        Already have an account?{' '}
        <Link href="/sign-in" onClick={onChoose} className="font-medium text-brand underline-offset-4 hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  );
}

/**
 * Header "Get started": opens a centred modal to sign up with Google or email.
 * Uses the native <dialog>, so focus is trapped inside, Esc closes it and the page behind is inert.
 */
export default function GetStarted() {
  const dialogRef = useRef<HTMLDialogElement>(null);

  const open = () => dialogRef.current?.showModal();
  const close = () => dialogRef.current?.close();

  return (
    <>
      <button
        type="button"
        onClick={open}
        aria-haspopup="dialog"
        className="btn-fill btn-brand inline-flex h-11 items-center bg-brand px-7 text-sm font-medium text-white outline-none"
      >
        Get started
      </button>

      <dialog
        ref={dialogRef}
        aria-labelledby="get-started-title"
        onClick={(e) => {
          // A click on the backdrop lands on the <dialog> itself, not its content.
          if (e.target === dialogRef.current) close();
        }}
        className="get-started-modal m-auto w-[calc(100%-2rem)] max-w-[440px] bg-paper p-0 text-ink shadow-[0_30px_80px_rgba(28,28,27,0.35)] backdrop:bg-ink/60 backdrop:backdrop-blur-sm"
      >
        <div className="relative px-7 pb-8 pt-10 sm:px-10 sm:pb-10 sm:pt-12">
          <button
            type="button"
            onClick={close}
            aria-label="Close"
            className="absolute right-3 top-3 flex h-10 w-10 items-center justify-center text-muted hover:text-ink"
          >
            <X size={20} strokeWidth={1.5} />
          </button>

          <div className="text-center">
            <p className="eyebrow text-muted">PropertyJar Realty</p>
            <h2 id="get-started-title" className="mt-4 text-3xl font-medium tracking-[-0.02em]">
              Create your account
            </h2>
            <p className="mx-auto mt-3 max-w-xs text-sm leading-relaxed text-muted">
              Save properties, follow your enquiries and keep your plans in one place.
            </p>
          </div>

          <div className="mt-8">
            <GetStartedOptions onChoose={close} />
          </div>

          <p className="mt-8 border-t border-line pt-5 text-center text-xs leading-relaxed text-muted">
            By continuing you agree to our{' '}
            <Link href="/terms" onClick={close} className="underline underline-offset-4 hover:text-ink">
              Terms
            </Link>{' '}
            and{' '}
            <Link href="/privacy" onClick={close} className="underline underline-offset-4 hover:text-ink">
              Privacy policy
            </Link>
            .
          </p>
        </div>
      </dialog>
    </>
  );
}
