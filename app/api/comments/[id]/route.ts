import { Collection, ObjectId } from 'mongodb';
import { NextRequest } from 'next/server';
import { getServerSession } from 'next-auth';

import { moderateContent } from '@/lib/comments';
import { connectToDatabase } from '@/lib/db';
import { getClientIp, rateLimit } from '@/lib/rate-limit';
import { IComment } from '@/lib/types/mongodb';
import { commentEditSchema } from '@/lib/validations';

const limiter = rateLimit({ maxRequests: 10, windowMs: 15 * 60 * 1000 });

function jsonResponse(body: object, status: number) {
    return new Response(JSON.stringify(body), {
        status,
        headers: { 'Content-Type': 'application/json' },
    });
}

async function findCommentById(id: string): Promise<
    | { comment: IComment & { _id: ObjectId }; collection: Collection<IComment> }
    | { error: Response }
> {
    if (!ObjectId.isValid(id)) {
        return { error: jsonResponse({ error: 'Invalid comment ID.' }, 400) };
    }

    const db = await connectToDatabase();
    const collection = db.collection<IComment>('comments');
    const comment = await collection.findOne({ _id: new ObjectId(id) });

    if (!comment) {
        return { error: jsonResponse({ error: 'Comment not found.' }, 404) };
    }

    return { comment, collection };
}

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
            return jsonResponse({ error: 'Not authenticated.' }, 401);
        }

        const rawBody = await req.json();
        const result = commentEditSchema.safeParse(rawBody);

        if (!result.success) {
            return jsonResponse(
                { error: result.error.issues[0].message },
                422,
            );
        }

        const { id } = await params;
        const { content } = result.data;

        const found = await findCommentById(id);
        if ('error' in found) return found.error;

        if (found.comment.authorEmail !== session.user.email) {
            return jsonResponse(
                { error: 'Not authorized to edit this comment.' },
                403,
            );
        }

        const status = moderateContent(content);

        await found.collection.updateOne(
            { _id: found.comment._id },
            {
                $set: {
                    content,
                    status,
                    updatedAt: new Date(),
                },
            },
        );

        return jsonResponse({ message: 'Comment updated successfully.' }, 200);
    } catch (error) {
        const message =
            error instanceof Error ? error.message : 'Unknown error';
        console.error('Error in PATCH /api/comments/[id]:', message);
        return jsonResponse(
            {
                error: 'Failed to update comment. Database may be temporarily unavailable.',
                details: message,
            },
            500,
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
            return jsonResponse({ error: 'Not authenticated.' }, 401);
        }

        const { id } = await params;

        const found = await findCommentById(id);
        if ('error' in found) return found.error;

        const isAdmin = session.user.email === process.env.ADMIN_EMAIL;
        if (found.comment.authorEmail !== session.user.email && !isAdmin) {
            return jsonResponse(
                { error: 'Not authorized to delete this comment.' },
                403,
            );
        }

        await found.collection.deleteOne({ _id: found.comment._id });

        return jsonResponse({ message: 'Comment deleted successfully.' }, 200);
    } catch (error) {
        const message =
            error instanceof Error ? error.message : 'Unknown error';
        console.error('Error in DELETE /api/comments/[id]:', message);
        return jsonResponse(
            {
                error: 'Failed to delete comment. Database may be temporarily unavailable.',
                details: message,
            },
            500,
        );
    }
}
