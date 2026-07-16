/**
 * Minimal in-memory sliding-window rate limiter, keyed by client identifier
 * (IP address). Good enough for a single-instance deployment; for
 * multi-instance/serverless-at-scale deployments swap this for a shared
 * store (e.g. Redis / Upstash) behind the same isAllowed() signature.
 */

const WINDOW_MS = 60_000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 20;

const hits = new Map<string, number[]>();

export function isRateLimited(clientId: string): boolean {
  const now = Date.now();
  const windowStart = now - WINDOW_MS;
  const timestamps = (hits.get(clientId) ?? []).filter((t) => t > windowStart);

  if (timestamps.length >= MAX_REQUESTS_PER_WINDOW) {
    hits.set(clientId, timestamps);
    return true;
  }

  timestamps.push(now);
  hits.set(clientId, timestamps);
  return false;
}
