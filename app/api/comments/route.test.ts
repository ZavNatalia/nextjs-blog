import { vi } from 'vitest';

const mockInsertOne = vi.fn();
const mockFind = vi.fn();
const mockSort = vi.fn();
const mockToArray = vi.fn();

vi.mock('@/lib/db', () => ({
    default: Promise.resolve({
        db: () => ({
            collection: () => ({
                insertOne: mockInsertOne,
                find: mockFind,
            }),
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

import { GET, POST } from './route';

function makeGetRequest(postSlug?: string) {
    const url = postSlug
        ? `http://localhost:3000/api/comments?postSlug=${postSlug}`
        : 'http://localhost:3000/api/comments';
    return new NextRequest(url, { method: 'GET' });
}

function makePostRequest(body: Record<string, unknown>) {
    return new NextRequest('http://localhost:3000/api/comments', {
        method: 'POST',
        body: JSON.stringify(body),
        headers: { 'Content-Type': 'application/json' },
    });
}

beforeEach(() => {
    vi.clearAllMocks();
    mockFind.mockReturnValue({ sort: mockSort });
    mockSort.mockReturnValue({ toArray: mockToArray });
});

describe('GET /api/comments', () => {
    it('returns 400 without postSlug', async () => {
        const res = await GET(makeGetRequest());
        expect(res.status).toBe(400);
        const data = await res.json();
        expect(data.error).toMatch(/postSlug/i);
    });

    it('returns 200 with comments', async () => {
        const mockComments = [
            {
                _id: 'c1',
                postSlug: 'test-post',
                authorName: 'Alice',
                content: 'Great post!',
                status: 'approved',
                createdAt: new Date().toISOString(),
            },
        ];
        mockToArray.mockResolvedValue(mockComments);

        const res = await GET(makeGetRequest('test-post'));
        expect(res.status).toBe(200);
        const data = await res.json();
        expect(data.comments).toEqual(mockComments);
    });

    it('only queries approved comments', async () => {
        mockToArray.mockResolvedValue([]);

        await GET(makeGetRequest('test-post'));

        expect(mockFind).toHaveBeenCalledWith({
            postSlug: 'test-post',
            status: 'approved',
        });
    });
});

describe('POST /api/comments', () => {
    it('returns 401 when not authenticated', async () => {
        vi.mocked(getServerSession).mockResolvedValue(null);

        const res = await POST(
            makePostRequest({ postSlug: 'test-post', content: 'Nice!' }),
        );
        expect(res.status).toBe(401);
        const data = await res.json();
        expect(data.error).toMatch(/not authenticated/i);
    });

    it('returns 422 for empty content', async () => {
        vi.mocked(getServerSession).mockResolvedValue({
            user: { email: 'test@test.com', name: 'Test User' },
            expires: '',
        });

        const res = await POST(
            makePostRequest({ postSlug: 'test-post', content: '' }),
        );
        expect(res.status).toBe(422);
    });

    it('returns 422 for content exceeding 1000 chars', async () => {
        vi.mocked(getServerSession).mockResolvedValue({
            user: { email: 'test@test.com', name: 'Test User' },
            expires: '',
        });

        const longContent = 'a'.repeat(1001);
        const res = await POST(
            makePostRequest({ postSlug: 'test-post', content: longContent }),
        );
        expect(res.status).toBe(422);
    });

    it('returns 201 on successful creation', async () => {
        vi.mocked(getServerSession).mockResolvedValue({
            user: { email: 'test@test.com', name: 'Test User' },
            expires: '',
        });
        mockInsertOne.mockResolvedValue({ insertedId: 'comment123' });

        const res = await POST(
            makePostRequest({
                postSlug: 'test-post',
                content: 'Great article!',
            }),
        );
        expect(res.status).toBe(201);
        const data = await res.json();
        expect(data.message).toMatch(/success/i);
        expect(data.comment.postSlug).toBe('test-post');
        expect(data.comment.content).toBe('Great article!');
        expect(data.comment.authorEmail).toBe('test@test.com');
        expect(data.comment.authorName).toBe('Test User');
        expect(data.comment.status).toBe('approved');
    });

    it('sets status to pending for content with URLs', async () => {
        vi.mocked(getServerSession).mockResolvedValue({
            user: { email: 'test@test.com', name: 'Test User' },
            expires: '',
        });
        mockInsertOne.mockResolvedValue({ insertedId: 'comment456' });

        const res = await POST(
            makePostRequest({
                postSlug: 'test-post',
                content: 'Check out https://example.com',
            }),
        );
        expect(res.status).toBe(201);
        const data = await res.json();
        expect(data.comment.status).toBe('pending');
    });
});
