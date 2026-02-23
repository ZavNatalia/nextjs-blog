'use client';

import { useMemo, useState } from 'react';

import { IPost } from '@/components/ui/posts/post-card/post-card';
import PostsGrid from '@/components/ui/posts/posts-grid/posts-grid';
import { Locale } from '@/i18n-config';

export default function PostsPageClient({
    posts,
    dictionary,
    lang,
}: {
    posts: IPost[];
    dictionary: {
        readMore: string;
        minRead: string;
        searchPlaceholder: string;
        noSearchResults: string;
        noPosts: string;
    };
    lang: Locale;
}) {
    const [search, setSearch] = useState('');

    const filteredPosts = useMemo(() => {
        if (!search.trim()) return posts;
        const query = search.toLowerCase();
        return posts.filter(
            (post) =>
                post.title.toLowerCase().includes(query) ||
                post.excerpt.toLowerCase().includes(query),
        );
    }, [posts, search]);

    if (!posts.length) {
        return <p className="text-secondary">{dictionary.noPosts}</p>;
    }

    return (
        <div className="flex w-full flex-col gap-6">
            <input
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={dictionary.searchPlaceholder}
                className="input w-full"
            />
            {filteredPosts.length > 0 ? (
                <PostsGrid
                    posts={filteredPosts}
                    dictionary={dictionary}
                    lang={lang}
                />
            ) : (
                <p className="text-secondary">
                    {dictionary.noSearchResults}
                </p>
            )}
        </div>
    );
}
