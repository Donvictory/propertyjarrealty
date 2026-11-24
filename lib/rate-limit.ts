/**
 * Fixed-window counter kept in memory. On serverless each instance has its own counts, so this is a
 * speed bump against abuse, not a hard limit.
 */
interface RateLimitRecord {
  count: number;
  windowStart: number;
  windowMs: number;
}

const store = new Map<string, RateLimitRecord>();

// Drop counters whose own window has ended (not a fixed 60 s, which cut longer windows short).
setInterval(() => {
  const now = Date.now();
  for (const [key, record] of store.entries()) {
    if (now - record.windowStart > record.windowMs) store.delete(key);
  }
}, 60_000).unref?.();

export function rateLimit(
  key: string,
  limit: number,
  windowMs: number
): { allowed: boolean; remaining: number } {
  const now = Date.now();
  const record = store.get(key);

  if (!record || now - record.windowStart > windowMs) {
    store.set(key, { count: 1, windowStart: now, windowMs });
    return { allowed: true, remaining: limit - 1 };
  }

  record.count += 1;
  const remaining = Math.max(0, limit - record.count);
  return { allowed: record.count <= limit, remaining };
}
