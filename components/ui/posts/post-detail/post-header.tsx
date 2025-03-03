import Image from 'next/image';
import { useState } from 'react';

export default function PostHeader({
    title,
    date,
    imagePath,
}: {
    title: string;
    date: string;
    imagePath: string;
}) {
    const [imageLoaded, setImageLoaded] = useState(false);

    const formattedDate = new Date(date).toLocaleDateString('en-US', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    });
    return (
        <header className="relative mb-6 flex flex-col gap-3 pb-6 after:absolute after:bottom-0 after:block after:h-2 after:w-full after:bg-accent dark:after:bg-accent-dark md:mb-10 md:flex-row md:justify-between md:gap-10 md:pb-8">
            <div>
                <h1 className="mb-1 text-xl font-bold leading-snug md:mb-4 md:text-3xl lg:text-5xl">
                    {title}
                </h1>
                <span className="text-secondary dark:text-muted-light text-sm md:text-md">
                    {formattedDate}
                </span>
            </div>
            <div className="relative h-[200px] w-[200px] flex-shrink-0 self-center md:h-[260px] md:w-[260px]">
                {!imageLoaded && (
                    <div className="square-skeleton h-[200px] w-[200px] animate-pulse rounded-xl bg-primary-contrast dark:bg-dark md:h-[260px] md:w-[260px]" />
                )}
                <Image
                    className={`rounded-xl object-cover ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
                    src={imagePath}
                    alt={title}
                    fill
                    priority
                    sizes="260px"
                    onLoad={() => setImageLoaded(true)}
                />
            </div>
        </header>
    );
}
