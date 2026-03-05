import { redirect } from 'next/navigation';

import { auth } from '@/auth';
import Breadcrumbs, { Breadcrumb } from '@/components/ui/Breadcrumbs';
import UserProfile from '@/components/ui/profile/user-profile';
import { getDictionary } from '@/get-dictionary';
import { Locale } from '@/i18n-config';
import { connectToDatabase } from '@/lib/db';
import { IUser } from '@/lib/types/mongodb';

export async function generateMetadata(props: {
    params: Promise<{ lang: Locale }>;
}) {
    const { lang } = await props.params;
    const dictionary = getDictionary(lang)['profile-page'];
    return {
        title: dictionary.profile,
        description: dictionary.pageDescription,
    };
}

export default async function ProfilePage(props: {
    params: Promise<{ lang: Locale }>;
}) {
    const { lang } = await props.params;
    const session = await auth();

    if (!session) {
        redirect(`/${lang}/auth`);
    }
    const dictionary = getDictionary(lang)['profile-page'];

    const userEmail =
        session?.user?.email || dictionary.accountSection.noEmailProvided;

    let userName = session?.user?.name || '';

    try {
        const db = await connectToDatabase();
        const dbUser = await db
            .collection<IUser>('users')
            .findOne({ email: session.user.email });
        if (dbUser) {
            userName = dbUser.name || userName;
        }
    } catch (error) {
        console.error('Error fetching user profile:', error);
    }

    const breadcrumbs: Breadcrumb[] = [
        { title: dictionary.main, link: `/${lang}` },
        { title: dictionary.profile, link: `/${lang}/profile` },
    ];

    return (
        <main className="page">
            <Breadcrumbs breadcrumbs={breadcrumbs} />
            <UserProfile
                dictionary={dictionary}
                userEmail={userEmail}
                userName={userName}
                lang={lang}
            />
        </main>
    );
}
