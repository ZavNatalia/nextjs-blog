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
                className="grid grid-cols-[220px_1fr] gap-5 rounded-3xl bg-primary-light/60 p-3 transition-colors duration-500 hover:bg-primary-light/80 md:p-4"
            >
                <div className="relative mb-2 h-[220px] w-[220px] overflow-hidden rounded-xl">
                    {!imageLoaded && (
                        <div className="square-skeleton h-[220px] w-[220px] animate-pulse rounded-xl bg-primary-light" />
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
                    <h3 className="line-clamp-3 max-h-[5rem] text-ellipsis text-2xl font-bold">
                        {title}
                    </h3>
                    <time className="whitespace-nowrap text-xs text-secondary">
                        {formattedDate}
                    </time>
                    <p className="text-md mt-2 line-clamp-5 max-h-[8rem] text-ellipsis hyphens-auto break-words">
                        {excerpt}
                    </p>
                </div>
            </Link>
        </li>
    );
}
