import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { Suspense } from 'react';
import SignedOutMessage from '@/components/auth/SignedOutMessage';

export const metadata: Metadata = { title: 'Signed out', robots: { index: false, follow: false } };

export default function SignedOutPage() {
  return (
    <main className="flex min-h-[calc(100svh-5rem)] items-center bg-ink text-paper">
      <div className="shell py-20">
        <div className="mx-auto max-w-lg text-center">
          <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-paper">
            <Image src="/brand/pjr-mark.png" alt="" width={48} height={48} className="h-12 w-12 rounded-none" />
          </span>
          <p className="eyebrow mt-10 text-paper/60">Signed out</p>
          <div className="[&_p]:text-paper/70">
            <Suspense
              fallback={
                <h1 className="mt-4 text-4xl font-medium leading-[1.08] tracking-[-0.025em] lg:text-[44px]">
                  You have signed out.
                </h1>
              }
            >
              <SignedOutMessage />
            </Suspense>
          </div>
          <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              href="/sign-in"
              className="btn-fill btn-paper inline-flex h-12 items-center justify-center border border-paper/40 px-8 text-sm font-medium"
            >
              Sign in again
            </Link>
            <Link
              href="/"
              className="btn-fill btn-brand inline-flex h-12 items-center justify-center bg-brand px-8 text-sm font-medium text-white"
            >
              Back to home
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
