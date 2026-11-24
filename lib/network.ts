import 'server-only';
import { getDirectReferrals, getUserById, type UserRecord } from './users';

/*
 * A member's referral network: who referred them (upline chain, nearest first) and who they referred
 * (downlines). Only public-safe fields leave this module: name and join date, never email or phone.
 */

export type NetworkPerson = { id: string; name: string; joinedAt: string; level: number; role: 'client' | 'realtor' };
export type Network = { uplines: NetworkPerson[]; downlines: NetworkPerson[] };

const UPLINE_DEPTH = 3;

const toPerson = (u: UserRecord, level: number): NetworkPerson => ({
  id: u.id,
  name: u.name || 'PropertyJar member',
  joinedAt: u.createdAt,
  level,
  role: u.role,
});

export async function getNetwork(user: UserRecord): Promise<Network> {
  const uplines: NetworkPerson[] = [];
  const seen = new Set([user.id]);
  let cursor = user.referredBy;
  for (let level = 1; cursor && level <= UPLINE_DEPTH && !seen.has(cursor); level++) {
    seen.add(cursor);
    const up = await getUserById(cursor).catch(() => null);
    if (!up) break;
    uplines.push(toPerson(up, level));
    cursor = up.referredBy;
  }

  const direct = await getDirectReferrals(user.id).catch(() => []);
  return { uplines, downlines: direct.map((u) => toPerson(u, 1)) };
}
