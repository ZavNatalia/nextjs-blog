'use client';
import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';

export interface IPost {
    slug: string;
    title: string;
    date: string;
    image?: any;
    excerpt: string;
    content?: string;
    isFeatured: boolean;
}

export default function PostCard({ post }: { post: IPost }) {
    const { title, date, excerpt, image, slug } = post;
    const [imageLoaded, setImageLoaded] = useState(false);

    const formattedDate = new Date(date).toLocaleDateString('en-US', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
    });

    const imagePath = `/images/posts/${slug}/${image}`;
    const linkPath = `posts/${slug}`;

    return (
        <li className="w-full overflow-hidden">
            <div className="flex justify-between rounded-t-3xl bg-primary-light/25 px-5 py-4 shadow-md lg:px-6 lg:py-5">
                <h3 className="line-clamp-2 max-h-[4rem] text-ellipsis pr-4 text-lg font-bold text-primary md:text-xl lg:text-2xl">
                    {title}
                </h3>
                <time className="whitespace-nowrap text-sm text-secondary">
                    {formattedDate}
                </time>
            </div>
            <div className="grid grid-cols-1 gap-5 rounded-b-3xl bg-primary-light/40 px-5 pb-5 pt-4 lg:grid-cols-[200px_1fr] lg:px-6">
                <div
                    className="relative hidden h-[160px] w-[160px] overflow-hidden rounded-xl lg:block lg:h-[180px] lg:w-[180px]">
                    {!imageLoaded && (
                        <div
                            className="square-skeleton animate-pulse rounded-xl bg-primary-light lg:h-[180px] lg:w-[180px]" />
                    )}
                    <Image
                        className={`rounded-lg object-cover ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
                        src={imagePath}
                        alt={title}
                        width={200}
                        height={200}
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 200px"
                        onLoad={() => setImageLoaded(true)}
                    />
                </div>
                <div className="flex flex-col justify-between gap-3">
                    <p className="text-md line-clamp-4 max-h-[6rem] text-ellipsis hyphens-auto break-words text-primary lg:line-clamp-6 lg:max-h-[9rem]">
                        {excerpt}
                    </p>
                    <Link href={linkPath} className="button self-end">
                        Read more
                    </Link>
                </div>
            </div>
        </li>
    );
}
