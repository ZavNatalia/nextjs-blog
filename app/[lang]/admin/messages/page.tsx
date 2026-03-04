import { redirect } from 'next/navigation';
import { connection } from 'next/server';
import { getServerSession } from 'next-auth';

import MessagesPanel from '@/components/ui/messages/messages-panel';
import { getDictionary } from '@/get-dictionary';
import type { Locale } from '@/i18n-config';
import { i18n } from '@/i18n-config';
import { connectToDatabase } from '@/lib/db';
import { IMessage } from '@/lib/types/mongodb';

export async function generateStaticParams() {
    return i18n.locales.map((locale) => ({ lang: locale }));
}

export default async function MessagesPage(props: {
    params: Promise<{ lang: string }>;
}) {
    await connection();

    const session = await getServerSession();

    if (!session || session.user?.email !== process.env.ADMIN_EMAIL) {
        redirect('/');
    }

    const { lang } = await props.params;
    const dictionary = getDictionary(lang as Locale)['messages'];

    let serializedMessages: {
        _id: string;
        email: string;
        name: string;
        message: string;
        status: string;
        createdAt: string;
    }[] = [];

    try {
        const db = await connectToDatabase();
        const messages = await db
            .collection<IMessage>('messages')
            .find({})
            .sort({ createdAt: -1 })
            .limit(200)
            .toArray();

        serializedMessages = messages.map((m) => ({
            _id: m._id!.toString(),
            email: m.email,
            name: m.name,
            message: m.message,
            status: m.status ?? 'unread',
            createdAt: m.createdAt
                ? m.createdAt.toISOString()
                : new Date(0).toISOString(),
        }));
    } catch (error) {
        console.error('Failed to load messages:', error);
    }

    return (
        <main className="page overflow-x-auto">
            <MessagesPanel
                messages={serializedMessages}
                dictionary={dictionary}
                lang={lang}
            />
        </main>
    );
}
