import { NextRequest } from 'next/server';

import { auth } from '@/auth';
import { connectToDatabase } from '@/lib/db';
import { getClientIp, rateLimit } from '@/lib/rate-limit';
import { IComment } from '@/lib/types/mongodb';

const limiter = rateLimit({ maxRequests: 30, windowMs: 60 * 1000 });

export async function GET(req: NextRequest) {
    const ip = getClientIp(req);
    const { success, retryAfterMs } = limiter.check(ip);

    if (!success) {
        return new Response(
            JSON.stringify({
                error: 'Too many requests. Please try again later.',
            }),
            {
                status: 429,
                headers: {
                    'Content-Type': 'application/json',
                    'Retry-After': String(Math.ceil(retryAfterMs / 1000)),
                },
            },
        );
    }

    const session = await auth();

    if (!session || session.user?.email !== process.env.ADMIN_EMAIL) {
        return new Response(JSON.stringify({ error: 'Forbidden' }), {
            status: 403,
            headers: { 'Content-Type': 'application/json' },
        });
    }

    try {
        const db = await connectToDatabase();
        const count = await db
            .collection<IComment>('comments')
            .countDocuments({ status: 'pending' });

        return new Response(JSON.stringify({ count }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {
        const message =
            error instanceof Error ? error.message : 'Unknown error';
        console.error('Error in GET /api/comments/pending-count:', message);
        return new Response(
            JSON.stringify({ error: 'Failed to count pending comments.' }),
            {
                status: 500,
                headers: { 'Content-Type': 'application/json' },
            },
        );
    }
}
