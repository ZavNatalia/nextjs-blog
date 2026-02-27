import { ObjectId } from 'mongodb';
import { NextRequest } from 'next/server';
import { getServerSession } from 'next-auth';

import { moderateContent } from '@/lib/comments';
import { connectToDatabase } from '@/lib/db';
import { getClientIp, rateLimit } from '@/lib/rate-limit';
import { IComment } from '@/lib/types/mongodb';
import { commentEditSchema } from '@/lib/validations';

const limiter = rateLimit({ maxRequests: 10, windowMs: 15 * 60 * 1000 });

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

    try {
        const session = await getServerSession();
        if (!session || !session.user?.email) {
            return new Response(
                JSON.stringify({ error: 'Not authenticated.' }),
                {
                    status: 401,
                    headers: { 'Content-Type': 'application/json' },
                },
            );
        }

        const rawBody = await req.json();
        const result = commentEditSchema.safeParse(rawBody);

        if (!result.success) {
            return new Response(
                JSON.stringify({ error: result.error.issues[0].message }),
                {
                    status: 422,
                    headers: { 'Content-Type': 'application/json' },
                },
            );
        }

        const { id } = await params;
        const { content } = result.data;

        const db = await connectToDatabase();
        const commentsCollection = db.collection<IComment>('comments');

        const comment = await commentsCollection.findOne({
            _id: new ObjectId(id),
        });

        if (!comment) {
            return new Response(
                JSON.stringify({ error: 'Comment not found.' }),
                {
                    status: 404,
                    headers: { 'Content-Type': 'application/json' },
                },
            );
        }

        if (comment.authorEmail !== session.user.email) {
            return new Response(
                JSON.stringify({
                    error: 'Not authorized to edit this comment.',
                }),
                {
                    status: 403,
                    headers: { 'Content-Type': 'application/json' },
                },
            );
        }

        const status = moderateContent(content);

        await commentsCollection.updateOne(
            { _id: new ObjectId(id) },
            {
                $set: {
                    content,
                    status,
                    updatedAt: new Date(),
                },
            },
        );

        return new Response(
            JSON.stringify({ message: 'Comment updated successfully.' }),
            {
                status: 200,
                headers: { 'Content-Type': 'application/json' },
            },
        );
    } catch (error) {
        const message =
            error instanceof Error ? error.message : 'Unknown error';
        console.error('Error in PATCH /api/comments/[id]:', message);
        return new Response(
            JSON.stringify({
                error: 'Failed to update comment. Database may be temporarily unavailable.',
                details: message,
            }),
            {
                status: 500,
                headers: { 'Content-Type': 'application/json' },
            },
        );
    }
}

export async function DELETE(
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

    try {
        const session = await getServerSession();
        if (!session || !session.user?.email) {
            return new Response(
                JSON.stringify({ error: 'Not authenticated.' }),
                {
                    status: 401,
                    headers: { 'Content-Type': 'application/json' },
                },
            );
        }

        const { id } = await params;

        const db = await connectToDatabase();
        const commentsCollection = db.collection<IComment>('comments');

        const comment = await commentsCollection.findOne({
            _id: new ObjectId(id),
        });

        if (!comment) {
            return new Response(
                JSON.stringify({ error: 'Comment not found.' }),
                {
                    status: 404,
                    headers: { 'Content-Type': 'application/json' },
                },
            );
        }

        const isAdmin = session.user.email === process.env.ADMIN_EMAIL;
        if (comment.authorEmail !== session.user.email && !isAdmin) {
            return new Response(
                JSON.stringify({
                    error: 'Not authorized to delete this comment.',
                }),
                {
                    status: 403,
                    headers: { 'Content-Type': 'application/json' },
                },
            );
        }

        await commentsCollection.deleteOne({ _id: new ObjectId(id) });

        return new Response(
            JSON.stringify({ message: 'Comment deleted successfully.' }),
            {
                status: 200,
                headers: { 'Content-Type': 'application/json' },
            },
        );
    } catch (error) {
        const message =
            error instanceof Error ? error.message : 'Unknown error';
        console.error('Error in DELETE /api/comments/[id]:', message);
        return new Response(
            JSON.stringify({
                error: 'Failed to delete comment. Database may be temporarily unavailable.',
                details: message,
            }),
            {
                status: 500,
                headers: { 'Content-Type': 'application/json' },
            },
        );
    }
}
