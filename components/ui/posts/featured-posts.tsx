import React, { Suspense } from 'react';
import PostsGrid from '@/components/ui/posts/posts-grid/posts-grid';
import { getFeaturedPosts } from '@/lib/posts-util';
import Link from 'next/link';
import type { getDictionary } from '@/get-dictionary';
import { Locale } from '@/i18n-config';
import PostsGridSkeleton from '@/components/ui/posts/posts-grid/posts-grid-skeleton';

async function FeaturedPostsList({
    lang,
    dictionary,
}: {
    lang: Locale;
    dictionary: any;
}) {
    const featuredPosts = await getFeaturedPosts(lang);

    if (!featuredPosts || featuredPosts.length === 0) {
        return <p>No featured posts available.</p>;
    }

    return (
        <PostsGrid posts={featuredPosts} dictionary={dictionary} lang={lang} />
    );
}

export default function FeaturedPosts({
    dictionary,
    lang,
}: {
    dictionary: Awaited<ReturnType<typeof getDictionary>>['common'];
    lang: Locale;
}) {
    return (
        <div className="flex flex-col items-center gap-5 px-4 py-4 md:py-6 lg:gap-8 lg:rounded-3xl lg:bg-primary/60 lg:px-8 lg:py-8 dark:lg:bg-dark-strong/50">
            <h2 className="text-2xl font-bold text-accent lg:text-4xl">
                {dictionary.featuredPosts}
            </h2>
            <Suspense fallback={<PostsGridSkeleton />}>
                <FeaturedPostsList lang={lang} dictionary={dictionary} />
            </Suspense>
            <Link href="/posts" className="button-accent">
                {dictionary.allPosts}
            </Link>
        </div>
    );
}
