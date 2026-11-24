'use client';

import { useRef, useState } from 'react';
import Image from 'next/image';
import { Check, Copy, Download, QrCode, X } from 'lucide-react';

/** The printed campaign QR (same image as on existing marketing material) and the page it points to. */
const QR_IMAGE = '/qr_code.jpeg';
const CAMPAIGN_URL = 'https://propertyjarrealty.com/campaign';

/** Header button + centred modal to scan, download or copy the campaign QR. */
export default function QrShare() {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [copied, setCopied] = useState(false);

  const close = () => dialogRef.current?.close();

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(CAMPAIGN_URL);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard blocked: the link is visible to copy by hand.
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={() => dialogRef.current?.showModal()}
        aria-haspopup="dialog"
        aria-label="Share the campaign QR code"
        title="Campaign QR code"
        className="btn-fill btn-ink flex h-11 w-11 items-center justify-center rounded-full border border-ink/20 text-ink"
      >
        <QrCode size={18} strokeWidth={1.5} aria-hidden />
      </button>

      <dialog
        ref={dialogRef}
        aria-labelledby="qr-title"
        onClick={(e) => {
          if (e.target === dialogRef.current) close();
        }}
        className="get-started-modal m-auto w-[calc(100%-2rem)] max-w-[400px] bg-paper p-0 text-ink shadow-[0_30px_80px_rgba(28,28,27,0.35)] backdrop:bg-ink/60 backdrop:backdrop-blur-sm"
      >
        <div className="relative px-7 pb-8 pt-10 text-center sm:px-9">
          <button
            type="button"
            onClick={close}
            aria-label="Close"
            className="absolute right-3 top-3 flex h-10 w-10 items-center justify-center text-muted hover:text-ink"
          >
            <X size={20} strokeWidth={1.5} />
          </button>

          <p className="eyebrow text-muted">Share</p>
          <h2 id="qr-title" className="mt-3 text-3xl font-medium tracking-[-0.02em]">
            Campaign QR
          </h2>
          <p className="mx-auto mt-3 max-w-xs text-sm leading-relaxed text-muted">
            Scan or download this code to open our investment campaign.
          </p>

          <div className="rounded-xl mx-auto mt-7 w-fit border border-line bg-white p-4">
            <Image
              src={QR_IMAGE}
              alt="QR code linking to propertyjarrealty.com/campaign"
              width={208}
              height={208}
              // Lazy loading never fires inside a closed <dialog>; the image is tiny, so load it up front.
              loading="eager"
              className="h-52 w-52 rounded-none object-contain"
            />
          </div>

          <a
            href={QR_IMAGE}
            download="propertyjar-campaign-qr.jpeg"
            className="btn-fill btn-brand mt-7 flex h-12 w-full items-center justify-center gap-2 bg-brand text-sm font-medium text-white"
          >
            <Download size={18} strokeWidth={1.75} aria-hidden />
            Download QR image
          </a>

          <div className="mt-3 flex">
            <input
              readOnly
              value={CAMPAIGN_URL}
              aria-label="Campaign link"
              onFocus={(e) => e.currentTarget.select()}
              className="h-12 min-w-0 flex-1 rounded-l-lg border border-r-0 border-line bg-paper px-3 text-left text-sm text-muted focus:outline-none"
            />
            <button
              type="button"
              onClick={copy}
              className="btn-fill btn-accent flex h-12 shrink-0 items-center gap-2 !rounded-l-none bg-ink px-4 text-sm font-medium text-paper"
            >
              {copied ? <Check size={16} aria-hidden /> : <Copy size={16} aria-hidden />}
              {copied ? 'Copied' : 'Copy'}
            </button>
          </div>
          <p className="sr-only" aria-live="polite">
            {copied ? 'Link copied' : ''}
          </p>
        </div>
      </dialog>
    </>
  );
}
