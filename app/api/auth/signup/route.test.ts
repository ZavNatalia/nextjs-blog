import { vi } from 'vitest';

const mockFindOne = vi.fn();
const mockInsertOne = vi.fn();

vi.mock('@/lib/db', () => ({
    connectToDatabase: vi.fn().mockResolvedValue({
        collection: () => ({
            findOne: mockFindOne,
            insertOne: mockInsertOne,
        }),
    }),
}));

vi.mock('@/lib/auth', () => ({
    hashPassword: vi.fn().mockResolvedValue('hashed_password'),
}));

import { NextRequest } from 'next/server';

import { POST } from './route';

function makeRequest(body: Record<string, unknown>) {
    return new NextRequest('http://localhost:3000/api/auth/signup', {
        method: 'POST',
        body: JSON.stringify(body),
        headers: { 'Content-Type': 'application/json' },
    });
}

beforeEach(() => {
    vi.clearAllMocks();
});

describe('POST /api/auth/signup', () => {
    it('returns 422 for invalid email', async () => {
        const res = await POST(
            makeRequest({ email: 'bademail', password: 'password123' }),
        );
        expect(res.status).toBe(422);
        const data = await res.json();
        expect(data.error).toMatch(/invalid/i);
    });

    it('returns 422 for short password', async () => {
        const res = await POST(
            makeRequest({ email: 'a@b.com', password: '123' }),
        );
        expect(res.status).toBe(422);
    });

    it('returns 422 for duplicate email', async () => {
        mockFindOne.mockResolvedValue({ email: 'a@b.com' });
        const res = await POST(
            makeRequest({ email: 'a@b.com', password: 'password123' }),
        );
        expect(res.status).toBe(422);
        const data = await res.json();
        expect(data.error).toMatch(/unable to process/i);
    });

    it('returns 201 on successful signup', async () => {
        mockFindOne.mockResolvedValue(null);
        mockInsertOne.mockResolvedValue({ insertedId: 'abc123' });
        const res = await POST(
            makeRequest({ email: 'new@user.com', password: 'password123' }),
        );
        expect(res.status).toBe(201);
        const data = await res.json();
        expect(data.message).toContain('new@user.com');
    });

    it('returns 500 on database error', async () => {
        mockFindOne.mockRejectedValue(new Error('DB connection failed'));
        const res = await POST(
            makeRequest({ email: 'a@b.com', password: 'password123' }),
        );
        expect(res.status).toBe(500);
    });
});
