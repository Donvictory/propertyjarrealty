/**
 * Lightweight in-memory rate limiter.
 * Works on Next.js Node.js runtime without external services.
 * State resets on server restart / cold start — acceptable for edge protection.
 */

interface RateLimitRecord {
  count: number;
  windowStart: number;
}

const store = new Map<string, RateLimitRecord>();

/** Remove stale entries every 5 minutes to prevent memory leaks */
setInterval(() => {
  const now = Date.now();
  for (const [key, record] of store.entries()) {
    if (now - record.windowStart > 60_000) {
      store.delete(key);
    }
  }
}, 5 * 60 * 1000);

/**
 * @param ip      - The requester's IP address
 * @param limit   - Max requests allowed in the window
 * @param windowMs - Window duration in milliseconds
 * @returns { allowed: boolean, remaining: number }
 */
export function rateLimit(
  ip: string,
  limit: number,
  windowMs: number
): { allowed: boolean; remaining: number } {
  const now = Date.now();
  const record = store.get(ip);

  if (!record || now - record.windowStart > windowMs) {
    store.set(ip, { count: 1, windowStart: now });
    return { allowed: true, remaining: limit - 1 };
  }

  record.count += 1;
  store.set(ip, record);

  const remaining = Math.max(0, limit - record.count);
  return { allowed: record.count <= limit, remaining };
}
