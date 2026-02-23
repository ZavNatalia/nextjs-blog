import { NextRequest } from 'next/server';

import { hashPassword } from '@/lib/auth';
import clientPromise from '@/lib/db';
import { getClientIp,rateLimit } from '@/lib/rate-limit';
import { IUser } from '@/lib/types/mongodb';
import { signupSchema } from '@/lib/validations';

const limiter = rateLimit({ maxRequests: 5, windowMs: 15 * 60 * 1000 });

export async function POST(request: NextRequest) {
    const ip = getClientIp(request);
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

    const data = await request.json();
    const result = signupSchema.safeParse(data);

    if (!result.success) {
        return new Response(
            JSON.stringify({ error: result.error.issues[0].message }),
            {
                status: 422,
                headers: { 'Content-Type': 'application/json' },
            },
        );
    }

    const { email, password } = result.data;

    try {
        const client = await clientPromise;
        const db = client.db();
        const collection = db.collection<IUser>('users');

        const existingUser = await collection.findOne({ email });
        if (existingUser) {
            return new Response(
                JSON.stringify({
                    error: 'Unable to process your request. Please double-check your email and password or contact support if the issue persists.',
                }),
                {
                    status: 422,
                    headers: { 'Content-Type': 'application/json' },
                },
            );
        }

        const hashedPassword = await hashPassword(password);

        await collection.insertOne({
            email,
            password: hashedPassword,
        });

        return new Response(
            JSON.stringify({ message: `Created user with email ${email}` }),
            {
                status: 201,
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
