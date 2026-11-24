'use client';

import { useState, useSyncExternalStore } from 'react';

const noopSubscribe = () => () => {};
import { Check, Copy, Share2 } from 'lucide-react';

/** Read-only link with Copy (and Share, where the device supports it). */
export default function CopyLink({ url, shareText }: { url: string; shareText: string }) {
  const [copied, setCopied] = useState(false);
  // Server snapshot is false; the browser value takes over after hydration without a mismatch.
  const canShare = useSyncExternalStore(noopSubscribe, () => 'share' in navigator, () => false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      // Older browsers: select the text so the user can copy it themselves.
      const input = document.getElementById('referral-link') as HTMLInputElement | null;
      input?.select();
      return;
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div>
      <div className="flex">
        <input
          id="referral-link"
          readOnly
          value={url}
          onFocus={(e) => e.currentTarget.select()}
          aria-label="Your referral link"
          className="h-12 min-w-0 flex-1 border border-r-0 border-line bg-paper px-4 text-sm text-ink focus:outline-none"
        />
        <button
          type="button"
          onClick={copy}
          className="btn-fill btn-accent flex h-12 shrink-0 items-center gap-2 bg-ink px-5 text-sm font-medium text-paper"
        >
          {copied ? <Check size={16} aria-hidden /> : <Copy size={16} aria-hidden />}
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>
      {canShare && (
        <button
          type="button"
          onClick={() => void navigator.share({ title: 'PropertyJar Realty', text: shareText, url }).catch(() => {})}
          className="btn-fill btn-ink mt-3 flex h-11 w-full items-center justify-center gap-2 border border-line text-sm font-medium"
        >
          <Share2 size={16} aria-hidden />
          Share link
        </button>
      )}
      <p className="sr-only" aria-live="polite">
        {copied ? 'Link copied' : ''}
      </p>
    </div>
  );
}
