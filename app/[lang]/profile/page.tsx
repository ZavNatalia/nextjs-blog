import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import Breadcrumbs, { Breadcrumb } from '@/components/ui/Breadcrumbs';
import UserProfile from '@/components/ui/profile/user-profile';
import { getDictionary } from '@/get-dictionary';
import { Locale } from '@/i18n-config';

export async function generateMetadata(props: {
    params: Promise<{ lang: Locale }>;
}) {
    const { lang } = await props.params;
    const dictionary = getDictionary(lang)?.['profile-page'];
    return {
        title: dictionary.profile,
        description: dictionary.pageDescription,
    };
}

export default async function ProfilePage(props: {
    params: Promise<{ lang: Locale }>;
}) {
    const session = await getServerSession();

    if (!session) {
        redirect('/auth');
    }

    const { lang } = await props.params;
    const dictionary = getDictionary(lang)?.['profile-page'];

    const breadcrumbs: Breadcrumb[] = [
        { title: dictionary.main, link: '/' },
        { title: dictionary.profile, link: '/profile' },
    ];

    return (
        <main className="page">
            <Breadcrumbs breadcrumbs={breadcrumbs} />
            <UserProfile
                dictionary={dictionary}
                userEmail={session?.user?.email || dictionary.noEmailProvided}
            />
        </main>
    );
}
