'use client';
import Link from 'next/link';
import Image from 'next/image';
import { Locale } from '@/i18n-config';
import { getDictionary } from '@/get-dictionary';
import { getLocale } from '@/components/utils/getLocale';

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
    const { title, date, excerpt, image, slug } = post;

    const formattedDate = new Date(date).toLocaleDateString(getLocale(lang), {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
    });

    const imagePath = `/images/posts/${slug}/${image}`;
    const linkPath = `posts/${slug}`;

    return (
        <li className="w-full rounded-3xl shadow-sm">
            <div className="flex justify-between rounded-t-3xl border-b border-border-100 bg-background-secondary/80 px-5 py-4 lg:px-6 lg:py-5">
                <h3 className="line-clamp-2 max-h-[4rem] text-ellipsis pr-4 text-lg font-bold text-foreground md:text-xl lg:text-2xl">
                    {title}
                </h3>
                <time className="text-muted whitespace-nowrap text-sm">
                    {formattedDate}
                </time>
            </div>
            <div className="grid grid-cols-1 gap-5 rounded-b-3xl bg-background-secondary px-5 pb-5 pt-4 shadow-md lg:grid-cols-[180px_1fr] lg:px-6">
                <div className="relative hidden h-[160px] w-[160px] overflow-hidden rounded-xl lg:block lg:h-[180px] lg:w-[180px]">
                    <Image
                        className={`rounded-lg`}
                        src={imagePath}
                        alt={title}
                        width={180}
                        height={180}
                    />
                </div>
                <div className="flex flex-col justify-between gap-3">
                    <p className="line-clamp-4 max-h-[6rem] text-ellipsis hyphens-auto break-words text-base text-foreground lg:line-clamp-5 lg:max-h-[8rem]">
                        {excerpt}
                    </p>
                    <Link
                        href={linkPath}
                        title={`${dictionary.readMore} - ${post.title}`}
                        aria-label={`${dictionary.readMore} - ${post.title}`}
                        className="button button-secondary button-md self-end font-medium"
                    >
                        {dictionary.readMore}
                    </Link>
                </div>
            </div>
        </li>
    );
}
