import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import GitHub from 'next-auth/providers/github';
import Google from 'next-auth/providers/google';

import { isAdmin, verifyPassword } from '@/lib/auth';
import { connectToDatabase } from '@/lib/db';
import { rateLimit } from '@/lib/rate-limit';
import { IUser } from '@/lib/types/mongodb';

const loginLimiter = rateLimit({ maxRequests: 10, windowMs: 60 * 1000 });

declare module 'next-auth' {
    interface Session {
        user: {
            id: string;
            email?: string;
            name?: string;
            image?: string | null;
            isAdmin?: boolean;
        };
    }
}

export const { auth, handlers, signIn, signOut } = NextAuth({
    providers: [
        Credentials({
            name: 'Credentials',
            credentials: {
                email: {
                    label: 'Email',
                    type: 'text',
                    placeholder: 'example@email.com',
                },
                password: { label: 'Password', type: 'password' },
            },
            async authorize(credentials, request) {
                const ip =
                    request?.headers?.get('x-real-ip')?.trim() ||
                    request?.headers
                        ?.get('x-forwarded-for')
                        ?.split(',')
                        .pop()
                        ?.trim() ||
                    'unknown';

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

                const email = credentials.email as string;
                const password = credentials.password as string;

                let db;
                try {
                    db = await connectToDatabase();
                } catch {
                    throw new Error(
                        'Service temporarily unavailable. Please try again later.',
                    );
                }

                const usersCollection = db.collection<IUser>('users');
                const user = await usersCollection.findOne({ email });

                if (!user) {
                    throw new Error('Invalid email or password');
                }

                const isValid = await verifyPassword(password, user.password);
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
        GitHub({
            clientId: process.env.AUTH_GITHUB_ID,
            clientSecret: process.env.AUTH_GITHUB_SECRET,
        }),
        Google({
            clientId: process.env.AUTH_GOOGLE_ID,
            clientSecret: process.env.AUTH_GOOGLE_SECRET,
        }),
    ],
    session: {
        strategy: 'jwt',
    },
    pages: {
        signIn: '/auth/signin',
    },
    cookies: {
        sessionToken: {
            name: 'next-auth.session-token',
        },
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
                token.isAdmin = isAdmin(user.email);
            }
            if (trigger === 'update') {
                try {
                    const db = await connectToDatabase();
                    const dbUser = await db
                        .collection<IUser>('users')
                        .findOne({ email: token.email as string });
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
            if (session.user) {
                session.user.id = (token.id as string) ?? '';
                session.user.email = (token.email as string) ?? '';
                session.user.name = (token.name as string) ?? '';
                session.user.isAdmin = (token.isAdmin as boolean) ?? false;
            }
            return session;
        },
    },
});
