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
            <div className="rounded-t-3xl flex justify-between bg-primary-light/25 px-5 py-4 lg:px-6 lg:py-5 shadow-md">
                <h3 className="line-clamp-2 max-h-[4rem] text-ellipsis pr-4 text-lg font-bold text-primary md:text-xl lg:text-2xl">
                    {title}
                </h3>
                <time className="whitespace-nowrap text-sm text-secondary">
                    {formattedDate}
                </time>
            </div>
            <div className="rounded-b-3xl grid grid-cols-1 gap-5 bg-primary-light/40 px-5 pb-5 pt-4 lg:px-6 lg:grid-cols-[200px_1fr] xl:grid-cols-[220px_1fr]">
                <div className="relative hidden h-[160px] w-[160px] overflow-hidden rounded-xl lg:block lg:h-[200px] lg:w-[200px]  xl:h-[220px]  xl:w-[220px]">
                    {!imageLoaded && (
                        <div className="square-skeleton animate-pulse rounded-xl bg-primary-light lg:h-[200px] lg:w-[200px] xl:h-[220px] xl:w-[220px]" />
                    )}
                    <Image
                        className={`rounded-lg object-cover ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
                        src={imagePath}
                        alt={title}
                        width={220}
                        height={220}
                        onLoad={() => setImageLoaded(true)}
                    />
                </div>
                <div className="flex flex-col justify-between gap-3">
                    <p className="text-md line-clamp-4 max-h-[6rem] text-ellipsis hyphens-auto break-words text-primary lg:line-clamp-6 lg:max-h-[9rem]">
                        {excerpt}
                    </p>
                    <Link href={linkPath} className="self-end">
                        <button className="button mx-auto">Read more</button>
                    </Link>
                </div>
            </div>
        </li>
    );
}
