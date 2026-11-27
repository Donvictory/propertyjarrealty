'use client';

import { useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ArrowLeft, BriefcaseBusiness, KeyRound, Mail, X } from 'lucide-react';
import { GoogleButton } from '@/components/auth/fields';

type Role = 'client' | 'realtor';

const ROLE_COPY: Record<Role, { title: string; body: string; icon: typeof KeyRound; heading: string }> = {
  client: {
    title: 'Sign up as a Client',
    body: 'Buy or invest. Save listings and follow your payments.',
    icon: KeyRound,
    heading: 'Create your client account',
  },
  realtor: {
    title: 'Sign up as a Realtor',
    body: 'Refer clients with your link and track your commission.',
    icon: BriefcaseBusiness,
    heading: 'Create your realtor account',
  },
};

/** Where Google should send people back to: the page they started from. */
function googleHref(pathname: string | null, role: Role) {
  const next = pathname && !pathname.startsWith('/sign') ? pathname : '/account';
  return `/api/auth/google?next=${encodeURIComponent(next)}&role=${role}`;
}

/** Mobile menu: the two sign-up routes plus sign in (the role pages offer Google and email). */
export function GetStartedOptions({ onChoose }: { onChoose?: () => void }) {
  return (
    <div className="space-y-3">
      {(Object.keys(ROLE_COPY) as Role[]).map((role) => {
        const { title, icon: Icon } = ROLE_COPY[role];
        return (
          <Link
            key={role}
            href={`/sign-up/${role}`}
            onClick={onChoose}
            className={`btn-fill flex h-12 w-full items-center justify-center gap-3 text-sm font-medium ${
              role === 'client' ? 'btn-accent bg-ink text-paper' : 'btn-ink border border-line bg-paper'
            }`}
          >
            <Icon size={18} strokeWidth={1.5} aria-hidden />
            {title}
          </Link>
        );
      })}
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
 * Header "Get started": a centred modal. Step 1 picks Client or Realtor; step 2 offers Google or email
 * for that role. Native <dialog>: focus is trapped, Esc closes, the page behind is inert.
 */
export default function GetStarted() {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const pathname = usePathname();
  const [role, setRole] = useState<Role | null>(null);

  const open = () => {
    setRole(null);
    dialogRef.current?.showModal();
  };
  const close = () => dialogRef.current?.close();

  return (
    <>
      <button
        type="button"
        onClick={open}
        aria-haspopup="dialog"
        className="btn-fill btn-brand inline-flex h-11 items-center bg-brand px-7 text-sm font-medium text-on-brand outline-none"
      >
        Get started
      </button>

      <dialog
        ref={dialogRef}
        aria-labelledby="get-started-title"
        onClick={(e) => {
          if (e.target === dialogRef.current) close();
        }}
        className="get-started-modal m-auto w-[calc(100%-2rem)] max-w-[460px] bg-paper p-0 text-ink shadow-[0_30px_80px_rgba(28,28,27,0.35)] backdrop:bg-ink/60 backdrop:backdrop-blur-sm"
      >
        <div className="relative px-7 pb-8 pt-10 sm:px-10 sm:pb-10 sm:pt-12">
          {role && (
            <button
              type="button"
              onClick={() => setRole(null)}
              className="absolute left-3 top-3 flex h-10 items-center gap-1.5 px-2 text-sm text-muted hover:text-ink"
            >
              <ArrowLeft size={16} strokeWidth={1.5} aria-hidden />
              Back
            </button>
          )}
          <button
            type="button"
            onClick={close}
            aria-label="Close"
            className="absolute right-3 top-3 flex h-10 w-10 items-center justify-center text-muted hover:text-ink"
          >
            <X size={20} strokeWidth={1.5} />
          </button>

          <div className="text-center">
            <h2 id="get-started-title" className="text-3xl font-medium tracking-[-0.02em]">
              {role ? ROLE_COPY[role].heading : 'Create your account'}
            </h2>
            <p className="mx-auto mt-3 max-w-xs text-sm leading-relaxed text-muted">
              {role ? ROLE_COPY[role].body : 'How will you use PropertyJar?'}
            </p>
          </div>

          <div className="mt-8">
            {!role ? (
              <ul className="space-y-3">
                {(Object.keys(ROLE_COPY) as Role[]).map((r) => {
                  const { title, body, icon: Icon } = ROLE_COPY[r];
                  return (
                    <li key={r}>
                      <button
                        type="button"
                        onClick={() => setRole(r)}
                        className="rounded-xl group flex w-full items-start gap-4 border border-line bg-paper p-4 text-left transition-colors hover:border-ink"
                      >
                        <span className="icon-fill h-10 w-10 shrink-0 border border-line text-brand [--fill-bg:var(--color-brand)] [--fill-fg:#fff]">
                          <Icon size={18} strokeWidth={1.5} aria-hidden />
                        </span>
                        <span>
                          <span className="block font-medium">{title}</span>
                          <span className="mt-0.5 block text-sm text-muted">{body}</span>
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            ) : (
              <div className="space-y-3">
                <div onClick={close}>
                  <GoogleButton href={googleHref(pathname, role)} label="Sign up with Google" />
                </div>
                <Link
                  href={`/sign-up/${role}`}
                  onClick={close}
                  className="btn-fill btn-ink flex h-12 w-full items-center justify-center gap-3 border border-line bg-paper text-sm font-medium"
                >
                  <Mail size={18} strokeWidth={1.5} aria-hidden />
                  Sign up with email
                </Link>
              </div>
            )}
            <p className="pt-6 text-center text-sm text-muted">
              Already have an account?{' '}
              <Link href="/sign-in" onClick={close} className="font-medium text-brand underline-offset-4 hover:underline">
                Sign in
              </Link>
            </p>
          </div>

          <p className="mt-6 border-t border-line pt-5 text-center text-xs leading-relaxed text-muted">
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
