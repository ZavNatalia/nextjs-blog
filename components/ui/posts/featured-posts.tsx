import React from 'react';
import PostsGrid from '@/components/ui/posts/posts-grid/posts-grid';
import { getFeaturedPosts } from '@/lib/posts';
import Link from 'next/link';
import type { getDictionary } from '@/get-dictionary';
import { Locale } from '@/i18n-config';
import Script from 'next/script';

export const dynamic = 'force-static';
export const revalidate = 3600;

export default async function FeaturedPosts({
    dictionary,
    lang,
}: {
    dictionary: Awaited<ReturnType<typeof getDictionary>>['common'];
    lang: Locale;
}) {
    const featuredPosts = await getFeaturedPosts(lang);

    if (!featuredPosts || featuredPosts.length === 0) {
        return <p>No featured posts available.</p>;
    }

    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'ItemList',
        itemListElement: featuredPosts.map((post, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            name: post.title,
            url: `https://zav.me/${lang}/posts/${post.slug}`,
        })),
    };
    return (
        <div
            aria-label={dictionary.featuredPosts}
            role="region"
            className="flex flex-col items-center gap-5 px-4 py-4 md:py-6 lg:gap-8 lg:rounded-3xl lg:px-8 lg:py-8"
        >
            <h2 className="text-accent text-2xl font-bold lg:text-4xl">
                {dictionary.featuredPosts}
            </h2>

            <PostsGrid
                posts={featuredPosts}
                dictionary={dictionary}
                lang={lang}
            />
            <Script
                id="featured-posts-jsonld"
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />

            <Link
                href="/posts"
                className="button button-solid button-md"
                aria-label={dictionary.allPosts}
            >
                {dictionary.allPosts}
            </Link>
        </div>
    );
}
