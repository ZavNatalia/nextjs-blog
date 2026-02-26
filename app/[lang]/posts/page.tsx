import React, { Suspense } from 'react';

import BackToTopButton from '@/components/ui/BackToTopButton';
import Breadcrumbs, { Breadcrumb } from '@/components/ui/Breadcrumbs';
import PostsGridSkeleton from '@/components/ui/posts/posts-grid/posts-grid-skeleton';
import PostsPageClient from '@/components/ui/posts/posts-page-client';
import { getDictionary } from '@/get-dictionary';
import { Locale } from '@/i18n-config';
import { getAllPosts } from '@/lib/posts';

export async function generateMetadata(props: {
    params: Promise<{ lang: Locale }>;
}) {
    const { lang } = await props.params;
    const dictionary = await getDictionary(lang)['posts-page'];
    const baseUrl = 'https://zav.me';
    const path = 'posts';

    return {
        title: dictionary.allPosts,
        description: dictionary.pageDescription,
        alternates: {
            canonical: `${baseUrl}/${lang}/${path}`,
            languages: {
                en: `${baseUrl}/en/${path}`,
                ru: `${baseUrl}/ru/${path}`,
            },
        },
    };
}

async function AllPostsWithSearch({
    lang,
    dictionary,
}: {
    lang: Locale;
    dictionary: Awaited<ReturnType<typeof getDictionary>>['posts-page'];
}) {
    const posts = await getAllPosts(lang);

    return (
        <PostsPageClient posts={posts} dictionary={dictionary} lang={lang} />
    );
}

export default async function Posts(props: {
    params: Promise<{ lang: Locale }>;
}) {
    const { lang } = await props.params;
    const dictionary = await getDictionary(lang)['posts-page'];

    const breadcrumbs: Breadcrumb[] = [
        { title: dictionary.main, link: '/' },
        { title: dictionary.allPosts, link: '/posts' },
    ];

    return (
        <main className="page">
            <Breadcrumbs breadcrumbs={breadcrumbs} />
            <Suspense fallback={<PostsGridSkeleton />}>
                <AllPostsWithSearch lang={lang} dictionary={dictionary} />
            </Suspense>
            <BackToTopButton />
        </main>
    );
}
