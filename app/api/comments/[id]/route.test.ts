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

function makePatchRequest(body: Record<string, unknown>) {
    return new NextRequest('http://localhost:3000/api/comments/abc123', {
        method: 'PATCH',
        body: JSON.stringify(body),
        headers: { 'Content-Type': 'application/json' },
    });
}

function makeDeleteRequest() {
    return new NextRequest('http://localhost:3000/api/comments/abc123', {
        method: 'DELETE',
    });
}

beforeEach(() => {
    vi.clearAllMocks();
});

describe('PATCH /api/comments/[id]', () => {
    it('returns 401 when not authenticated', async () => {
        vi.mocked(getServerSession).mockResolvedValue(null);

        const res = await PATCH(
            makePatchRequest({ content: 'Updated comment' }),
            makeParams('abc123'),
        );

        expect(res.status).toBe(401);
        const data = await res.json();
        expect(data.error).toMatch(/not authenticated/i);
    });

    it('returns 422 for empty content', async () => {
        vi.mocked(getServerSession).mockResolvedValue({
            user: { email: 'user@test.com' },
            expires: '',
        });

        const res = await PATCH(
            makePatchRequest({ content: '' }),
            makeParams('abc123'),
        );

        expect(res.status).toBe(422);
        const data = await res.json();
        expect(data.error).toBeDefined();
    });

    it('returns 404 when comment not found', async () => {
        vi.mocked(getServerSession).mockResolvedValue({
            user: { email: 'user@test.com' },
            expires: '',
        });
        mockFindOne.mockResolvedValue(null);

        const res = await PATCH(
            makePatchRequest({ content: 'Updated comment' }),
            makeParams('67bf1a2b3c4d5e6f78901234'),
        );

        expect(res.status).toBe(404);
        const data = await res.json();
        expect(data.error).toMatch(/not found/i);
    });

    it('returns 403 when user is not the author', async () => {
        vi.mocked(getServerSession).mockResolvedValue({
            user: { email: 'user@test.com' },
            expires: '',
        });
        mockFindOne.mockResolvedValue({
            _id: '67bf1a2b3c4d5e6f78901234',
            authorEmail: 'other@test.com',
            content: 'Original comment',
        });

        const res = await PATCH(
            makePatchRequest({ content: 'Updated comment' }),
            makeParams('67bf1a2b3c4d5e6f78901234'),
        );

        expect(res.status).toBe(403);
        const data = await res.json();
        expect(data.error).toMatch(/not authorized/i);
    });

    it('returns 200 on successful update', async () => {
        vi.mocked(getServerSession).mockResolvedValue({
            user: { email: 'user@test.com' },
            expires: '',
        });
        mockFindOne.mockResolvedValue({
            _id: '67bf1a2b3c4d5e6f78901234',
            authorEmail: 'user@test.com',
            content: 'Original comment',
        });
        mockUpdateOne.mockResolvedValue({ modifiedCount: 1 });

        const res = await PATCH(
            makePatchRequest({ content: 'Updated comment' }),
            makeParams('67bf1a2b3c4d5e6f78901234'),
        );

        expect(res.status).toBe(200);
        const data = await res.json();
        expect(data.message).toMatch(/updated successfully/i);
        expect(mockUpdateOne).toHaveBeenCalledOnce();
    });
});

describe('DELETE /api/comments/[id]', () => {
    it('returns 401 when not authenticated', async () => {
        vi.mocked(getServerSession).mockResolvedValue(null);

        const res = await DELETE(makeDeleteRequest(), makeParams('abc123'));

        expect(res.status).toBe(401);
        const data = await res.json();
        expect(data.error).toMatch(/not authenticated/i);
    });

    it('returns 404 when comment not found', async () => {
        vi.mocked(getServerSession).mockResolvedValue({
            user: { email: 'user@test.com' },
            expires: '',
        });
        mockFindOne.mockResolvedValue(null);

        const res = await DELETE(
            makeDeleteRequest(),
            makeParams('67bf1a2b3c4d5e6f78901234'),
        );

        expect(res.status).toBe(404);
        const data = await res.json();
        expect(data.error).toMatch(/not found/i);
    });

    it('returns 403 when user is not the author', async () => {
        vi.mocked(getServerSession).mockResolvedValue({
            user: { email: 'user@test.com' },
            expires: '',
        });
        mockFindOne.mockResolvedValue({
            _id: '67bf1a2b3c4d5e6f78901234',
            authorEmail: 'other@test.com',
            content: 'Some comment',
        });

        const res = await DELETE(
            makeDeleteRequest(),
            makeParams('67bf1a2b3c4d5e6f78901234'),
        );

        expect(res.status).toBe(403);
        const data = await res.json();
        expect(data.error).toMatch(/not authorized/i);
    });

    it('allows admin to delete any comment', async () => {
        vi.mocked(getServerSession).mockResolvedValue({
            user: { email: 'admin@example.com', name: 'Admin' },
            expires: '',
        });

        mockFindOne.mockResolvedValue({
            _id: '67bf1a2b3c4d5e6f78901234',
            authorEmail: 'other@example.com',
            content: 'Some comment',
        });

        mockDeleteOne.mockResolvedValue({ deletedCount: 1 });

        process.env.ADMIN_EMAIL = 'admin@example.com';

        const res = await DELETE(
            makeDeleteRequest(),
            makeParams('67bf1a2b3c4d5e6f78901234'),
        );

        expect(res.status).toBe(200);
        expect(mockDeleteOne).toHaveBeenCalledOnce();

        delete process.env.ADMIN_EMAIL;
    });

    it('returns 200 on successful delete', async () => {
        vi.mocked(getServerSession).mockResolvedValue({
            user: { email: 'user@test.com' },
            expires: '',
        });
        mockFindOne.mockResolvedValue({
            _id: '67bf1a2b3c4d5e6f78901234',
            authorEmail: 'user@test.com',
            content: 'Some comment',
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
