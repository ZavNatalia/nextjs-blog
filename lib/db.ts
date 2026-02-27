import { Db, MongoClient } from 'mongodb';

const connectionString = `mongodb+srv://${process.env.mongodb_username}:${process.env.mongodb_password}@${process.env.mongodb_clustername}.uncch6e.mongodb.net/${process.env.mongodb_database}?retryWrites=true&w=majority&appName=${process.env.mongodb_database}`;

const globalWithMongo = globalThis as typeof globalThis & {
    _mongoClient?: MongoClient;
};

let client: MongoClient;

if (process.env.NODE_ENV === 'development') {
    if (!globalWithMongo._mongoClient) {
        globalWithMongo._mongoClient = new MongoClient(connectionString);
    }
    client = globalWithMongo._mongoClient;
} else {
    client = new MongoClient(connectionString);
}

export async function connectToDatabase(): Promise<Db> {
    await client.connect();
    return client.db();
}
