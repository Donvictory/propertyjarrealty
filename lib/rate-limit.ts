
interface RateLimitRecord {
  count: number;
  windowStart: number;
}

const store = new Map<string, RateLimitRecord>();


setInterval(() => {
  const now = Date.now();
  for (const [key, record] of store.entries()) {
    if (now - record.windowStart > 60_000) {
      store.delete(key);
    }
  }
}, 5 * 60 * 1000);


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
