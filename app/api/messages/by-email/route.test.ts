import { vi } from 'vitest';

const mockDeleteMany = vi.fn();

vi.mock('@/lib/db', () => ({
    connectToDatabase: vi.fn().mockResolvedValue({
        collection: () => ({
            deleteMany: mockDeleteMany,
        }),
    }),
}));

vi.mock('@/auth', () => ({
    auth: vi.fn(),
}));

vi.mock('@/lib/rate-limit', () => ({
    rateLimit: () => ({
        check: () => ({ success: true, remaining: 10, retryAfterMs: 0 }),
    }),
    getClientIp: () => '127.0.0.1',
}));

import { NextRequest } from 'next/server';

import { auth } from '@/auth';

import { DELETE } from './route';

function makeRequest(body: Record<string, unknown>) {
    return new NextRequest(
        'http://localhost:3000/api/messages/by-email',
        {
            method: 'DELETE',
            body: JSON.stringify(body),
            headers: { 'Content-Type': 'application/json' },
        },
    );
}

beforeEach(() => {
    vi.clearAllMocks();
    process.env.ADMIN_EMAIL = 'admin@test.com';
});

describe('DELETE /api/messages/by-email', () => {
    it('returns 401 when not authenticated', async () => {
        vi.mocked(auth).mockResolvedValue(null);
        const res = await DELETE(makeRequest({ email: 'spam@test.com' }));
        expect(res.status).toBe(401);
        const data = await res.json();
        expect(data.error).toMatch(/not authenticated/i);
    });

    it('returns 422 for invalid email', async () => {
        vi.mocked(auth).mockResolvedValue({
            user: { email: 'admin@test.com' },
            expires: '',
        });
        const res = await DELETE(makeRequest({ email: 'not-an-email' }));
        expect(res.status).toBe(422);
    });

    it('returns 200 with deletedCount on success', async () => {
        vi.mocked(auth).mockResolvedValue({
            user: { email: 'admin@test.com' },
            expires: '',
        });
        mockDeleteMany.mockResolvedValue({ deletedCount: 3 });
        const res = await DELETE(makeRequest({ email: 'spam@test.com' }));
        expect(res.status).toBe(200);
        const data = await res.json();
        expect(data.deletedCount).toBe(3);
        expect(mockDeleteMany).toHaveBeenCalledWith({
            email: 'spam@test.com',
        });
    });
});
