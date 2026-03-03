import { NextRequest } from 'next/server';
import { getServerSession } from 'next-auth';

import { connectToDatabase } from '@/lib/db';
import { getClientIp, rateLimit } from '@/lib/rate-limit';
import { IComment } from '@/lib/types/mongodb';
import { deleteByEmailSchema } from '@/lib/validations';

const limiter = rateLimit({ maxRequests: 5, windowMs: 60 * 1000 });

function jsonResponse(body: object, status: number) {
    return new Response(JSON.stringify(body), {
        status,
        headers: { 'Content-Type': 'application/json' },
    });
}

export async function DELETE(req: NextRequest) {
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

    try {
        const session = await getServerSession();
        if (!session || !session.user?.email) {
            return jsonResponse({ error: 'Not authenticated.' }, 401);
        }

        if (session.user.email !== process.env.ADMIN_EMAIL) {
            return jsonResponse({ error: 'Forbidden.' }, 403);
        }

        const rawBody = await req.json();
        const result = deleteByEmailSchema.safeParse(rawBody);

        if (!result.success) {
            return jsonResponse({ error: result.error.issues[0].message }, 422);
        }

        const { email } = result.data;

        const db = await connectToDatabase();
        const collection = db.collection<IComment>('comments');
        const { deletedCount } = await collection.deleteMany({
            authorEmail: email,
        });

        return jsonResponse({ deletedCount }, 200);
    } catch (error) {
        const message =
            error instanceof Error ? error.message : 'Unknown error';
        console.error('Error in DELETE /api/comments/by-email:', message);
        return jsonResponse(
            {
                error: 'Failed to delete comments. Database may be temporarily unavailable.',
            },
            500,
        );
    }
}
