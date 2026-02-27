import { NextRequest } from 'next/server';
import { getServerSession } from 'next-auth';

import { hashPassword, verifyPassword } from '@/lib/auth';
import { connectToDatabase } from '@/lib/db';
import { getClientIp, rateLimit } from '@/lib/rate-limit';
import { IUser } from '@/lib/types/mongodb';
import { changePasswordSchema } from '@/lib/validations';

const limiter = rateLimit({ maxRequests: 5, windowMs: 15 * 60 * 1000 });

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

    const data = await req.json();
    const result = changePasswordSchema.safeParse(data);

    if (!result.success) {
        return new Response(
            JSON.stringify({ error: result.error.issues[0].message }),
            {
                status: 422,
                headers: { 'Content-Type': 'application/json' },
            },
        );
    }

    const { oldPassword, newPassword } = result.data;

    const userEmail = session.user.email;

    try {
        const db = await connectToDatabase();
        const usersCollection = db.collection<IUser>('users');

        const existingUser = await usersCollection.findOne({
            email: userEmail,
        });

        if (!existingUser) {
            return new Response(JSON.stringify({ error: 'User not found.' }), {
                status: 404,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        const passwordsAreEqual = await verifyPassword(
            oldPassword,
            existingUser.password,
        );
        if (!passwordsAreEqual) {
            return new Response(
                JSON.stringify({ error: 'Old password is incorrect.' }),
                {
                    status: 403,
                    headers: { 'Content-Type': 'application/json' },
                },
            );
        }

        const hashedPassword = await hashPassword(newPassword);

        await usersCollection.updateOne(
            { email: userEmail },
            { $set: { password: hashedPassword } },
        );

        return new Response(
            JSON.stringify({ message: 'Password updated successfully.' }),
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
