'use client';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

import { type getDictionary } from '@/get-dictionary';
import { type Locale } from '@/i18n-config';

export default function HeroCard({
    dictionary,
    lang,
}: {
    dictionary: Awaited<ReturnType<typeof getDictionary>>['common'];
    lang: Locale;
}) {
    const [imageLoaded, setImageLoaded] = useState(false);

    return (
        <section className="relative w-full max-w-2xl animate-fade-in overflow-hidden rounded-2xl bg-background-secondary px-2 py-4 shadow-lg">
            {/* Background images */}
            <Image
                src="/images/site/hero-desktop-dark.png"
                fill
                alt=""
                className="hidden object-cover dark:block"
                quality={75}
                priority
                sizes="(max-width: 768px) 100vw, 863px"
                onLoad={() => setImageLoaded(true)}
            />
            <Image
                src="/images/site/hero-desktop-light.png"
                fill
                alt=""
                className="block object-cover dark:hidden"
                quality={75}
                priority
                sizes="(max-width: 768px) 100vw, 863px"
                onLoad={() => setImageLoaded(true)}
            />

            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-linear-to-r from-background-secondary via-background-secondary/70 via-100% to-transparent md:via-40%" />

            {/* Content */}
            <div className="relative flex flex-col items-center gap-4 px-2 sm:p-6 md:max-w-[60%] md:items-start md:px-4 md:py-6">
                <h1 className="bg-clip-text text-center text-2xl font-extrabold text-accent text-readable md:text-left md:text-3xl">
                    {dictionary.greetings}
                </h1>
                <p className="max-w-md text-center text-lg text-foreground text-readable md:text-left md:text-lg">
                    {dictionary.greetingsDescription}
                </p>
                <Link
                    href={`/${lang}/posts`}
                    className="button button-solid button-md mt-2"
                >
                    {dictionary.goToAllPosts}
                </Link>
            </div>

            {/* Skeleton overlay — visible until background image loads */}
            <div
                className={`absolute inset-0 bg-background-secondary transition-opacity duration-500 ${
                    imageLoaded
                        ? 'pointer-events-none opacity-0'
                        : 'opacity-100'
                }`}
            >
                <div className="flex flex-col items-center gap-4 px-2 py-6 sm:p-6 md:max-w-[60%] md:items-start md:px-4 md:py-6">
                    <div className="h-8 w-3/4 animate-pulse rounded-lg bg-foreground-muted/20 md:h-9" />
                    <div className="flex w-full max-w-md flex-col gap-2">
                        <div className="h-6 w-full animate-pulse rounded-lg bg-foreground-muted/15" />
                        <div className="h-6 w-5/6 animate-pulse rounded-lg bg-foreground-muted/15" />
                    </div>
                    <div className="mt-2 h-10 w-40 animate-pulse rounded-lg bg-foreground-muted/20" />
                </div>
            </div>
        </section>
    );
}
