'use client';

import { useSyncExternalStore } from 'react';

/*
 * Client-side view of "who is signed in", shared by the header and every heart button.
 * One /api/me request per page load; saves update the store optimistically.
 */

export type Me = {
  status: 'loading' | 'ready';
  user: { name: string; email: string } | null;
  savedIds: string[];
  /** Signed in and hasn't answered the WhatsApp community invite yet. */
  showCommunityPrompt: boolean;
};

let state: Me = { status: 'loading', user: null, savedIds: [], showCommunityPrompt: false };
let inflight: Promise<void> | null = null;
const listeners = new Set<() => void>();

function emit(next: Me) {
  state = next;
  listeners.forEach((l) => l());
}

export function refreshMe() {
  inflight = fetch('/api/me', { cache: 'no-store', credentials: 'same-origin' })
    .then((r) => (r.ok ? r.json() : { user: null, savedIds: [] }))
    .then((d) =>
      emit({ status: 'ready', user: d.user ?? null, savedIds: d.savedIds ?? [], showCommunityPrompt: Boolean(d.showCommunityPrompt) }),
    )
    .catch(() => emit({ status: 'ready', user: null, savedIds: [], showCommunityPrompt: false }))
    .finally(() => {
      inflight = null;
    });
  return inflight;
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  if (state.status === 'loading' && !inflight) void refreshMe();
  return () => listeners.delete(listener);
}

const SERVER_STATE: Me = { status: 'loading', user: null, savedIds: [], showCommunityPrompt: false };

export function useMe(): Me {
  return useSyncExternalStore(subscribe, () => state, () => SERVER_STATE);
}

/** Optimistically save/unsave; rolls back if the server refuses. */
export async function toggleSaved(propertyId: string, saved: boolean) {
  const before = state.savedIds;
  emit({ ...state, savedIds: saved ? [...new Set([...before, propertyId])] : before.filter((id) => id !== propertyId) });
  try {
    const res = await fetch('/api/me/saved', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'same-origin',
      body: JSON.stringify({ propertyId, saved }),
    });
    if (!res.ok) throw new Error(String(res.status));
    const data = (await res.json()) as { savedIds: string[] };
    emit({ ...state, savedIds: data.savedIds });
  } catch {
    emit({ ...state, savedIds: before });
  }
}

/** Record the answer to the community invite (hide it now; tell the server so it stays hidden). */
export function dismissCommunityPrompt() {
  emit({ ...state, showCommunityPrompt: false });
  void fetch('/api/me/community', { method: 'POST', credentials: 'same-origin' }).catch(() => {});
}
