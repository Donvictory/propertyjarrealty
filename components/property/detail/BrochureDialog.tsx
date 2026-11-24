'use client';

import { useRef, useState } from 'react';
import { sendPropertyInquiry } from '@/app/actions/leads';

type Props = {
  brochureUrl: string;
  propertyTitle: string;
  propertyLocation: string;
  className?: string;
};

function fileNameFor(url: string, title: string) {
  const last = decodeURIComponent(url.split('/').pop() || '');
  return last.toLowerCase().endsWith('.pdf') ? last : `${title.replace(/\s+/g, '_')}_Brochure.pdf`;
}

async function downloadFile(url: string, fileName: string) {
  try {
    // Fetching as a blob forces a download (the download attribute is ignored cross-origin).
    const res = await fetch(url);
    if (!res.ok) throw new Error(String(res.status));
    const blobUrl = URL.createObjectURL(await res.blob());
    const a = Object.assign(document.createElement('a'), { href: blobUrl, download: fileName });
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(blobUrl);
  } catch {
    window.open(url, '_blank', 'noopener');
  }
}

export default function BrochureDialog({ brochureUrl, propertyTitle, propertyLocation, className = '' }: Props) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [status, setStatus] = useState<'idle' | 'submitting' | 'done'>('idle');
  const [error, setError] = useState<string | null>(null);
  const fileName = fileNameFor(brochureUrl, propertyTitle);

  const open = () => {
    setError(null);
    dialogRef.current?.showModal();
  };
  const close = () => {
    if (status === 'submitting') return;
    dialogRef.current?.close();
    if (status === 'done') setStatus('idle');
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setStatus('submitting');
    const data = new FormData(e.currentTarget);
    data.set('propertyTitle', propertyTitle);
    data.set('propertyLocation', propertyLocation);

    const result = await sendPropertyInquiry(data);
    if (!result.success) {
      setStatus('idle');
      setError(result.error ?? 'Something went wrong. Please try again.');
      return;
    }
    setStatus('done');
    void downloadFile(brochureUrl, fileName);
  };

  const input =
    'mt-2 h-12 w-full border border-line bg-paper px-4 text-[15px] placeholder:text-muted/70 focus:border-ink focus:outline-none';

  return (
    <>
      <button
        type="button"
        onClick={open}
        className={`flex h-12 w-full items-center justify-between bg-brand px-4 text-sm font-medium text-white btn-fill btn-brand ${className}`}
      >
        Download brochure
        <span aria-hidden>↓</span>
      </button>

      <dialog
        ref={dialogRef}
        onCancel={(e) => {
          if (status === 'submitting') e.preventDefault();
        }}
        onClose={() => status === 'done' && setStatus('idle')}
        onClick={(e) => {
          if (e.target === dialogRef.current) close();
        }}
        aria-labelledby="brochure-title"
        className="m-auto w-[calc(100%-2rem)] max-w-lg bg-paper p-0 text-ink backdrop:bg-ink/70 backdrop:backdrop-blur-sm"
      >
        <div className="relative p-7 sm:p-10">
          <button
            type="button"
            onClick={close}
            aria-label="Close"
            className="absolute right-4 top-4 h-10 w-10 text-xl text-muted hover:text-ink"
          >
            ×
          </button>

          {status === 'done' ? (
            <div role="status">
              <p className="eyebrow text-muted">Brochure</p>
              <h2 id="brochure-title" className="mt-4 text-3xl font-medium tracking-[-0.02em]">
                Your download has started.
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-muted">
                Our team will follow up by email about {propertyTitle}. If the file didn&rsquo;t download,{' '}
                <a href={brochureUrl} download={fileName} target="_blank" rel="noopener" className="text-brand underline underline-offset-4">
                  open the brochure
                </a>
                .
              </p>
              <button
                type="button"
                onClick={close}
                className="mt-8 h-12 w-full border border-ink text-sm font-medium btn-fill btn-ink"
              >
                Close
              </button>
            </div>
          ) : (
            <form onSubmit={onSubmit}>
              <p className="eyebrow text-muted">{propertyTitle}</p>
              <h2 id="brochure-title" className="mt-4 text-3xl font-medium tracking-[-0.02em]">
                Download the brochure
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-muted">
                Tell us where to follow up and the PDF will download straight away.
              </p>

              <div className="mt-8 space-y-5">
                <label className="block text-sm font-medium">
                  Full name
                  <input name="fullName" required autoComplete="name" placeholder="e.g. Ada Okafor" className={input} />
                </label>
                <label className="block text-sm font-medium">
                  Email
                  <input name="email" type="email" required autoComplete="email" placeholder="you@example.com" className={input} />
                </label>
                <label className="block text-sm font-medium">
                  Phone <span className="font-normal text-muted">(optional)</span>
                  <input name="phone" type="tel" autoComplete="tel" placeholder="+234" className={input} />
                </label>
              </div>

              {error && (
                <p role="alert" className="mt-5 text-sm text-brand">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={status === 'submitting'}
                className="mt-8 flex h-12 w-full items-center justify-center bg-brand text-sm font-medium text-white btn-fill btn-brand disabled:opacity-60"
              >
                {status === 'submitting' ? 'Preparing your download…' : 'Download PDF'}
              </button>
              <p className="mt-4 text-xs text-muted">We only use your details to follow up about this property.</p>
            </form>
          )}
        </div>
      </dialog>
    </>
  );
}
