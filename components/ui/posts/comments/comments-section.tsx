import Link from 'next/link';
import { connection } from 'next/server';
import { getServerSession } from 'next-auth';

import CommentForm from '@/components/ui/posts/comments/comment-form';
import CommentItem from '@/components/ui/posts/comments/comment-item';
import { getDictionary } from '@/get-dictionary';
import { Locale } from '@/i18n-config';
import clientPromise from '@/lib/db';
import type { CommentStatus } from '@/lib/types/mongodb';
import { IComment } from '@/lib/types/mongodb';

export default async function CommentsSection({
    postSlug,
    lang,
}: {
    postSlug: string;
    lang: Locale;
}) {
    await connection();

    const [session, dictionary] = await Promise.all([
        getServerSession(),
        Promise.resolve(getDictionary(lang)),
    ]);

    const dict = dictionary.comments;

    let serializedComments: {
        _id: string;
        postSlug: string;
        authorEmail: string;
        authorName: string;
        content: string;
        status: CommentStatus;
        createdAt: string;
        updatedAt?: string;
    }[] = [];

    try {
        const client = await clientPromise;
        const db = client.db();
        const userEmail = session?.user?.email;
        const query = userEmail
            ? {
                  postSlug,
                  $or: [
                      { status: 'approved' as const },
                      { status: 'pending' as const, authorEmail: userEmail },
                  ],
              }
            : { postSlug, status: 'approved' as const };
        const comments = await db
            .collection<IComment>('comments')
            .find(query)
            .sort({ createdAt: -1 })
            .toArray();

        serializedComments = comments.map((c) => ({
            _id: c._id!.toString(),
            postSlug: c.postSlug,
            authorEmail: c.authorEmail,
            authorName: c.authorName,
            content: c.content,
            status: c.status,
            createdAt: c.createdAt.toISOString(),
            updatedAt: c.updatedAt?.toISOString(),
        }));
    } catch {
        // MongoDB unavailable — render comments section with empty list
    }

    return (
        <section className="mx-auto mt-10 w-full border-t border-border-500 p-3 pt-8 md:p-4 lg:max-w-7xl lg:px-10">
            <h2 className="mb-6 text-xl font-bold lg:text-2xl">{dict.title}</h2>

            {serializedComments.length === 0 ? (
                <p className="mb-6 text-secondary">{dict.noComments}</p>
            ) : (
                <div className="mb-8 flex flex-col gap-4">
                    {serializedComments.map((comment) => (
                        <CommentItem
                            key={comment._id}
                            comment={comment}
                            currentUserEmail={session?.user?.email ?? null}
                            dictionary={dict}
                        />
                    ))}
                </div>
            )}

            {session ? (
                <CommentForm postSlug={postSlug} dictionary={dict} />
            ) : (
                <div className="rounded-xl bg-background-secondary p-6 text-center shadow-sm">
                    <p className="mb-3 text-secondary">
                        {dict.signInToComment}
                    </p>
                    <Link
                        href={`/${lang}/auth?callbackUrl=/${lang}/posts/${postSlug}`}
                        className="button button-solid button-md"
                    >
                        {dict.signIn}
                    </Link>
                </div>
            )}
        </section>
    );
}
