import { Db } from 'mongodb';
import { NextRequest } from 'next/server';

import clientPromise from '@/lib/db';
import { getClientIp, rateLimit } from '@/lib/rate-limit';
import { IMessage } from '@/lib/types/mongodb';
import { contactSchema } from '@/lib/validations';

const limiter = rateLimit({ maxRequests: 5, windowMs: 15 * 60 * 1000 });

async function insertMessage(db: Db, message: IMessage): Promise<IMessage> {
    const collection = db.collection<IMessage>('messages');
    const result = await collection.insertOne(message);
    return { ...message, _id: result.insertedId };
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

    try {
        const rawBody = await req.json();
        const result = contactSchema.safeParse(rawBody);

        if (!result.success) {
            return new Response(
                JSON.stringify({ error: result.error.issues[0].message }),
                {
                    status: 400,
                    headers: { 'Content-Type': 'application/json' },
                },
            );
        }

        const { token, ...body } = result.data;

        const secretKey = process.env.TURNSTILE_SECRET_KEY;
        const verifyRes = await fetch(
            'https://challenges.cloudflare.com/turnstile/v0/siteverify',
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    secret: secretKey,
                    response: token,
                }),
            },
        );

        const { success } = await verifyRes.json();

        if (!success) {
            return new Response(
                JSON.stringify({ error: 'Captcha verification failed' }),
                {
                    status: 400,
                    headers: { 'Content-Type': 'application/json' },
                },
            );
        }

        const client = await clientPromise;
        const db = client.db();

        const newMessage = await insertMessage(db, body as IMessage);

        return new Response(
            JSON.stringify({
                message: 'Successfully stored message!',
                newMessage: newMessage,
            }),
            {
                status: 201,
                headers: { 'Content-Type': 'application/json' },
            },
        );
    } catch (error) {
        console.error('Error in POST handler:', error);
        return new Response(
            JSON.stringify({ error: 'An internal server error occurred.' }),
            {
                status: 500,
                headers: { 'Content-Type': 'application/json' },
            },
        );
    }
}
