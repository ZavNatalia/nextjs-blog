import AllPosts from '@/components/ui/posts/all-posts';
import { getAllPosts } from '@/lib/posts-util';
import type { Metadata } from 'next';
import Breadcrumbs, { Breadcrumb } from '@/components/ui/breadcrumbs';

export const metadata: Metadata = {
    title: "All Posts",
    description: "A list of all programming-related tutorials and posts!",
};

export default function Posts() {
    const posts = getAllPosts();

    const breadcrumbs: Breadcrumb[] = [
        { title: 'main', link: '/' },
        { title: 'all posts', link: '/posts' },
    ];

    return (
        <main className="flex min-h-full flex-col items-center justify-between px-32 py-8 w-full gap-8">
            <Breadcrumbs breadcrumbs={breadcrumbs}/>
            <AllPosts posts={posts}/>
        </main>
    )
}