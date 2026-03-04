import NextAuth, { DefaultSession } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GitHubProvider from 'next-auth/providers/github';
import GoogleProvider from 'next-auth/providers/google';

import { verifyPassword } from '@/lib/auth';
import { connectToDatabase } from '@/lib/db';
import { rateLimit } from '@/lib/rate-limit';
import { IUser } from '@/lib/types/mongodb';

const loginLimiter = rateLimit({ maxRequests: 10, windowMs: 60 * 1000 });

declare module 'next-auth/jwt' {
    interface JWT {
        id?: string;
        email?: string;
        name?: string;
    }
}

declare module 'next-auth' {
    interface Session extends DefaultSession {
        user: {
            id?: string;
            email?: string;
            name?: string;
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
            async authorize(credentials, req) {
                const forwarded =
                    req?.headers?.['x-forwarded-for']?.toString() ?? '';
                const ip = forwarded
                    ? forwarded.split(',')[0].trim()
                    : 'unknown';

                const { success } = loginLimiter.check(ip);
                if (!success) {
                    throw new Error(
                        'Too many login attempts. Please try again later.',
                    );
                }

                if (
                    !credentials ||
                    !credentials.email ||
                    !credentials.password
                ) {
                    throw new Error('Missing email or password');
                }

                let db;
                try {
                    db = await connectToDatabase();
                } catch {
                    throw new Error(
                        'Service temporarily unavailable. Please try again later.',
                    );
                }

                const usersCollection = db.collection<IUser>('users');
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

                return {
                    id: user._id.toString(),
                    email: user.email,
                    name: user.name || null,
                };
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
        async signIn({ user, account }) {
            if (
                account?.provider &&
                account.provider !== 'credentials' &&
                user.email
            ) {
                try {
                    const db = await connectToDatabase();
                    await db.collection<IUser>('users').updateOne(
                        { email: user.email },
                        {
                            $setOnInsert: {
                                email: user.email,
                                password: '',
                                ...(user.name && { name: user.name }),
                            },
                        },
                        { upsert: true },
                    );
                } catch (error) {
                    console.error('Error saving OAuth user data:', error);
                    return false;
                }
            }
            return true;
        },

        async jwt({ token, user, trigger }) {
            if (user) {
                token.id = user.id;
                token.email = user.email || undefined;
                token.name = user.name || undefined;
            }
            if (trigger === 'update') {
                try {
                    const db = await connectToDatabase();
                    const dbUser = await db
                        .collection<IUser>('users')
                        .findOne({ email: token.email });
                    if (dbUser) {
                        token.name = dbUser.name || undefined;
                    }
                } catch (error) {
                    console.error('Error refreshing token:', error);
                }
            }
            return token;
        },

        async session({ session, token }) {
            session.user = {
                id: token.id,
                email: token.email || undefined,
                name: token.name || undefined,
            };
            return session;
        },
    },
});

export { handler as GET, handler as POST };
