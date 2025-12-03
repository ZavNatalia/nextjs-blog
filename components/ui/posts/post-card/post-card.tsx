'use client';
import { Locale } from '@/i18n-config';
import { getDictionary } from '@/get-dictionary';
import { getLocale } from '@/components/utils/getLocale';
import Link from 'next/link';

export interface IPost {
    slug: string;
    title: string;
    date: string;
    image?: any;
    excerpt: string;
    content?: string;
    isFeatured: boolean;
}

export default function PostCard({
    post,
    dictionary,
    lang,
}: {
    post: IPost;
    dictionary: Awaited<ReturnType<typeof getDictionary>>['common'];
    lang: Locale;
}) {
    const { title, date, excerpt, slug } = post;

    const formattedDate = new Date(date).toLocaleDateString(getLocale(lang), {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
    });

    const linkPath = `posts/${slug}`;

    return (
        <li className="h-fit w-full overflow-hidden rounded-2xl shadow-sm">
            <div className="flex justify-between bg-background-tertiary/50 px-5 py-4 lg:px-6 lg:py-5">
                <h3 className="line-clamp-2 max-h-[4rem] text-ellipsis pr-4 text-lg font-bold text-foreground md:text-xl lg:text-2xl">
                    {title}
                </h3>
                <time className="text-muted whitespace-nowrap text-base">
                    {formattedDate}
                </time>
            </div>
            <div className="bg-secondary flex flex-col justify-between gap-4 px-5 pb-5 pt-4 shadow-md lg:px-6">
                <p className="line-clamp-4 max-h-[6rem] text-ellipsis hyphens-auto break-words text-base text-foreground lg:line-clamp-5 lg:max-h-[8rem]">
                    {excerpt}
                </p>
                <Link
                    href={linkPath}
                    title={`${dictionary.readMore} - ${post.title}`}
                    aria-label={`${dictionary.readMore} - ${post.title}`}
                    className="button button-ghost button-md self-end font-medium"
                >
                    {dictionary.readMore}
                </Link>
            </div>
        </li>
    );
}
