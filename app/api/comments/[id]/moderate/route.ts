import { ObjectId } from 'mongodb';
import { NextRequest } from 'next/server';
import { getServerSession } from 'next-auth';

import clientPromise from '@/lib/db';
import { getClientIp, rateLimit } from '@/lib/rate-limit';
import { IComment } from '@/lib/types/mongodb';
import { commentModerateSchema } from '@/lib/validations';

const limiter = rateLimit({ maxRequests: 20, windowMs: 60 * 1000 });

export async function PATCH(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> },
) {
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

    const session = await getServerSession();

    if (!session) {
        return new Response(JSON.stringify({ error: 'Not authenticated!' }), {
            status: 401,
            headers: { 'Content-Type': 'application/json' },
        });
    }

    if (session.user?.email !== process.env.ADMIN_EMAIL) {
        return new Response(JSON.stringify({ error: 'Forbidden.' }), {
            status: 403,
            headers: { 'Content-Type': 'application/json' },
        });
    }

    const { id } = await params;
    const data = await req.json();
    const result = commentModerateSchema.safeParse(data);

    if (!result.success) {
        return new Response(
            JSON.stringify({ error: result.error.issues[0].message }),
            {
                status: 422,
                headers: { 'Content-Type': 'application/json' },
            },
        );
    }

    try {
        const client = await clientPromise;
        const db = client.db();
        const commentsCollection = db.collection<IComment>('comments');

        await commentsCollection.updateOne(
            { _id: new ObjectId(id) },
            { $set: { status: result.data.status } },
        );

        return new Response(
            JSON.stringify({ message: 'Comment moderated successfully.' }),
            {
                status: 200,
                headers: { 'Content-Type': 'application/json' },
            },
        );
    } catch (error) {
        console.error('Error in handler:', error);
        return new Response(
            JSON.stringify({ error: 'An internal server error occurred.' }),
            {
                status: 500,
                headers: { 'Content-Type': 'application/json' },
            },
        );
    }
}
