import { Db, MongoClient } from 'mongodb';

export interface IMessage {
    email: string,
    name: string,
    message: string,
    id?: string
}

const uri = process.env.MONGODB_URI;

async function connectToDatabase(): Promise<MongoClient> {
    const client = new MongoClient(uri);
    await client.connect();
    return client;
}

function validateMessage(message: Partial<IMessage>): string | null {
    if (!message.email || !message.email.includes('@')) {
        return 'Invalid email address.';
    }
    if (!message.name || message.name.trim() === '') {
        return 'Name is required.';
    }
    if (!message.message || message.message.trim() === '') {
        return 'Message is required.';
    }
    return null;
}

async function insertMessage(db: Db, message: IMessage): Promise<IMessage> {
    const collection = db.collection('messages');
    const result = await collection.insertOne(message);
    return {...message, id: result.insertedId.toString()};
}

export async function POST(req) {
    if (req.method !== 'POST') {
        return new Response(JSON.stringify({error: 'Method not allowed'}), {
            status: 405,
            headers: {'Content-Type': 'application/json'},
        });
    }

    let client: MongoClient | null = null;

    try {
        const body: IMessage = await req.json();

        const validationError = validateMessage(body);
        if (validationError) {
            return new Response(JSON.stringify({error: validationError}), {
                status: 400,
                headers: {'Content-Type': 'application/json'},
            });
        }

        client = await connectToDatabase();
        const db = client.db('blog');

        const newMessage = await insertMessage(db, body);

        return new Response(JSON.stringify({
            message: 'Successfully stored message!',
            newMessage: newMessage,
        }), {
            status: 201,
            headers: {'Content-Type': 'application/json'},
        });
    } catch (error) {
        console.error('Error in POST handler:', error);
        return new Response(JSON.stringify({error: 'An internal server error occurred.'}), {
            status: 500,
            headers: {'Content-Type': 'application/json'},
        });
    } finally {
        if (client) {
            await client.close();
        }
    }
}