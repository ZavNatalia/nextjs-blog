'use client';
import Image from 'next/image';
import { type getDictionary } from '@/get-dictionary';

export default function HeroCard({
    dictionary,
}: {
    dictionary: Awaited<ReturnType<typeof getDictionary>>['common'];
}) {
    return (
        <section className="flex max-w-lg flex-col items-center overflow-hidden rounded-3xl bg-gradient-to-b from-purple-700/60 via-pink-100 to-white px-6 pb-6 shadow-md dark:bg-gradient-to-br dark:from-purple-950/60 dark:via-pink-800/70 dark:to-yellow-700 sm:px-8 md:gap-2">
            <div className="relative mb-3 w-full max-w-xs overflow-hidden rounded-b-xl">
                <Image
                    src="/images/site/hero-desktop-dark.webp"
                    width={446}
                    height={250}
                    alt="Hero"
                    className="hidden rounded-b-xl object-cover dark:block"
                    priority
                    sizes="(max-width: 768px) 100vw, 446px"
                />
                <Image
                    src="/images/site/hero-desktop-light.webp"
                    width={438}
                    height={250}
                    alt="Hero"
                    className="block rounded-b-xl object-cover dark:hidden"
                    quality={100}
                    priority
                    sizes="(max-width: 768px) 100vw, 438px"
                />
            </div>
            <h1 className="text-center text-xl font-extrabold text-foreground/90 sm:text-xl md:text-2xl">
                {dictionary.greetings}
            </h1>
            <p className="text-center text-base text-foreground sm:text-base md:text-lg">
                {dictionary.greetingsDescription}
            </p>
        </section>
    );
}
