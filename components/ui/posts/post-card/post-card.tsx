'use client';
import Link from 'next/link';

import { getLocale } from '@/components/utils/getLocale';
import { Locale } from '@/i18n-config';

export interface IPost {
    slug: string;
    title: string;
    date: string;
    image?: string;
    excerpt: string;
    content?: string;
    isFeatured: boolean;
    readingTime?: number;
}

export default function PostCard({
    post,
    dictionary,
    lang,
}: {
    post: IPost;
    dictionary: { readMore: string; minRead?: string };
    lang: Locale;
}) {
    const { title, date, excerpt, slug, readingTime } = post;

    const formattedDate = new Date(date).toLocaleDateString(getLocale(lang), {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
    });

    const linkPath = `posts/${slug}`;

    return (
        <li className="h-fit w-full overflow-hidden rounded-2xl shadow-xs">
            <div className="flex justify-between bg-background-tertiary/50 px-5 py-4 lg:px-6 lg:py-5">
                <h3 className="line-clamp-2 max-h-[4rem] pr-4 text-lg font-bold text-ellipsis text-foreground md:text-xl lg:text-2xl">
                    {title}
                </h3>
                <time className="shrink-0 text-base whitespace-nowrap text-secondary">
                    {formattedDate}
                </time>
            </div>
            <div className="flex flex-col justify-between gap-4 bg-secondary px-5 pt-4 pb-5 shadow-md lg:px-6">
                <p className="line-clamp-4 max-h-[6rem] text-base break-words text-ellipsis hyphens-auto text-foreground lg:line-clamp-5 lg:max-h-[8rem]">
                    {excerpt}
                </p>
                <div className="flex items-center justify-between">
                    {readingTime && dictionary.minRead ? (
                        <span className="text-sm text-secondary">
                            {readingTime} {dictionary.minRead}
                        </span>
                    ) : (
                        <span />
                    )}
                    <Link
                        href={linkPath}
                        title={`${dictionary.readMore} - ${post.title}`}
                        aria-label={`${dictionary.readMore} - ${post.title}`}
                        className="button button-ghost button-sm font-medium"
                    >
                        {dictionary.readMore}
                    </Link>
                </div>
            </div>
        </li>
    );
}
