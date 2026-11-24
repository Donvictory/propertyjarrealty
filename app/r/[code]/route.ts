import { NextResponse, type NextRequest } from 'next/server';
import { REF_COOKIE, REF_COOKIE_MAX_AGE } from '@/lib/referral-cookie';
import { REFERRAL_CODE_RE, resolveReferralCode } from '@/lib/users';

/**
 * A member's referral link: /r/ADA7K2X. Remembers the code (30 days) and opens sign-up with it filled in.
 * Unknown codes still land on sign-up, just without a referrer.
 */
export async function GET(req: NextRequest, { params }: { params: Promise<{ code: string }> }) {
  const code = (await params).code.trim().toUpperCase();
  const valid = REFERRAL_CODE_RE.test(code) && (await resolveReferralCode(code).catch(() => null)) !== null;

  const target = new URL(valid ? `/sign-up?ref=${encodeURIComponent(code)}` : '/sign-up', req.nextUrl);
  const res = NextResponse.redirect(target);
  if (valid) {
    res.cookies.set(REF_COOKIE, code, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: REF_COOKIE_MAX_AGE,
    });
  }
  return res;
}
