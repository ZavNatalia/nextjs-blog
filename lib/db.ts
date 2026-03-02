import { Db, MongoClient } from 'mongodb';

const connectionString = `mongodb+srv://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASSWORD}@cluster0.uncch6e.mongodb.net/?retryWrites=true&w=majority&appName=nextjs-blog`;

const clientOptions = {
    connectTimeoutMS: 10000,
    serverSelectionTimeoutMS: 10000,
};

const globalWithMongo = globalThis as typeof globalThis & {
    _mongoClient?: MongoClient;
};

let client: MongoClient;

if (process.env.NODE_ENV === 'development') {
    if (!globalWithMongo._mongoClient) {
        globalWithMongo._mongoClient = new MongoClient(
            connectionString,
            clientOptions,
        );
    }
    client = globalWithMongo._mongoClient;
} else {
    client = new MongoClient(connectionString, clientOptions);
}

export async function connectToDatabase(): Promise<Db> {
    await client.connect();
    const dbName =
        process.env.NODE_ENV === 'development'
            ? process.env.MONGODB_DATABASE_DEV
            : process.env.MONGODB_DATABASE;
    return client.db(dbName);
}
