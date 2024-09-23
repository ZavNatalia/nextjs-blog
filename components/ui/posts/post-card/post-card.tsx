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
                className="flex flex-col gap-2 rounded-3xl bg-primary-light/60 p-4 transition-colors duration-500 hover:bg-primary-light/80 md:p-5"
            >
                <div className="relative mb-2 aspect-square w-full overflow-hidden rounded-xl">
                    {!imageLoaded && (
                        <div className="square-skeleton mb-2 aspect-square w-full animate-pulse rounded-xl bg-primary-light" />
                    )}
                    <Image
                        className={`rounded-xl object-cover transition-transform duration-500 hover:scale-110 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
                        src={imagePath}
                        alt={title}
                        fill
                        sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw"
                        onLoad={() => setImageLoaded(true)}
                    />
                </div>
                <h3 className="line-clamp-2 max-h-[4rem] text-ellipsis text-2xl font-bold">
                    {title}
                </h3>
                <time className="mb-2 whitespace-nowrap text-sm text-secondary">
                    {formattedDate}
                </time>
                <p className="text-md line-clamp-3 max-h-[7rem] text-ellipsis">
                    {excerpt}
                </p>
            </Link>
        </li>
    );
}
