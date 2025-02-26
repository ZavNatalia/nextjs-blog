import { getAllPosts } from '@/lib/posts-util';
import Breadcrumbs, { Breadcrumb } from '@/components/ui/Breadcrumbs';
import { Locale } from '@/i18n-config';
import { getDictionary } from '@/get-dictionary';
import PostsGrid from '@/components/ui/posts/posts-grid/posts-grid';

export async function generateMetadata(props: {
    params: Promise<{ lang: Locale }>
}) {
    const { lang } = await props.params;
    const dictionary = await getDictionary(lang)?.['posts-page'];
    return {
        title: dictionary.allPosts,
        description: dictionary.pageDescription,
    }
}

export default async function Posts(props: {
    params: Promise<{ lang: Locale }>
}) {
    const { lang } = await props.params;
    const dictionary = await getDictionary(lang)?.['posts-page'];
    const posts = getAllPosts(lang);

    const breadcrumbs: Breadcrumb[] = [
        { title: dictionary.main, link: '/' },
        { title: dictionary.allPosts, link: '/posts' },
    ];

    return (
        <main className="page">
            <Breadcrumbs breadcrumbs={breadcrumbs} />
            <h2 className="mb-5 text-center text-2xl font-bold lg:mb-8 lg:text-4xl">
                {dictionary.allPosts}
            </h2>
            {!posts && <div>No posts</div>}
            <PostsGrid posts={posts} dictionary={dictionary} lang={lang} />
        </main>
    );
}
