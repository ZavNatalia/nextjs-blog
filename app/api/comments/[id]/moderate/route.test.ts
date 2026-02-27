import { vi } from 'vitest';

const mockUpdateOne = vi.fn();

vi.mock('@/lib/db', () => ({
    connectToDatabase: vi.fn().mockResolvedValue({
        collection: () => ({
            updateOne: mockUpdateOne,
        }),
    }),
}));

vi.mock('next-auth', () => ({
    getServerSession: vi.fn(),
}));

vi.mock('@/lib/rate-limit', () => ({
    rateLimit: () => ({
        check: () => ({ success: true, remaining: 10, retryAfterMs: 0 }),
    }),
    getClientIp: () => '127.0.0.1',
}));

import { NextRequest } from 'next/server';
import { getServerSession } from 'next-auth';

import { PATCH } from './route';

function makeRequest(body: Record<string, unknown>) {
    return new NextRequest(
        'http://localhost:3000/api/comments/507f1f77bcf86cd799439011/moderate',
        {
            method: 'PATCH',
            body: JSON.stringify(body),
            headers: { 'Content-Type': 'application/json' },
        },
    );
}

const mockParams = Promise.resolve({ id: '507f1f77bcf86cd799439011' });

beforeEach(() => {
    vi.clearAllMocks();
    process.env.ADMIN_EMAIL = 'admin@test.com';
});

describe('PATCH /api/comments/[id]/moderate', () => {
    it('returns 401 when not authenticated', async () => {
        vi.mocked(getServerSession).mockResolvedValue(null);
        const res = await PATCH(makeRequest({ status: 'approved' }), {
            params: mockParams,
        });
        expect(res.status).toBe(401);
        const data = await res.json();
        expect(data.error).toMatch(/not authenticated/i);
    });

    it('returns 403 when user is not admin', async () => {
        vi.mocked(getServerSession).mockResolvedValue({
            user: { email: 'user@test.com' },
            expires: '',
        });
        const res = await PATCH(makeRequest({ status: 'approved' }), {
            params: mockParams,
        });
        expect(res.status).toBe(403);
        const data = await res.json();
        expect(data.error).toMatch(/forbidden/i);
    });

    it('returns 422 for invalid status', async () => {
        vi.mocked(getServerSession).mockResolvedValue({
            user: { email: 'admin@test.com' },
            expires: '',
        });
        const res = await PATCH(makeRequest({ status: 'invalid' }), {
            params: mockParams,
        });
        expect(res.status).toBe(422);
    });

    it('returns 200 on successful moderation', async () => {
        vi.mocked(getServerSession).mockResolvedValue({
            user: { email: 'admin@test.com' },
            expires: '',
        });
        mockUpdateOne.mockResolvedValue({ modifiedCount: 1 });
        const res = await PATCH(makeRequest({ status: 'approved' }), {
            params: mockParams,
        });
        expect(res.status).toBe(200);
        const data = await res.json();
        expect(data.message).toMatch(/moderated successfully/i);
    });
});
