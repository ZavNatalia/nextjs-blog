import { MongoClient } from "mongodb";
import { connectToDatabase } from "@/lib/db";
import { hashPassword } from "@/lib/auth";
import { NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
    if (request.method !== 'POST') {
        return new Response(JSON.stringify({ error: 'Method not allowed' }), {
            status: 405,
            headers: { 'Content-Type': 'application/json' },
        });
    }

    const data = await request.json();
    const { email, password } = data;

    if (!email || !email.includes("@") || !password || password.trim().length < 7) {
        return new Response(JSON.stringify({ error: "Invalid email or password." }), {
            status: 422,
            headers: { "Content-Type": "application/json" },
        });
    }

    let client: MongoClient | null = null;

    try {
        client = await connectToDatabase();
        const db = client.db();

        const hashedPassword = await hashPassword(password);

        const collection = db.collection("users");

        const existingUser = await collection.findOne({ email });
        if (existingUser) {
            return new Response(JSON.stringify({ error: "Unable to process your request. Please double-check your email and password or contact support if the issue persists." }), {
                status: 422,
                headers: { "Content-Type": "application/json" },
            });
        }

        const result = await collection.insertOne({
            email,
            password: hashedPassword,
        });
        console.log('result', result);

        return new Response(
            JSON.stringify({ message: `Created user with email ${email}` }),
            {
                status: 201,
                headers: { "Content-Type": "application/json" },
            }
        );
    } catch (error) {
        console.error("Error in handler:", error);
        return new Response(
            JSON.stringify({ error: "An internal server error occurred." }),
            {
                status: 500,
                headers: { "Content-Type": "application/json" },
            }
        );
    } finally {
        if (client) {
            await client.close();
        }
    }
}
