import { vi } from 'vitest';

const mockCountDocuments = vi.fn();

vi.mock('@/lib/db', () => ({
    connectToDatabase: vi.fn().mockResolvedValue({
        collection: () => ({
            countDocuments: mockCountDocuments,
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

import { GET } from './route';

function makeRequest() {
    return new NextRequest(
        'http://localhost:3000/api/messages/unread-count',
        { method: 'GET' },
    );
}

beforeEach(() => {
    vi.clearAllMocks();
    process.env.ADMIN_EMAIL = 'admin@test.com';
});

describe('GET /api/messages/unread-count', () => {
    it('returns 403 when user is not admin', async () => {
        vi.mocked(getServerSession).mockResolvedValue({
            user: { email: 'user@test.com' },
            expires: '',
        });

        const res = await GET(makeRequest());

        expect(res.status).toBe(403);
        const data = await res.json();
        expect(data.error).toMatch(/forbidden/i);
    });

    it('returns 200 with count', async () => {
        vi.mocked(getServerSession).mockResolvedValue({
            user: { email: 'admin@test.com' },
            expires: '',
        });
        mockCountDocuments.mockResolvedValue(3);

        const res = await GET(makeRequest());

        expect(res.status).toBe(200);
        const data = await res.json();
        expect(data.count).toBe(3);
    });
});
