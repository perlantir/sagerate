import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

let limiter: Ratelimit | null = null;
const localHits = new Map<string, { count: number; resetAt: number }>();

export async function checkLeadSubmissionRateLimit(ipAddress: string) {
  if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
    limiter ??= new Ratelimit({
      redis: Redis.fromEnv(),
      limiter: Ratelimit.slidingWindow(3, "1 h"),
      analytics: true,
      prefix: "lead-submit",
    });
    return limiter.limit(ipAddress);
  }

  const now = Date.now();
  const hit = localHits.get(ipAddress);
  if (!hit || hit.resetAt < now) {
    localHits.set(ipAddress, { count: 1, resetAt: now + 60 * 60 * 1000 });
    return { success: true, limit: 3, remaining: 2, reset: now + 60 * 60 * 1000 };
  }
  hit.count += 1;
  return { success: hit.count <= 3, limit: 3, remaining: Math.max(0, 3 - hit.count), reset: hit.resetAt };
}
