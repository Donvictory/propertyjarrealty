import { revalidatePath, revalidateTag } from 'next/cache';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    revalidateTag('properties');
  } catch {}
  try {
    revalidatePath('/properties');
    revalidatePath('/campaign');
    revalidatePath('/campaign/[id]', 'page');
    revalidatePath('/', 'layout');
  } catch {}

  return NextResponse.json({ revalidated: true, now: Date.now() });
}
