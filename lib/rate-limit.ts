import { NextRequest } from 'next/server';

interface RateLimitConfig {
    maxRequests: number;
    windowMs: number;
}

interface RateLimitResult {
    success: boolean;
    remaining: number;
    retryAfterMs: number;
}

export function rateLimit(config: RateLimitConfig) {
    const { maxRequests, windowMs } = config;
    const requests = new Map<string, number[]>();

    // Periodic full cleanup to prevent memory leaks
    const cleanupInterval = setInterval(() => {
        const now = Date.now();
        for (const [key, timestamps] of requests) {
            const valid = timestamps.filter((t) => now - t < windowMs);
            if (valid.length === 0) {
                requests.delete(key);
            } else {
                requests.set(key, valid);
            }
        }
    }, 60_000);

    // Allow garbage collection in environments that support it
    if (cleanupInterval.unref) {
        cleanupInterval.unref();
    }

    return {
        check(key: string): RateLimitResult {
            const now = Date.now();
            const windowStart = now - windowMs;

            const timestamps = (requests.get(key) ?? []).filter(
                (t) => t > windowStart,
            );

            if (timestamps.length >= maxRequests) {
                const oldestInWindow = timestamps[0];
                const retryAfterMs = oldestInWindow + windowMs - now;

                return {
                    success: false,
                    remaining: 0,
                    retryAfterMs,
                };
            }

            timestamps.push(now);
            requests.set(key, timestamps);

            return {
                success: true,
                remaining: maxRequests - timestamps.length,
                retryAfterMs: 0,
            };
        },
    };
}

export function getClientIp(req: NextRequest): string {
    const forwarded = req.headers.get('x-forwarded-for');
    if (forwarded) {
        return forwarded.split(',')[0].trim();
    }

    const realIp = req.headers.get('x-real-ip');
    if (realIp) {
        return realIp.trim();
    }

    return 'unknown';
}
