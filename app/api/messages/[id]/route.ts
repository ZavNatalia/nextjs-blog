import { Collection, ObjectId } from 'mongodb';
import { NextRequest } from 'next/server';

import { auth } from '@/auth';
import { connectToDatabase } from '@/lib/db';
import { getClientIp, rateLimit } from '@/lib/rate-limit';
import { IMessage } from '@/lib/types/mongodb';

const limiter = rateLimit({ maxRequests: 10, windowMs: 60 * 1000 });

function jsonResponse(body: object, status: number) {
    return new Response(JSON.stringify(body), {
        status,
        headers: { 'Content-Type': 'application/json' },
    });
}

async function findMessageById(
    id: string,
): Promise<
    | {
          message: IMessage & { _id: ObjectId };
          collection: Collection<IMessage>;
      }
    | { error: Response }
> {
    if (!ObjectId.isValid(id)) {
        return { error: jsonResponse({ error: 'Invalid message ID.' }, 400) };
    }

    const db = await connectToDatabase();
    const collection = db.collection<IMessage>('messages');
    const message = await collection.findOne({ _id: new ObjectId(id) });

    if (!message) {
        return { error: jsonResponse({ error: 'Message not found.' }, 404) };
    }

    return { message, collection };
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
        const session = await auth();
        if (!session || !session.user?.email) {
            return jsonResponse({ error: 'Not authenticated.' }, 401);
        }

        if (session.user.email !== process.env.ADMIN_EMAIL) {
            return jsonResponse({ error: 'Forbidden.' }, 403);
        }

        const { id } = await params;

        const found = await findMessageById(id);
        if ('error' in found) return found.error;

        await found.collection.updateOne(
            { _id: found.message._id },
            { $set: { status: 'read' } },
        );

        return jsonResponse(
            { message: 'Message marked as read.' },
            200,
        );
    } catch (error) {
        const msg =
            error instanceof Error ? error.message : 'Unknown error';
        console.error('Error in PATCH /api/messages/[id]:', msg);
        return jsonResponse(
            {
                error: 'Failed to update message. Database may be temporarily unavailable.',
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
        const session = await auth();
        if (!session || !session.user?.email) {
            return jsonResponse({ error: 'Not authenticated.' }, 401);
        }

        if (session.user.email !== process.env.ADMIN_EMAIL) {
            return jsonResponse({ error: 'Forbidden.' }, 403);
        }

        const { id } = await params;

        const found = await findMessageById(id);
        if ('error' in found) return found.error;

        await found.collection.deleteOne({ _id: found.message._id });

        return jsonResponse({ message: 'Message deleted successfully.' }, 200);
    } catch (error) {
        const msg =
            error instanceof Error ? error.message : 'Unknown error';
        console.error('Error in DELETE /api/messages/[id]:', msg);
        return jsonResponse(
            {
                error: 'Failed to delete message. Database may be temporarily unavailable.',
            },
            500,
        );
    }
}
