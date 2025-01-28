import NextAuth, { DefaultSession } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { connectToDatabase } from "@/lib/db";
import { verifyPassword } from "@/lib/auth";
import { MongoClient } from "mongodb";

declare module "next-auth/jwt" {
    interface JWT {
        id?: string;
        email?: string;
    }
}

declare module "next-auth" {
    interface Session extends DefaultSession {
        user: {
            id?: string;
            email?: string;
        } & DefaultSession["user"];
    }
}

const handler = NextAuth({
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "text", placeholder: "example@email.com" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                if (!credentials || !credentials.email || !credentials.password) {
                    throw new Error("Missing email or password");
                }

                const client: MongoClient = await connectToDatabase();
                if (!client) {
                    throw new Error("Failed to connect to database");
                }

                try {
                    const usersCollection = client.db().collection("users");
                    const user = await usersCollection.findOne({ email: credentials.email });

                    if (!user) {
                        throw new Error("Invalid email or password");
                    }

                    const isValid = await verifyPassword(credentials.password, user.password);
                    if (!isValid) {
                        throw new Error("Invalid email or password");
                    }

                    return { id: user._id.toString(), email: user.email };
                } finally {
                    await client.close();
                }
            },
        }),
    ],
    secret: process.env.NEXTAUTH_SECRET,
    session: {
        strategy: "jwt",
    },
    pages: {
        signIn: "/auth/signin",
        changePassword: "/user/change-password",
    },
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                token.email = user.email;
            }
            return token;
        },

        async session({ session, token }) {
            session.user = {
                id: token.id,
                email: token.email,
            };
            return session;
        },
    },
});

export { handler as GET, handler as POST };
