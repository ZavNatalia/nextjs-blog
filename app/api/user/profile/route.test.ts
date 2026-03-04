import { vi } from 'vitest';

const mockUsersUpdateOne = vi.fn();
const mockCommentsUpdateMany = vi.fn();

vi.mock('@/lib/db', () => ({
    connectToDatabase: vi.fn().mockResolvedValue({
        collection: (name: string) => {
            if (name === 'comments') {
                return { updateMany: mockCommentsUpdateMany };
            }
            return { updateOne: mockUsersUpdateOne };
        },
    }),
}));

vi.mock('next-auth', () => ({
    getServerSession: vi.fn(),
}));

const mockCheck = vi.fn().mockReturnValue({
    success: true,
    remaining: 10,
    retryAfterMs: 0,
});

vi.mock('@/lib/rate-limit', () => ({
    rateLimit: () => ({ check: (...args: unknown[]) => mockCheck(...args) }),
    getClientIp: () => '127.0.0.1',
}));

import { NextRequest } from 'next/server';
import { getServerSession } from 'next-auth';

import { PATCH } from './route';

function makeRequest(body: Record<string, unknown>) {
    return new NextRequest('http://localhost:3000/api/user/profile', {
        method: 'PATCH',
        body: JSON.stringify(body),
        headers: { 'Content-Type': 'application/json' },
    });
}

beforeEach(() => {
    vi.clearAllMocks();
});

describe('PATCH /api/user/profile', () => {
    it('returns 401 when not authenticated', async () => {
        vi.mocked(getServerSession).mockResolvedValue(null);
        const res = await PATCH(makeRequest({ name: 'Test' }));
        expect(res.status).toBe(401);
        const data = await res.json();
        expect(data.error).toMatch(/not authenticated/i);
    });

    it('returns 422 for name too short (1 char)', async () => {
        vi.mocked(getServerSession).mockResolvedValue({
            user: { email: 'test@test.com' },
            expires: '',
        });
        const res = await PATCH(makeRequest({ name: 'A' }));
        expect(res.status).toBe(422);
        const data = await res.json();
        expect(data.error).toMatch(/at least 2 characters/i);
    });

    it('returns 422 for name too long (51 chars)', async () => {
        vi.mocked(getServerSession).mockResolvedValue({
            user: { email: 'test@test.com' },
            expires: '',
        });
        const res = await PATCH(makeRequest({ name: 'A'.repeat(51) }));
        expect(res.status).toBe(422);
        const data = await res.json();
        expect(data.error).toMatch(/must not exceed 50 characters/i);
    });

    it('returns 200 with valid name', async () => {
        vi.mocked(getServerSession).mockResolvedValue({
            user: { email: 'test@test.com' },
            expires: '',
        });
        mockUsersUpdateOne.mockResolvedValue({ matchedCount: 1 });
        mockCommentsUpdateMany.mockResolvedValue({ modifiedCount: 0 });
        const res = await PATCH(makeRequest({ name: 'Test User' }));
        expect(res.status).toBe(200);
        const data = await res.json();
        expect(data.message).toMatch(/success/i);
        expect(mockUsersUpdateOne).toHaveBeenCalledWith(
            { email: 'test@test.com' },
            { $set: { name: 'Test User' } },
        );
        expect(mockCommentsUpdateMany).toHaveBeenCalledWith(
            { authorEmail: 'test@test.com' },
            { $set: { authorName: 'Test User' } },
        );
    });

    it('returns 404 when user not found', async () => {
        vi.mocked(getServerSession).mockResolvedValue({
            user: { email: 'ghost@test.com' },
            expires: '',
        });
        mockUsersUpdateOne.mockResolvedValue({ matchedCount: 0 });
        const res = await PATCH(makeRequest({ name: 'Test User' }));
        expect(res.status).toBe(404);
        const data = await res.json();
        expect(data.error).toMatch(/not found/i);
    });

    it('returns 500 on database error', async () => {
        vi.mocked(getServerSession).mockResolvedValue({
            user: { email: 'test@test.com' },
            expires: '',
        });
        mockUsersUpdateOne.mockRejectedValue(new Error('DB connection failed'));
        const res = await PATCH(makeRequest({ name: 'Test User' }));
        expect(res.status).toBe(500);
    });

    it('returns 429 when rate limited', async () => {
        mockCheck.mockReturnValueOnce({
            success: false,
            remaining: 0,
            retryAfterMs: 5000,
        });
        const res = await PATCH(makeRequest({ name: 'Test' }));
        expect(res.status).toBe(429);
        expect(res.headers.get('Retry-After')).toBe('5');
    });

    it('returns 400 for invalid JSON body', async () => {
        vi.mocked(getServerSession).mockResolvedValue({
            user: { email: 'test@test.com' },
            expires: '',
        });
        const req = new NextRequest('http://localhost:3000/api/user/profile', {
            method: 'PATCH',
            body: 'not json',
            headers: { 'Content-Type': 'application/json' },
        });
        const res = await PATCH(req);
        expect(res.status).toBe(400);
        const data = await res.json();
        expect(data.error).toMatch(/invalid request body/i);
    });

    it('returns 401 when session has no email', async () => {
        vi.mocked(getServerSession).mockResolvedValue({
            user: { email: null },
            expires: '',
        });
        const res = await PATCH(makeRequest({ name: 'Test' }));
        expect(res.status).toBe(401);
        const data = await res.json();
        expect(data.error).toMatch(/no email/i);
    });
});
