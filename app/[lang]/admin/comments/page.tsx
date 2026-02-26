import { redirect } from 'next/navigation';
import { connection } from 'next/server';
import { getServerSession } from 'next-auth';

import ModerationPanel from '@/components/ui/posts/comments/moderation-panel';
import { getDictionary } from '@/get-dictionary';
import type { Locale } from '@/i18n-config';
import { i18n } from '@/i18n-config';
import clientPromise from '@/lib/db';
import { IComment } from '@/lib/types/mongodb';

export async function generateStaticParams() {
    return i18n.locales.map((locale) => ({ lang: locale }));
}

export default async function ModerationPage(props: {
    params: Promise<{ lang: string }>;
}) {
    await connection();

    const session = await getServerSession();

    if (!session || session.user?.email !== process.env.ADMIN_EMAIL) {
        redirect('/');
    }

    const { lang } = await props.params;
    const dictionary = (await getDictionary(lang as Locale))['moderation'];

    let serializedComments: {
        _id: string;
        postSlug: string;
        authorEmail: string;
        authorName: string;
        content: string;
        status: string;
        createdAt: string;
        updatedAt?: string;
    }[] = [];

    try {
        const client = await clientPromise;
        const db = client.db();
        const comments = await db
            .collection<IComment>('comments')
            .find({})
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
        // MongoDB unavailable — render with empty list
    }

    return (
        <main className="page">
            <ModerationPanel
                comments={serializedComments}
                dictionary={dictionary}
                lang={lang}
            />
        </main>
    );
}
