import { NextResponse, type NextRequest } from 'next/server';
import { consumeToken, updateUser } from '@/lib/users';
import { createUserSession } from '@/lib/user-session';

/** Link from the verification email: confirm the address, sign the user in, land on their account. */
export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get('token') ?? '';
  const userId = await consumeToken(token, 'verify').catch(() => null);
  if (!userId) {
    return NextResponse.redirect(new URL('/sign-in?notice=verify-expired', req.nextUrl));
  }

  const user = await updateUser(userId, { emailVerified: true });
  if (!user) return NextResponse.redirect(new URL('/sign-in?notice=verify-expired', req.nextUrl));

  await createUserSession(user);
  return NextResponse.redirect(new URL('/account?notice=welcome', req.nextUrl));
}
