import 'server-only';
import { headers } from 'next/headers';

/** The origin the current request came in on (used to build links in emails and the Google redirect URI). */
export async function requestOrigin(): Promise<string> {
  const h = await headers();
  const host = h.get('x-forwarded-host') ?? h.get('host');
  if (host) {
    const proto = h.get('x-forwarded-proto') ?? (host.startsWith('localhost') ? 'http' : 'https');
    return `${proto}://${host}`;
  }
  return process.env.NEXT_PUBLIC_SITE_URL ?? 'https://propertyjarrealty.com';
}
