'use client';
import Image from 'next/image';
import Link from 'next/link';

import { type getDictionary } from '@/get-dictionary';
import { type Locale } from '@/i18n-config';

export default function HeroCard({
    dictionary,
    lang,
}: {
    dictionary: Awaited<ReturnType<typeof getDictionary>>['common'];
    lang: Locale;
}) {
    return (
        <section className="relative w-full max-w-xl animate-fade-in overflow-hidden rounded-3xl px-2 py-4 shadow-lg">
            {/* Background image */}
            <Image
                src="/images/site/hero-desktop-dark.png"
                fill
                alt=""
                className="hidden object-cover dark:block"
                quality={90}
                priority
                sizes="(max-width: 768px) 100vw, 863px"
            />
            <Image
                src="/images/site/hero-desktop-light.png"
                fill
                alt=""
                className="block object-cover dark:hidden"
                quality={90}
                priority
                sizes="(max-width: 768px) 100vw, 863px"
            />

            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-linear-to-r from-background-secondary via-background-secondary/70 via-100% to-transparent md:via-40%" />

            {/* Content */}
            <div className="relative flex flex-col items-center gap-4 px-4 py-6 sm:px-10 sm:py-10 md:max-w-[60%] md:items-start md:py-8">
                <h1 className="bg-clip-text text-center text-3xl font-extrabold text-accent text-readable md:text-left md:text-4xl lg:text-5xl">
                    {dictionary.greetings}
                </h1>
                <p className="max-w-md text-center text-lg text-foreground text-readable md:text-left md:text-xl">
                    {dictionary.greetingsDescription}
                </p>
                <Link
                    href={`/${lang}/posts`}
                    className="button button-solid button-md mt-2"
                >
                    {dictionary.goToAllPosts}
                </Link>
            </div>
        </section>
    );
}
