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
        <li className="w-full">
            <Link
                href={linkPath}
                className="grid grid-cols-1 gap-5 rounded-3xl bg-primary-light/60 p-4 transition-colors duration-500 hover:bg-primary-light/80 lg:grid-cols-[220px_1fr]"
            >
                <div className="relative hidden h-[160px] w-[160px] overflow-hidden rounded-xl lg:block lg:h-[220px] lg:w-[220px]">
                    {!imageLoaded && (
                        <div className="square-skeleton h-[160px] w-[160px] animate-pulse rounded-xl bg-primary-light lg:h-[220px] lg:w-[220px]" />
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
                <div>
                    <h3 className="line-clamp-3 max-h-[5rem] text-ellipsis text-lg font-bold lg:text-2xl">
                        {title}
                    </h3>
                    <time className="whitespace-nowrap text-xs text-secondary">
                        {formattedDate}
                    </time>
                    <hr className="mx-[-16px] my-2 border-t border-primary-light lg:hidden" />
                    <p className="text-md mt-1 line-clamp-3 max-h-[5rem] text-ellipsis hyphens-auto break-words lg:line-clamp-5 lg:max-h-[8rem]">
                        {excerpt}
                    </p>
                </div>
            </Link>
        </li>
    );
}
