import { MongoClient } from 'mongodb';

const connectionString = `mongodb+srv://${process.env.mongodb_username}:${process.env.mongodb_password}@${process.env.mongodb_clustername}.1wiukyn.mongodb.net/${process.env.mongodb_database}?retryWrites=true&w=majority`;

if (!connectionString) {
    throw new Error('MONGODB_URI is not defined in the environment variables');
}

export async function connectToDatabase(): Promise<MongoClient> {
    const client = new MongoClient(connectionString);
    await client.connect();
    return client;
}
