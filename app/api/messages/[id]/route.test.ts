import { vi } from 'vitest';

const mockFindOne = vi.fn();
const mockUpdateOne = vi.fn();
const mockDeleteOne = vi.fn();

vi.mock('@/lib/db', () => ({
    connectToDatabase: vi.fn().mockResolvedValue({
        collection: () => ({
            findOne: mockFindOne,
            updateOne: mockUpdateOne,
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

import { DELETE, PATCH } from './route';

const makeParams = (id: string) => ({ params: Promise.resolve({ id }) });

function makePatchRequest() {
    return new NextRequest('http://localhost:3000/api/messages/abc123', {
        method: 'PATCH',
    });
}

function makeDeleteRequest() {
    return new NextRequest('http://localhost:3000/api/messages/abc123', {
        method: 'DELETE',
    });
}

beforeEach(() => {
    vi.clearAllMocks();
    process.env.ADMIN_EMAIL = 'admin@test.com';
});

describe('PATCH /api/messages/[id]', () => {
    it('returns 401 when not authenticated', async () => {
        vi.mocked(getServerSession).mockResolvedValue(null);

        const res = await PATCH(makePatchRequest(), makeParams('abc123'));

        expect(res.status).toBe(401);
        const data = await res.json();
        expect(data.error).toMatch(/not authenticated/i);
    });

    it('returns 403 when user is not admin', async () => {
        vi.mocked(getServerSession).mockResolvedValue({
            user: { email: 'user@test.com' },
            expires: '',
        });

        const res = await PATCH(
            makePatchRequest(),
            makeParams('67bf1a2b3c4d5e6f78901234'),
        );

        expect(res.status).toBe(403);
        const data = await res.json();
        expect(data.error).toMatch(/forbidden/i);
    });

    it('returns 400 for invalid ObjectId', async () => {
        vi.mocked(getServerSession).mockResolvedValue({
            user: { email: 'admin@test.com' },
            expires: '',
        });

        const res = await PATCH(makePatchRequest(), makeParams('invalid-id'));

        expect(res.status).toBe(400);
        const data = await res.json();
        expect(data.error).toMatch(/invalid message id/i);
    });

    it('returns 200 on successful mark as read', async () => {
        vi.mocked(getServerSession).mockResolvedValue({
            user: { email: 'admin@test.com' },
            expires: '',
        });
        mockFindOne.mockResolvedValue({
            _id: '67bf1a2b3c4d5e6f78901234',
            email: 'sender@test.com',
            name: 'Sender',
            message: 'Hello',
            status: 'unread',
        });
        mockUpdateOne.mockResolvedValue({ modifiedCount: 1 });

        const res = await PATCH(
            makePatchRequest(),
            makeParams('67bf1a2b3c4d5e6f78901234'),
        );

        expect(res.status).toBe(200);
        expect(mockUpdateOne).toHaveBeenCalledOnce();
    });
});

describe('DELETE /api/messages/[id]', () => {
    it('returns 401 when not authenticated', async () => {
        vi.mocked(getServerSession).mockResolvedValue(null);

        const res = await DELETE(makeDeleteRequest(), makeParams('abc123'));

        expect(res.status).toBe(401);
        const data = await res.json();
        expect(data.error).toMatch(/not authenticated/i);
    });

    it('returns 403 when user is not admin', async () => {
        vi.mocked(getServerSession).mockResolvedValue({
            user: { email: 'user@test.com' },
            expires: '',
        });

        const res = await DELETE(
            makeDeleteRequest(),
            makeParams('67bf1a2b3c4d5e6f78901234'),
        );

        expect(res.status).toBe(403);
        const data = await res.json();
        expect(data.error).toMatch(/forbidden/i);
    });

    it('returns 200 on successful delete', async () => {
        vi.mocked(getServerSession).mockResolvedValue({
            user: { email: 'admin@test.com' },
            expires: '',
        });
        mockFindOne.mockResolvedValue({
            _id: '67bf1a2b3c4d5e6f78901234',
            email: 'sender@test.com',
            name: 'Sender',
            message: 'Hello',
        });
        mockDeleteOne.mockResolvedValue({ deletedCount: 1 });

        const res = await DELETE(
            makeDeleteRequest(),
            makeParams('67bf1a2b3c4d5e6f78901234'),
        );

        expect(res.status).toBe(200);
        const data = await res.json();
        expect(data.message).toMatch(/deleted successfully/i);
        expect(mockDeleteOne).toHaveBeenCalledOnce();
    });
});
