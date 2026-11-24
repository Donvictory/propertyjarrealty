'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { sendContactEmail } from '@/app/actions/contact';

const BASE_SUBJECTS = [
  'General Enquiry',
  'Property Purchase',
  'Property Sale / Listing',
  'Investment Advisory',
  'Property Management',
];

const input =
  'mt-2 h-12 w-full border border-line bg-paper px-4 text-[15px] text-ink placeholder:text-muted/70 focus:border-ink focus:outline-none';
const label = 'block text-sm font-medium';

/**
 * Reads ?subject= in the browser (e.g. from a service's "Enquire" link) so the page itself
 * can stay statically prerendered. Must be rendered inside <Suspense>; use <ContactForm />
 * as the fallback so the prerendered HTML still contains the full form.
 */
export function ContactFormFromUrl() {
  const subject = useSearchParams().get('subject')?.trim().slice(0, 80) || undefined;
  return <ContactForm defaultSubject={subject} />;
}

export default function ContactForm({ defaultSubject }: { defaultSubject?: string }) {
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent'>('idle');
  const [error, setError] = useState('');

  // A subject passed from another page (e.g. a service's "Enquire" link) is added if it isn't a standard one.
  const subjects =
    defaultSubject && !BASE_SUBJECTS.includes(defaultSubject) ? [defaultSubject, ...BASE_SUBJECTS] : BASE_SUBJECTS;

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus('sending');
    setError('');
    const result = await sendContactEmail(new FormData(e.currentTarget));
    if (result.success) {
      setStatus('sent');
    } else {
      setStatus('idle');
      setError(result.error || 'Something went wrong. Please try again.');
    }
  }

  if (status === 'sent') {
    return (
      <div role="status">
        <p className="eyebrow text-muted">Message sent</p>
        <h2 className="mt-4 text-3xl font-medium tracking-[-0.02em]">Thank you for reaching out.</h2>
        <p className="mt-4 leading-relaxed text-muted">One of our advisors will be in touch within 24 hours.</p>
        <button
          type="button"
          onClick={() => setStatus('idle')}
          className="btn-fill btn-ink mt-8 h-12 border border-ink px-6 text-sm font-medium"
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit}>
      <div className="grid gap-5 sm:grid-cols-2">
        <label className={label}>
          First name
          <input name="firstName" required autoComplete="given-name" className={input} />
        </label>
        <label className={label}>
          Last name
          <input name="lastName" required autoComplete="family-name" className={input} />
        </label>
      </div>
      <label className={`${label} mt-5`}>
        Email address
        <input name="email" type="email" required autoComplete="email" className={input} />
      </label>
      <label className={`${label} mt-5`}>
        Phone <span className="font-normal text-muted">(optional)</span>
        <input name="phone" type="tel" autoComplete="tel" placeholder="+234" className={input} />
      </label>
      <label className={`${label} mt-5`}>
        Subject
        <select name="subject" defaultValue={defaultSubject ?? BASE_SUBJECTS[0]} className={`${input} appearance-none`}>
          {subjects.map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>
      </label>
      <label className={`${label} mt-5`}>
        Message
        <textarea
          name="message"
          required
          rows={6}
          placeholder="Tell us about your requirements…"
          className={`${input} h-auto resize-y py-3`}
        />
      </label>

      {error && (
        <p role="alert" className="mt-5 text-sm text-brand">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={status === 'sending'}
        className="btn-fill btn-brand mt-8 flex h-12 w-full items-center bg-brand px-4 text-sm font-medium text-white disabled:opacity-60"
      >
        {status === 'sending' ? 'Sending…' : 'Send message'}
      </button>
      <p className="mt-5 text-xs text-muted">
        Your details are used to respond to this enquiry. Read our{' '}
        <Link href="/privacy" className="underline underline-offset-4 hover:text-ink">
          Privacy policy
        </Link>
        .
      </p>
    </form>
  );
}
