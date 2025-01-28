import NextAuth, { AuthOptions, DefaultSession } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { connectToDatabase } from "@/lib/db";
import { verifyPassword } from "@/lib/auth";
import { MongoClient } from "mongodb";

declare module "next-auth/jwt" {
    interface JWT {
        email?: string;
    }
}

declare module "next-auth" {
    interface Session extends DefaultSession {
        user: {
            email?: string;
        } & DefaultSession["user"];
    }
}

export const authOptions: AuthOptions = {
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

                const usersCollection = client.db().collection("users");
                const user = await usersCollection.findOne({ email: credentials.email });

                if (!user) {
                    await client.close();
                    throw new Error("Invalid email or password");
                }

                const isValid = await verifyPassword(credentials.password, user.password);
                if (!isValid) {
                    await client.close();
                    throw new Error("Invalid email or password");
                }

                await client.close();

                return { id: user._id, email: user.email };
            },
        }),
    ],
    secret: process.env.NEXTAUTH_SECRET,
    session: {
        strategy: "jwt",
    },
    pages: {
        signIn: "/auth/signin",
        changePassword: "/user/change-password"
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
            if (token.email) {
                session.user = {
                    id: token.id,
                    email: token.email,
                };
            }
            return session;
        },
    },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
