'use client';
import Link from 'next/link';
import Image from 'next/image';
import { Locale } from '@/i18n-config';
import { getDictionary } from '@/get-dictionary';

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
    dictionary: Awaited<ReturnType<typeof getDictionary>>['server-component'];
    lang: Locale;
}) {
    const { title, date, excerpt, image, slug } = post;

    const getLocale = (value: 'en' | 'ru') =>
        ({
            en: 'en-US',
            ru: 'ru-RU',
        })[value] || 'en-US';

    const formattedDate = new Date(date).toLocaleDateString(getLocale(lang), {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
    });

    const imagePath = `/images/posts/${slug}/${image}`;
    const linkPath = `posts/${slug}`;

    return (
        <li className="w-full">
            <div className="flex justify-between rounded-t-3xl bg-primary-contrast/80 px-5 py-4 shadow-md dark:bg-dark-soft/60 lg:px-6 lg:py-5">
                <h3 className="line-clamp-2 max-h-[4rem] text-ellipsis pr-4 text-lg font-bold text-foreground md:text-xl lg:text-2xl">
                    {title}
                </h3>
                <time className="text-foreground-muted dark:text-muted-light whitespace-nowrap text-sm">
                    {formattedDate}
                </time>
            </div>
            <div className="grid grid-cols-1 gap-5 rounded-b-3xl bg-primary-light/40 px-5 pb-5 pt-4 shadow-md dark:bg-dark-soft/40 lg:grid-cols-[180px_1fr] lg:px-6">
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
                    <p className="text-md line-clamp-4 max-h-[6rem] text-ellipsis hyphens-auto break-words text-foreground lg:line-clamp-5 lg:max-h-[8rem]">
                        {excerpt}
                    </p>
                    <Link href={linkPath} className="button-primary self-end">
                        {dictionary.readMore}
                    </Link>
                </div>
            </div>
        </li>
    );
}
