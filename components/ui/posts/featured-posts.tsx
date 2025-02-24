import PostsGrid from '@/components/ui/posts/posts-grid/posts-grid';
import { getFeaturedPosts } from '@/lib/posts-util';
import Link from 'next/link';
import type { getDictionary } from '@/get-dictionary';
import { Locale } from '@/i18n-config';

export default function FeaturedPosts({
                                          dictionary,
                                          lang,
                                      }: {
    dictionary: Awaited<ReturnType<typeof getDictionary>>['server-component'],
    lang: Locale
}) {
    const featuredPosts = getFeaturedPosts();

    if (!featuredPosts) {
        return;
    }
    return (
        <div
            className="flex flex-col items-center gap-5 px-4 py-4 md:py-6 lg:gap-8 lg:rounded-3xl lg:bg-primary/60 dark:lg:bg-dark-strong/50 lg:px-8 lg:py-8">
            <h2 className="text-2xl font-bold text-accent lg:text-4xl">
                {dictionary.featuredPosts}
            </h2>
            <PostsGrid posts={featuredPosts} dictionary={dictionary} lang={lang} />
            <Link href="/posts" className="button-accent">
                {dictionary.allPosts}
            </Link>
        </div>
    );
}
