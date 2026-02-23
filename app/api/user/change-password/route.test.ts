import { vi } from 'vitest';

const mockFindOne = vi.fn();
const mockUpdateOne = vi.fn();

vi.mock('@/lib/db', () => ({
    default: Promise.resolve({
        db: () => ({
            collection: () => ({
                findOne: mockFindOne,
                updateOne: mockUpdateOne,
            }),
        }),
    }),
}));

vi.mock('next-auth', () => ({
    getServerSession: vi.fn(),
}));

vi.mock('@/lib/auth', () => ({
    verifyPassword: vi.fn(),
    hashPassword: vi.fn().mockResolvedValue('new_hashed_password'),
}));

vi.mock('@/lib/rate-limit', () => ({
    rateLimit: () => ({
        check: () => ({ success: true, remaining: 10, retryAfterMs: 0 }),
    }),
    getClientIp: () => '127.0.0.1',
}));

import { NextRequest } from 'next/server';
import { getServerSession } from 'next-auth';

import { verifyPassword } from '@/lib/auth';

import { PATCH } from './route';

function makeRequest(body: Record<string, unknown>) {
    return new NextRequest('http://localhost:3000/api/user/change-password', {
        method: 'PATCH',
        body: JSON.stringify(body),
        headers: { 'Content-Type': 'application/json' },
    });
}

beforeEach(() => {
    vi.clearAllMocks();
});

describe('PATCH /api/user/change-password', () => {
    it('returns 401 when not authenticated', async () => {
        vi.mocked(getServerSession).mockResolvedValue(null);
        const res = await PATCH(
            makeRequest({ oldPassword: 'oldpass123', newPassword: 'newpass123' }),
        );
        expect(res.status).toBe(401);
        const data = await res.json();
        expect(data.error).toMatch(/not authenticated/i);
    });

    it('returns 422 for missing old password', async () => {
        vi.mocked(getServerSession).mockResolvedValue({
            user: { email: 'test@test.com' },
            expires: '',
        });
        const res = await PATCH(makeRequest({ oldPassword: '', newPassword: 'newpass123' }));
        expect(res.status).toBe(422);
    });

    it('returns 422 for short new password', async () => {
        vi.mocked(getServerSession).mockResolvedValue({
            user: { email: 'test@test.com' },
            expires: '',
        });
        const res = await PATCH(makeRequest({ oldPassword: 'oldpass123', newPassword: 'short' }));
        expect(res.status).toBe(422);
    });

    it('returns 404 when user not found', async () => {
        vi.mocked(getServerSession).mockResolvedValue({
            user: { email: 'ghost@test.com' },
            expires: '',
        });
        mockFindOne.mockResolvedValue(null);
        const res = await PATCH(
            makeRequest({ oldPassword: 'oldpass123', newPassword: 'newpass123' }),
        );
        expect(res.status).toBe(404);
        const data = await res.json();
        expect(data.error).toMatch(/not found/i);
    });

    it('returns 403 when old password is incorrect', async () => {
        vi.mocked(getServerSession).mockResolvedValue({
            user: { email: 'test@test.com' },
            expires: '',
        });
        mockFindOne.mockResolvedValue({ email: 'test@test.com', password: 'hashed_old' });
        vi.mocked(verifyPassword).mockResolvedValue(false);
        const res = await PATCH(
            makeRequest({ oldPassword: 'wrongpass', newPassword: 'newpass123' }),
        );
        expect(res.status).toBe(403);
        const data = await res.json();
        expect(data.error).toMatch(/incorrect/i);
    });

    it('returns 200 on successful password change', async () => {
        vi.mocked(getServerSession).mockResolvedValue({
            user: { email: 'test@test.com' },
            expires: '',
        });
        mockFindOne.mockResolvedValue({ email: 'test@test.com', password: 'hashed_old' });
        vi.mocked(verifyPassword).mockResolvedValue(true);
        mockUpdateOne.mockResolvedValue({ modifiedCount: 1 });
        const res = await PATCH(
            makeRequest({ oldPassword: 'oldpass123', newPassword: 'newpass123' }),
        );
        expect(res.status).toBe(200);
        const data = await res.json();
        expect(data.message).toMatch(/success/i);
    });

    it('returns 500 on database error', async () => {
        vi.mocked(getServerSession).mockResolvedValue({
            user: { email: 'test@test.com' },
            expires: '',
        });
        mockFindOne.mockRejectedValue(new Error('DB connection failed'));
        const res = await PATCH(
            makeRequest({ oldPassword: 'oldpass123', newPassword: 'newpass123' }),
        );
        expect(res.status).toBe(500);
    });
});
