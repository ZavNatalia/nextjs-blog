import { Metadata } from 'next';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import Breadcrumbs, { Breadcrumb } from '@/components/ui/Breadcrumbs';
import UserProfile from '@/components/ui/profile/user-profile';
import { getDictionary } from '@/get-dictionary';
import { Locale } from '@/i18n-config';

export const metadata: Metadata = {
    title: 'Profile',
    description: 'Profile page',
};

export default async function Profile(props: {
    params: Promise<{ lang: Locale }>;
}) {
    const session = await getServerSession();

    if (!session) {
        redirect('/auth');
    }

    const { lang } = await props.params;
    const dictionary = await getDictionary(lang);
    const profileDict = dictionary['profile-page'] ?? {};

    const breadcrumbs: Breadcrumb[] = [
        { title: profileDict.main, link: '/' },
        { title: profileDict.profile, link: '/profile' },
    ];

    return (
        <main className="page">
            <Breadcrumbs breadcrumbs={breadcrumbs} />
            <UserProfile
                dictionary={profileDict}
                userEmail={session?.user?.email || profileDict.noEmailProvided} />
        </main>
    );
}
