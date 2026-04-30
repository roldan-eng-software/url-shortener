import { NextRequest } from 'next/server';

const WINDOW_MS = 60 * 1000;
const MAX_ATTEMPTS = 10;

const buckets = new Map<string, { count: number; resetAt: number }>();

export function isRateLimited(request: NextRequest, keyPrefix: string) {
  const ip =
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    request.headers.get('x-real-ip') ||
    'unknown';
  const key = `${keyPrefix}:${ip}`;
  const now = Date.now();
  const bucket = buckets.get(key);

  if (!bucket || bucket.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return false;
  }

  bucket.count += 1;
  return bucket.count > MAX_ATTEMPTS;
}
