import { NextRequest } from 'next/server';
import { afterEach,beforeEach, describe, expect, it, vi } from 'vitest';

import { getClientIp,rateLimit } from './rate-limit';

describe('rateLimit', () => {
    beforeEach(() => {
        vi.useFakeTimers();
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    it('allows requests within the limit', () => {
        const limiter = rateLimit({ maxRequests: 3, windowMs: 60_000 });

        const r1 = limiter.check('127.0.0.1');
        const r2 = limiter.check('127.0.0.1');
        const r3 = limiter.check('127.0.0.1');

        expect(r1.success).toBe(true);
        expect(r2.success).toBe(true);
        expect(r3.success).toBe(true);
    });

    it('blocks requests exceeding the limit', () => {
        const limiter = rateLimit({ maxRequests: 2, windowMs: 60_000 });

        limiter.check('127.0.0.1');
        limiter.check('127.0.0.1');
        const r3 = limiter.check('127.0.0.1');

        expect(r3.success).toBe(false);
        expect(r3.remaining).toBe(0);
        expect(r3.retryAfterMs).toBeGreaterThan(0);
    });

    it('returns correct remaining count', () => {
        const limiter = rateLimit({ maxRequests: 5, windowMs: 60_000 });

        expect(limiter.check('127.0.0.1').remaining).toBe(4);
        expect(limiter.check('127.0.0.1').remaining).toBe(3);
        expect(limiter.check('127.0.0.1').remaining).toBe(2);
        expect(limiter.check('127.0.0.1').remaining).toBe(1);
        expect(limiter.check('127.0.0.1').remaining).toBe(0);
    });

    it('resets after the window expires', () => {
        const limiter = rateLimit({ maxRequests: 2, windowMs: 60_000 });

        limiter.check('127.0.0.1');
        limiter.check('127.0.0.1');
        expect(limiter.check('127.0.0.1').success).toBe(false);

        vi.advanceTimersByTime(60_001);

        const result = limiter.check('127.0.0.1');
        expect(result.success).toBe(true);
        expect(result.remaining).toBe(1);
    });

    it('tracks different keys independently', () => {
        const limiter = rateLimit({ maxRequests: 1, windowMs: 60_000 });

        expect(limiter.check('192.168.1.1').success).toBe(true);
        expect(limiter.check('192.168.1.1').success).toBe(false);
        expect(limiter.check('192.168.1.2').success).toBe(true);
    });
});

describe('getClientIp', () => {
    it('extracts IP from x-forwarded-for header', () => {
        const req = new NextRequest('http://localhost/api/test', {
            headers: { 'x-forwarded-for': '203.0.113.50, 70.41.3.18' },
        });

        expect(getClientIp(req)).toBe('203.0.113.50');
    });

    it('extracts IP from x-real-ip header', () => {
        const req = new NextRequest('http://localhost/api/test', {
            headers: { 'x-real-ip': '203.0.113.50' },
        });

        expect(getClientIp(req)).toBe('203.0.113.50');
    });

    it('returns "unknown" when no IP headers are present', () => {
        const req = new NextRequest('http://localhost/api/test');

        expect(getClientIp(req)).toBe('unknown');
    });

    it('prefers x-forwarded-for over x-real-ip', () => {
        const req = new NextRequest('http://localhost/api/test', {
            headers: {
                'x-forwarded-for': '10.0.0.1',
                'x-real-ip': '10.0.0.2',
            },
        });

        expect(getClientIp(req)).toBe('10.0.0.1');
    });
});
