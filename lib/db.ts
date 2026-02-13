import { MongoClient } from 'mongodb';

// const connectionString = `mongodb+srv://${process.env.mongodb_username}:${process.env.mongodb_password}@${process.env.mongodb_clustername}.1wiukyn.mongodb.net/${process.env.mongodb_database}?retryWrites=true&w=majority`;
const connectionString = `mongodb+srv://${process.env.mongodb_username}:${process.env.mongodb_password}@${process.env.mongodb_clustername}.uncch6e.mongodb.net/?appName=${process.env.mongodb_database}`;

if (!connectionString) {
    throw new Error('MONGODB_URI is not defined in the environment variables');
}

let clientPromise: Promise<MongoClient>;

const globalWithMongo = globalThis as typeof globalThis & {
    _mongoClientPromise?: Promise<MongoClient>;
};

if (process.env.NODE_ENV === 'development') {
    if (!globalWithMongo._mongoClientPromise) {
        const client = new MongoClient(connectionString);
        globalWithMongo._mongoClientPromise = client.connect();
    }
    clientPromise = globalWithMongo._mongoClientPromise;
} else {
    const client = new MongoClient(connectionString);
    clientPromise = client.connect();
}

export default clientPromise;
