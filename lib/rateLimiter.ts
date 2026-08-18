import { NextRequest } from 'next/server';

interface RateLimitRecord {
  timestamps: number[];
}

// In-memory rate limiting store (sliding window)
const rateLimitMap = new Map<string, RateLimitRecord>();

// Cleanup stale entries periodically
if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    const now = Date.now();
    const windowMs = 5 * 60 * 1000;
    for (const [key, record] of rateLimitMap.entries()) {
      record.timestamps = record.timestamps.filter((t) => now - t < windowMs);
      if (record.timestamps.length === 0) {
        rateLimitMap.delete(key);
      }
    }
  }, 5 * 60 * 1000);
}

export interface RateLimitOptions {
  limit?: number; // Max requests allowed in window
  windowMs?: number; // Window size in milliseconds (e.g. 60000 = 1 minute)
}

/**
 * Check if the current request is within rate limits.
 * @param req NextRequest
 * @param identifier Custom identifier (e.g. userId or IP)
 * @param options Rate limit configuration
 * @returns { allowed: boolean, remaining: number, resetInMs: number }
 */
export function checkRateLimit(
  req: NextRequest,
  identifier?: string,
  options: RateLimitOptions = {}
): { allowed: boolean; remaining: number; resetInMs: number } {
  const limit = options.limit ?? 20; // default 20 requests per window
  const windowMs = options.windowMs ?? 60 * 1000; // default 1 minute

  // Derive client IP from standard proxy headers
  const forwardedFor = req.headers.get('x-forwarded-for');
  const realIp = req.headers.get('x-real-ip');
  const ip = forwardedFor ? forwardedFor.split(',')[0].trim() : realIp || '127.0.0.1';

  const key = identifier ? `user:${identifier}` : `ip:${ip}`;
  const now = Date.now();

  const record = rateLimitMap.get(key) || { timestamps: [] };
  // Filter timestamps within current sliding window
  record.timestamps = record.timestamps.filter((t) => now - t < windowMs);

  if (record.timestamps.length >= limit) {
    const oldestTimestamp = record.timestamps[0];
    const resetInMs = Math.max(0, windowMs - (now - oldestTimestamp));
    return { allowed: false, remaining: 0, resetInMs };
  }

  // Record this request
  record.timestamps.push(now);
  rateLimitMap.set(key, record);

  const remaining = Math.max(0, limit - record.timestamps.length);
  return { allowed: true, remaining, resetInMs: windowMs };
}
