'use client';

import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { refreshMe } from '@/lib/use-me';

const MESSAGES = {
  deleted: {
    title: 'Your account has been deleted.',
    body: 'Your details and saved properties have been removed. You are welcome back any time.',
  },
  everywhere: {
    title: 'Signed out everywhere.',
    body: 'You have been signed out on this device and every other device that was signed in.',
  },
  default: {
    title: 'You have signed out.',
    body: 'Thanks for visiting. Your saved properties will be here when you sign back in.',
  },
};

export function useSignedOutMessage() {
  const q = useSearchParams();
  return q.get('deleted') ? MESSAGES.deleted : q.get('everywhere') ? MESSAGES.everywhere : MESSAGES.default;
}

/** Heading + text for the signed-out screen; also tells the header the session is gone. */
export default function SignedOutMessage() {
  const m = useSignedOutMessage();
  useEffect(() => {
    void refreshMe();
  }, []);
  return (
    <>
      <h1 className="mt-4 text-4xl font-medium leading-[1.08] tracking-[-0.025em] lg:text-[44px]">{m.title}</h1>
      <p className="mt-4 leading-relaxed text-muted">{m.body}</p>
    </>
  );
}
