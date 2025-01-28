import { Metadata } from 'next';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import Breadcrumbs, { Breadcrumb } from '@/components/ui/breadcrumbs';
import { UserProfile } from '@/components/ui/profile/user-profile';

export const metadata: Metadata = {
    title: 'Profile',
    description: 'Profile page',
};

export default async function Profile() {
    const session = await getServerSession();

    if (!session) {
        redirect('/auth');
    }

    const breadcrumbs: Breadcrumb[] = [
        { title: 'main', link: '/' },
        { title: 'profile', link: '/profile' },
    ];

    return (
        <main className="page">
            <Breadcrumbs breadcrumbs={breadcrumbs} />
            <UserProfile />
        </main>
    );
}
