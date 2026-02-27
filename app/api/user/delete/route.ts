import { NextRequest } from 'next/server';
import { getServerSession } from 'next-auth';

import { connectToDatabase } from '@/lib/db';
import { getClientIp, rateLimit } from '@/lib/rate-limit';
import { IUser } from '@/lib/types/mongodb';

const limiter = rateLimit({ maxRequests: 3, windowMs: 15 * 60 * 1000 });

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
            return new Response(
                JSON.stringify({ error: 'Not authenticated.' }),
                {
                    status: 401,
                    headers: { 'Content-Type': 'application/json' },
                },
            );
        }

        const userEmail = session.user.email;

        const db = await connectToDatabase();
        const usersCollection = db.collection<IUser>('users');

        const user = await usersCollection.findOne({ email: userEmail });
        if (!user) {
            return new Response(JSON.stringify({ error: 'User not found.' }), {
                status: 404,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        const deleteResult = await usersCollection.deleteOne({
            email: userEmail,
        });

        if (deleteResult.deletedCount === 0) {
            return new Response(
                JSON.stringify({ error: 'Failed to delete account.' }),
                {
                    status: 500,
                    headers: { 'Content-Type': 'application/json' },
                },
            );
        }

        return new Response(
            JSON.stringify({ message: 'Account deleted successfully.' }),
            {
                status: 200,
                headers: { 'Content-Type': 'application/json' },
            },
        );
    } catch (error) {
        console.error('Error deleting user:', error);
        return new Response(
            JSON.stringify({ error: 'Internal server error.' }),
            {
                status: 500,
                headers: { 'Content-Type': 'application/json' },
            },
        );
    }
}
