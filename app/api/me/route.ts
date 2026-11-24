import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/user-session';

/**
 * Who is signed in, for client components (header, heart buttons, community invite). Pages stay
 * statically prerendered; this small request fills in the signed-in bits after load.
 */
export async function GET() {
  const user = await getCurrentUser();
  const body = user
    ? {
        user: { name: user.name, email: user.email, avatarUrl: user.avatarUrl },
        savedIds: user.savedPropertyIds,
        showCommunityPrompt: user.communityPromptAt === null,
      }
    : { user: null, savedIds: [], showCommunityPrompt: false };
  return NextResponse.json(body, { headers: { 'Cache-Control': 'private, no-store' } });
}
