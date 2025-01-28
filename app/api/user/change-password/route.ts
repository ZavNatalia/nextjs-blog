import { NextRequest } from 'next/server';
import { getServerSession } from 'next-auth';
import { connectToDatabase } from '@/lib/db';
import { hashPassword, verifyPassword } from '@/lib/auth';

export async function PATCH(req: NextRequest) {
    if (req.method !== 'PATCH') {
        return new Response(JSON.stringify({ error: 'Method not allowed' }), {
            status: 405,
            headers: { 'Content-Type': 'application/json' },
        });
    }

    const session = await getServerSession();

    if (!session) {
        return new Response(JSON.stringify({ error: 'Not authenticated!' }), {
            status: 401,
            headers: { 'Content-Type': 'application/json' },
        });
    }

    const data = await req.json();
    const { oldPassword, newPassword } = data;

    const userEmail = session.user.email;

    let client;
    try {
        client = await connectToDatabase();
        const db = client.db();
        const usersCollection = db.collection('users');

        const existingUser = await usersCollection.findOne({ email: userEmail });

        if (!existingUser) {
            return new Response(JSON.stringify({ error: 'User not found.' }), {
                status: 404,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        const passwordsAreEqual = await verifyPassword(oldPassword, existingUser.password);
        if (!passwordsAreEqual) {
            return new Response(
                JSON.stringify({ error: 'Old password is incorrect.' }),
                {
                    status: 403,
                    headers: { 'Content-Type': 'application/json' },
                }
            );
        }

        const hashedPassword = await hashPassword(newPassword);

        await usersCollection.updateOne(
            { email: userEmail },
            { $set: { password: hashedPassword } }
        );

        return new Response(
            JSON.stringify({ message: 'Password updated successfully.' }),
            {
                status: 200,
                headers: { 'Content-Type': 'application/json' },
            }
        );
    } catch (error) {
        console.error('Error in handler:', error);
        return new Response(
            JSON.stringify({ error: 'An internal server error occurred.' }),
            {
                status: 500,
                headers: { 'Content-Type': 'application/json' },
            }
        );
    } finally {
        if (client) {
            await client.close();
        }
    }
}
