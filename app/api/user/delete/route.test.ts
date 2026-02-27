import { vi } from 'vitest';

const mockFindOne = vi.fn();
const mockDeleteOne = vi.fn();

vi.mock('@/lib/db', () => ({
    connectToDatabase: vi.fn().mockResolvedValue({
        collection: () => ({
            findOne: mockFindOne,
            deleteOne: mockDeleteOne,
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

import { DELETE } from './route';

function makeRequest() {
    return new NextRequest('http://localhost:3000/api/user/delete', {
        method: 'DELETE',
    });
}

beforeEach(() => {
    vi.clearAllMocks();
});

describe('DELETE /api/user/delete', () => {
    it('returns 401 when not authenticated', async () => {
        vi.mocked(getServerSession).mockResolvedValue(null);
        const res = await DELETE(makeRequest());
        expect(res.status).toBe(401);
        const data = await res.json();
        expect(data.error).toMatch(/not authenticated/i);
    });

    it('returns 401 when session has no email', async () => {
        vi.mocked(getServerSession).mockResolvedValue({
            user: { name: 'Test' },
            expires: '',
        });
        const res = await DELETE(makeRequest());
        expect(res.status).toBe(401);
    });

    it('returns 404 when user not found in database', async () => {
        vi.mocked(getServerSession).mockResolvedValue({
            user: { email: 'ghost@test.com' },
            expires: '',
        });
        mockFindOne.mockResolvedValue(null);
        const res = await DELETE(makeRequest());
        expect(res.status).toBe(404);
        const data = await res.json();
        expect(data.error).toMatch(/not found/i);
    });

    it('returns 500 when delete operation fails', async () => {
        vi.mocked(getServerSession).mockResolvedValue({
            user: { email: 'test@test.com' },
            expires: '',
        });
        mockFindOne.mockResolvedValue({ email: 'test@test.com' });
        mockDeleteOne.mockResolvedValue({ deletedCount: 0 });
        const res = await DELETE(makeRequest());
        expect(res.status).toBe(500);
        const data = await res.json();
        expect(data.error).toMatch(/failed to delete/i);
    });

    it('returns 200 on successful account deletion', async () => {
        vi.mocked(getServerSession).mockResolvedValue({
            user: { email: 'test@test.com' },
            expires: '',
        });
        mockFindOne.mockResolvedValue({ email: 'test@test.com' });
        mockDeleteOne.mockResolvedValue({ deletedCount: 1 });
        const res = await DELETE(makeRequest());
        expect(res.status).toBe(200);
        const data = await res.json();
        expect(data.message).toMatch(/deleted successfully/i);
    });

    it('returns 500 on database error', async () => {
        vi.mocked(getServerSession).mockResolvedValue({
            user: { email: 'test@test.com' },
            expires: '',
        });
        mockFindOne.mockRejectedValue(new Error('DB connection failed'));
        const res = await DELETE(makeRequest());
        expect(res.status).toBe(500);
    });
});
