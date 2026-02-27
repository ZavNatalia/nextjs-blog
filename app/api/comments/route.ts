import { NextRequest } from 'next/server';
import { getServerSession } from 'next-auth';

import { moderateContent } from '@/lib/comments';
import { connectToDatabase } from '@/lib/db';
import { getClientIp, rateLimit } from '@/lib/rate-limit';
import { IComment } from '@/lib/types/mongodb';
import { commentSchema } from '@/lib/validations';

const limiter = rateLimit({ maxRequests: 10, windowMs: 15 * 60 * 1000 });

export async function GET(req: NextRequest) {
    const postSlug = req.nextUrl.searchParams.get('postSlug');

    if (!postSlug) {
        return new Response(
            JSON.stringify({ error: 'postSlug query parameter is required.' }),
            {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
            },
        );
    }

    try {
        const db = await connectToDatabase();
        const commentsCollection = db.collection<IComment>('comments');

        const comments = await commentsCollection
            .find({ postSlug, status: 'approved' })
            .sort({ createdAt: -1 })
            .toArray();

        return new Response(JSON.stringify({ comments }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {
        const message =
            error instanceof Error ? error.message : 'Unknown error';
        console.error('Error in GET /api/comments:', message);
        return new Response(
            JSON.stringify({
                error: 'Failed to load comments. Database may be temporarily unavailable.',
                details: message,
            }),
            {
                status: 500,
                headers: { 'Content-Type': 'application/json' },
            },
        );
    }
}

export async function POST(req: NextRequest) {
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

    try {
        const data = await req.json();
        const result = commentSchema.safeParse(data);

        if (!result.success) {
            return new Response(
                JSON.stringify({ error: result.error.issues[0].message }),
                {
                    status: 422,
                    headers: { 'Content-Type': 'application/json' },
                },
            );
        }

        const { postSlug, content } = result.data;
        const status = moderateContent(content);

        const db = await connectToDatabase();
        const commentsCollection = db.collection<IComment>('comments');

        const comment: IComment = {
            postSlug,
            authorEmail: session.user!.email!,
            authorName: session.user!.name || session.user!.email!,
            content,
            status,
            createdAt: new Date(),
        };

        const insertResult = await commentsCollection.insertOne(comment);
        const createdComment = { ...comment, _id: insertResult.insertedId };

        return new Response(
            JSON.stringify({
                message: 'Comment created successfully!',
                comment: createdComment,
            }),
            {
                status: 201,
                headers: { 'Content-Type': 'application/json' },
            },
        );
    } catch (error) {
        const message =
            error instanceof Error ? error.message : 'Unknown error';
        console.error('Error in POST /api/comments:', message);
        return new Response(
            JSON.stringify({
                error: 'Failed to create comment. Database may be temporarily unavailable.',
                details: message,
            }),
            {
                status: 500,
                headers: { 'Content-Type': 'application/json' },
            },
        );
    }
}
