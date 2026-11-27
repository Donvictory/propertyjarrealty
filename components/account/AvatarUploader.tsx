'use client';

import { useEffect, useRef, useState, useTransition } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Camera } from 'lucide-react';
import { removeAvatarAction, uploadAvatarAction } from '@/app/actions/account';
import { refreshMe } from '@/lib/use-me';

const initialsOf = (name: string) =>
  name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join('') || '•';

/**
 * Shrinks a photo in the browser before upload (keeps the request well under the server-action
 * body limit and saves data on mobile). The server re-encodes it again regardless.
 */
async function downscale(file: File, max = 640): Promise<Blob> {
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, max / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement('canvas');
  canvas.width = Math.round(bitmap.width * scale);
  canvas.height = Math.round(bitmap.height * scale);
  canvas.getContext('2d')!.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  bitmap.close();
  return new Promise((resolve, reject) =>
    canvas.toBlob((b) => (b ? resolve(b) : reject(new Error('encode failed'))), 'image/jpeg', 0.9),
  );
}

/** Profile photo in the account header: the photo (or initials) with a camera badge; tap to add, change or remove. */
export default function AvatarUploader({ name, avatarUrl }: { name: string; avatarUrl: string | null }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const [pending, start] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  // Close the photo menu on outside click or Escape.
  useEffect(() => {
    if (!menuOpen) return;
    const onDown = (e: PointerEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) setMenuOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setMenuOpen(false);
    document.addEventListener('pointerdown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('pointerdown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [menuOpen]);

  const onPick = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    setError(null);
    start(async () => {
      let upload: Blob = file;
      try {
        upload = await downscale(file);
      } catch {
        // Some formats (e.g. HEIC on Chrome) can't be decoded in the browser; send the original if small.
        if (file.size > 900 * 1024) {
          setError('That photo format isn’t supported. Use a JPG or PNG.');
          return;
        }
      }
      const data = new FormData();
      data.set('photo', new File([upload], 'photo.jpg', { type: upload.type || file.type }));
      const res = await uploadAvatarAction(data);
      if (!res.ok) {
        setError(res.error ?? 'Upload failed. Try again.');
        return;
      }
      router.refresh();
      void refreshMe();
    });
  };

  const remove = () =>
    start(async () => {
      await removeAvatarAction();
      router.refresh();
      void refreshMe();
    });

  const openPicker = () => {
    setMenuOpen(false);
    inputRef.current?.click();
  };

  return (
    <div ref={wrapRef} className="relative h-20 w-20 shrink-0 lg:h-24 lg:w-24">
      <button
        type="button"
        onClick={() => (avatarUrl ? setMenuOpen((o) => !o) : openPicker())}
        disabled={pending}
        aria-label={avatarUrl ? 'Profile photo options' : 'Add a profile photo'}
        aria-haspopup={avatarUrl ? 'menu' : undefined}
        aria-expanded={avatarUrl ? menuOpen : undefined}
        className="group relative block h-full w-full overflow-hidden rounded-full border border-paper/25 bg-ink-raised outline-none focus-visible:ring-2 focus-visible:ring-paper focus-visible:ring-offset-2 focus-visible:ring-offset-ink"
      >
        {avatarUrl ? (
          <Image src={avatarUrl} alt="" fill sizes="96px" className="rounded-none object-cover" />
        ) : (
          <span className="flex h-full w-full items-center justify-center text-2xl font-medium tracking-wide">
            {initialsOf(name)}
          </span>
        )}
        {pending && (
          <span aria-hidden className="absolute inset-0 flex items-center justify-center bg-ink/55">
            <span className="h-5 w-5 animate-spin rounded-full border-2 border-paper/40 border-t-paper" />
          </span>
        )}
      </button>

      {/* Camera badge on the photo instead of text links beside it. */}
      <span
        aria-hidden
        className="pointer-events-none absolute -bottom-0.5 -right-0.5 flex h-8 w-8 items-center justify-center rounded-full border-2 border-ink bg-brand text-on-brand lg:h-9 lg:w-9"
      >
        <Camera size={15} strokeWidth={2} />
      </span>

      {menuOpen && avatarUrl && (
        <div
          role="menu"
          aria-label="Profile photo"
          className="absolute left-0 top-full z-20 mt-3 w-44 overflow-hidden rounded-xl border border-line bg-paper p-1 text-sm text-ink shadow-[0_16px_40px_rgba(28,28,27,0.25)]"
        >
          <button type="button" role="menuitem" onClick={openPicker} className="block w-full rounded-lg px-3 py-2.5 text-left hover:bg-panel">
            Change photo
          </button>
          <button
            type="button"
            role="menuitem"
            onClick={() => {
              setMenuOpen(false);
              remove();
            }}
            className="block w-full rounded-lg px-3 py-2.5 text-left text-brand hover:bg-panel"
          >
            Remove photo
          </button>
        </div>
      )}

      {error && (
        <p role="alert" className="absolute left-0 top-full mt-3 w-60 text-xs text-[#f0b4bf]">
          {error}
        </p>
      )}
      <input ref={inputRef} type="file" accept="image/jpeg,image/png,image/webp" hidden onChange={onPick} />
    </div>
  );
}
