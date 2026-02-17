import NextAuth, { DefaultSession } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import clientPromise from '@/lib/db';
import { verifyPassword } from '@/lib/auth';
import GitHubProvider from 'next-auth/providers/github';
import GoogleProvider from 'next-auth/providers/google';
import { IUser } from '@/lib/types/mongodb';

declare module 'next-auth/jwt' {
    interface JWT {
        id?: string;
        email?: string;
    }
}

declare module 'next-auth' {
    interface Session extends DefaultSession {
        user: {
            id?: string;
            email?: string;
        } & DefaultSession['user'];
    }
}

const handler = NextAuth({
    providers: [
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                email: {
                    label: 'Email',
                    type: 'text',
                    placeholder: 'example@email.com',
                },
                password: { label: 'Password', type: 'password' },
            },
            async authorize(credentials) {
                if (
                    !credentials ||
                    !credentials.email ||
                    !credentials.password
                ) {
                    throw new Error('Missing email or password');
                }

                const client = await clientPromise;
                const usersCollection = client.db().collection<IUser>('users');
                const user = await usersCollection.findOne({
                    email: credentials.email,
                });

                if (!user) {
                    throw new Error('Invalid email or password');
                }

                const isValid = await verifyPassword(
                    credentials.password,
                    user.password,
                );
                if (!isValid) {
                    throw new Error('Invalid email or password');
                }

                return { id: user._id.toString(), email: user.email };
            },
        }),
        GitHubProvider({
            clientId: process.env.GITHUB_ID!,
            clientSecret: process.env.GITHUB_SECRET!,
        }),
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        }),
    ],
    secret: process.env.NEXTAUTH_SECRET,
    session: {
        strategy: 'jwt',
    },
    pages: {
        signIn: '/auth/signin',
    },
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                token.email = user.email || undefined;
            }
            return token;
        },

        async session({ session, token }) {
            session.user = {
                id: token.id,
                email: token.email || undefined,
            };
            return session;
        },
    },
});

export { handler as GET, handler as POST };
