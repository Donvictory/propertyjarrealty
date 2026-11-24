import { NextResponse, type NextRequest } from 'next/server';
import { getCurrentUser } from '@/lib/user-session';
import { setSavedProperty } from '@/lib/users';

/** Save or unsave a property for the signed-in user. Body: { propertyId: string, saved: boolean } */
export async function POST(req: NextRequest) {
  // Same-origin only (the session cookie is SameSite=Lax, this is an extra CSRF guard for JSON posts).
  const origin = req.headers.get('origin');
  if (origin && origin !== req.nextUrl.origin) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: 'Sign in to save properties.' }, { status: 401 });

  const body = (await req.json().catch(() => null)) as { propertyId?: unknown; saved?: unknown } | null;
  const propertyId = typeof body?.propertyId === 'string' ? body.propertyId : '';
  if (!/^[A-Za-z0-9_-]{1,80}$/.test(propertyId) || typeof body?.saved !== 'boolean') {
    return NextResponse.json({ error: 'Invalid request.' }, { status: 400 });
  }

  const savedIds = await setSavedProperty(user.id, propertyId, body.saved);
  return NextResponse.json({ savedIds }, { headers: { 'Cache-Control': 'private, no-store' } });
}
