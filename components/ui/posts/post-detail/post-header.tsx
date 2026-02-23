import Image from 'next/image';
import { useState } from 'react';

export default function PostHeader({
    title,
    date,
    imagePath,
    readingTime,
    readingTimeLabel,
}: {
    title: string;
    date: string;
    imagePath: string;
    readingTime?: number;
    readingTimeLabel?: string;
}) {
    const [imageLoaded, setImageLoaded] = useState(false);

    const formattedDate = new Date(date).toLocaleDateString('en-US', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    });
    const underlineStyle =
        'after:absolute after:bottom-0 after:block after:h-2 after:w-full after:bg-accent';
    return (
        <header
            className={`${underlineStyle} relative mb-6 flex flex-col gap-3 pb-6 md:mb-10 md:flex-row md:justify-between md:gap-10 md:pb-8`}
        >
            <div>
                <h1 className="mb-1 text-xl font-bold leading-snug md:mb-4 md:text-3xl lg:text-4xl">
                    {title}
                </h1>
                <span className="text-secondary text-base md:text-lg">
                    {formattedDate}
                    {readingTime && readingTimeLabel && (
                        <span>
                            {' '}
                            · {readingTime} {readingTimeLabel}
                        </span>
                    )}
                </span>
            </div>
            <div className="relative h-[200px] w-[200px] flex-shrink-0 self-center md:h-[260px] md:w-[260px]">
                {!imageLoaded && (
                    <div className="square-skeleton bg-tertiary h-[200px] w-[200px] animate-pulse rounded-xl md:h-[260px] md:w-[260px]" />
                )}
                <Image
                    className={`rounded-xl object-cover ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
                    src={imagePath}
                    alt={title}
                    fill
                    sizes="260px"
                    priority
                    onLoad={() => setImageLoaded(true)}
                />
            </div>
        </header>
    );
}
