import { NextRequest } from 'next/server';
import { getServerSession } from 'next-auth';

import { connectToDatabase } from '@/lib/db';
import { getClientIp, rateLimit } from '@/lib/rate-limit';
import { IUser } from '@/lib/types/mongodb';
import { updateProfileSchema } from '@/lib/validations';

const limiter = rateLimit({ maxRequests: 10, windowMs: 15 * 60 * 1000 });

export async function PATCH(req: NextRequest) {
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

    const userEmail = session.user.email;

    if (!userEmail) {
        return new Response(
            JSON.stringify({ error: 'No email associated with session.' }),
            {
                status: 401,
                headers: { 'Content-Type': 'application/json' },
            },
        );
    }

    let data;
    try {
        data = await req.json();
    } catch {
        return new Response(
            JSON.stringify({ error: 'Invalid request body.' }),
            {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
            },
        );
    }

    const result = updateProfileSchema.safeParse(data);

    if (!result.success) {
        return new Response(
            JSON.stringify({ error: result.error.issues[0].message }),
            {
                status: 422,
                headers: { 'Content-Type': 'application/json' },
            },
        );
    }

    const { name } = result.data;

    try {
        const db = await connectToDatabase();

        const updateResult = await db
            .collection<IUser>('users')
            .updateOne({ email: userEmail }, { $set: { name } });

        if (updateResult.matchedCount === 0) {
            return new Response(JSON.stringify({ error: 'User not found.' }), {
                status: 404,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        await db
            .collection('comments')
            .updateMany(
                { authorEmail: userEmail },
                { $set: { authorName: name } },
            );

        return new Response(
            JSON.stringify({ message: 'Profile updated successfully.' }),
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
