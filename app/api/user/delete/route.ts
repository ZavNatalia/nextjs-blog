import { getServerSession } from 'next-auth';
import { connectToDatabase } from '@/lib/db';
import { MongoClient } from 'mongodb';

export async function DELETE() {
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

        const client: MongoClient = await connectToDatabase();
        const db = client.db();
        const usersCollection = db.collection('users');

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

        await client.close();

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
