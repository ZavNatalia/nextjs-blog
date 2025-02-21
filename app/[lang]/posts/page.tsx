import { getAllPosts } from '@/lib/posts-util';
import type { Metadata } from 'next';
import Breadcrumbs, { Breadcrumb } from '@/components/ui/Breadcrumbs';
import { Locale } from '@/i18n-config';
import { getDictionary } from '@/get-dictionary';
import PostsGrid from '@/components/ui/posts/posts-grid/posts-grid';

export const metadata: Metadata = {
    title: 'All Posts',
    description: 'A list of all programming-related tutorials and posts!',
};

export default async function Posts(props: {
    params: Promise<{ lang: Locale }>;
}) {
    const { lang } = await props.params;
    const dictionary = await getDictionary(lang);
    const serverComponentDict = dictionary['server-component'] ?? {};
    const posts = getAllPosts();

    const breadcrumbs: Breadcrumb[] = [
        { title: serverComponentDict.main, link: '/' },
        { title: serverComponentDict.allPosts, link: '/posts' },
    ];

    return (
        <main className="page">
            <Breadcrumbs breadcrumbs={breadcrumbs} />
            <h2 className="mb-5 text-center text-2xl font-bold lg:mb-8 lg:text-4xl">
                {serverComponentDict.allPosts}
            </h2>
            {!posts && <div>No posts</div>}
            <PostsGrid posts={posts} dictionary={serverComponentDict} />
        </main>
    );
}
