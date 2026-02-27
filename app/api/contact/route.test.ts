import { vi } from 'vitest';

const mockInsertOne = vi.fn();

vi.mock('@/lib/db', () => ({
    connectToDatabase: vi.fn().mockResolvedValue({
        collection: () => ({
            insertOne: mockInsertOne,
        }),
    }),
}));

const mockFetch = vi.fn();
vi.stubGlobal('fetch', mockFetch);

import { NextRequest } from 'next/server';

import { POST } from './route';

function makeRequest(body: Record<string, unknown>) {
    return new NextRequest('http://localhost:3000/api/contact', {
        method: 'POST',
        body: JSON.stringify(body),
        headers: { 'Content-Type': 'application/json' },
    });
}

beforeEach(() => {
    vi.clearAllMocks();
});

describe('POST /api/contact', () => {
    it('returns 400 when captcha verification fails', async () => {
        mockFetch.mockResolvedValue({
            json: async () => ({ success: false }),
        });

        const res = await POST(
            makeRequest({
                token: 'bad-token',
                email: 'a@b.com',
                name: 'Test',
                message: 'Hello',
            }),
        );
        expect(res.status).toBe(400);
        const data = await res.json();
        expect(data.error).toMatch(/captcha/i);
    });

    it('returns 400 for invalid message data', async () => {
        mockFetch.mockResolvedValue({
            json: async () => ({ success: true }),
        });

        const res = await POST(
            makeRequest({
                token: 'valid-token',
                email: 'invalid',
                name: '',
                message: '',
            }),
        );
        expect(res.status).toBe(400);
    });

    it('returns 201 on successful submission', async () => {
        mockFetch.mockResolvedValue({
            json: async () => ({ success: true }),
        });
        mockInsertOne.mockResolvedValue({ insertedId: 'msg123' });

        const res = await POST(
            makeRequest({
                token: 'valid-token',
                email: 'user@example.com',
                name: 'Jane',
                message: 'Hello there!',
            }),
        );
        expect(res.status).toBe(201);
        const data = await res.json();
        expect(data.message).toMatch(/success/i);
    });
});
