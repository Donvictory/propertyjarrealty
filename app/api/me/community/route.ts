import { NextResponse, type NextRequest } from 'next/server';
import { getCurrentUser } from '@/lib/user-session';
import { markCommunityPrompted } from '@/lib/users';

/** The member answered the WhatsApp community invite (joined or "maybe later"): don't show it again. */
export async function POST(req: NextRequest) {
  const origin = req.headers.get('origin');
  if (origin && origin !== req.nextUrl.origin) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: 'Not signed in' }, { status: 401 });
  await markCommunityPrompted(user.id);
  return NextResponse.json({ ok: true }, { headers: { 'Cache-Control': 'private, no-store' } });
}
