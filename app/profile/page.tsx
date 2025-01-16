import { getAllPosts } from '@/lib/posts-util';
import type { Metadata } from 'next';
import Breadcrumbs, { Breadcrumb } from '@/components/ui/breadcrumbs';

export const metadata: Metadata = {
    title: 'Profile',
    description: 'Profile',
};

export default function Profile() {
    const posts = getAllPosts();

    const breadcrumbs: Breadcrumb[] = [
        { title: 'main', link: '/' },
        { title: 'profile', link: '/profile' },
    ];

    return (
        <main className="page">
            <Breadcrumbs breadcrumbs={breadcrumbs} />
            Profile
        </main>
    );
}
