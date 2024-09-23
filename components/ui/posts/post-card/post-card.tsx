"use client"
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

export default function PostCard({post}: { post: IPost }) {
    const {title, date, excerpt, image, slug} = post;
    const [imageLoaded, setImageLoaded] = useState(false);

    const formattedDate = new Date(date).toLocaleDateString('en-US', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
    });

    const imagePath = `/images/posts/${slug}/${image}`;
    const linkPath = `posts/${slug}`;

    return (
        <li className="w-full">
            <Link href={linkPath} className="flex flex-col gap-2 p-4 md:p-5 bg-primary-light/60 rounded-3xl">
                <div className="w-full aspect-square relative overflow-hidden rounded-xl mb-2">
                    {!imageLoaded && (
                        <div
                            className='w-full mb-2 aspect-square square-skeleton animate-pulse bg-primary-light rounded-xl'/>
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
                <h3 className="text-xl font-bold max-h-[4rem] line-clamp-2 text-ellipsis">{title}</h3>
                <time className="text-xs text-secondary whitespace-nowrap mb-2">{formattedDate}</time>
                <p className="text-sm max-h-[7rem] line-clamp-5 text-ellipsis">{excerpt}</p>
            </Link>
        </li>
    )
}