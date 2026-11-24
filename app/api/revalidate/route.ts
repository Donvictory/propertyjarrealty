import { revalidatePath, revalidateTag } from 'next/cache';
import { NextResponse } from 'next/server';
import { getSession } from '@/lib/session';

/** Clears the listing caches. Admin only: open to the public, it let anyone force repeated database reads. */
export async function GET() {
  if (!(await getSession())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  try {
    revalidateTag('properties', { expire: 0 });
  } catch {}
  try {
    revalidatePath('/properties');
    revalidatePath('/campaign');
    revalidatePath('/campaign/[id]', 'page');
    revalidatePath('/', 'layout');
  } catch {}

  return NextResponse.json({ revalidated: true, now: Date.now() });
}
