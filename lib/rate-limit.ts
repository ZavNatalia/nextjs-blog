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

/**
 * Extracts client IP from trusted proxy headers.
 *
 * Priority:
 * 1. x-real-ip — set by Nginx/Vercel, not spoofable behind a reverse proxy
 * 2. x-forwarded-for — last entry before our proxy is the most trustworthy;
 *    we take the rightmost non-private IP to resist spoofing
 * 3. Fallback to 'unknown' (still rate-limited as a single bucket)
 */
export function getClientIp(req: NextRequest): string {
    const realIp = req.headers.get('x-real-ip');
    if (realIp) {
        return realIp.trim();
    }

    const forwarded = req.headers.get('x-forwarded-for');
    if (forwarded) {
        const ips = forwarded.split(',').map((ip) => ip.trim());
        // Rightmost IP is appended by the trusted proxy closest to us
        for (let i = ips.length - 1; i >= 0; i--) {
            if (ips[i] && !isPrivateIp(ips[i])) {
                return ips[i];
            }
        }
        return ips[ips.length - 1];
    }

    return 'unknown';
}

function isPrivateIp(ip: string): boolean {
    return (
        ip.startsWith('10.') ||
        ip.startsWith('172.16.') ||
        ip.startsWith('172.17.') ||
        ip.startsWith('172.18.') ||
        ip.startsWith('172.19.') ||
        ip.startsWith('172.2') ||
        ip.startsWith('172.30.') ||
        ip.startsWith('172.31.') ||
        ip.startsWith('192.168.') ||
        ip.startsWith('127.') ||
        ip === '::1'
    );
}
