"use client"
import Image from 'next/image';

export default function HeroCard() {
    return (
        <section className="mt-4 flex max-w-md flex-col items-center gap-1 overflow-hidden rounded-3xl
        px-8 pb-4 sm:px-8 md:gap-2 md:px-10 lg:max-w-xs xl:max-w-md shadow-md
        bg-gradient-to-br
        from-purple-100 dark:from-purple-950/60
        via-pink-200 dark:via-pink-800/70
        to-yellow-100 dark:to-yellow-700">
            <div className="relative aspect-[7/4] w-full rounded-b-xl overflow-hidden">
                <Image
                    src="/images/site/hero-desktop-dark.webp"
                    fill
                    sizes="(max-width: 640px) 60vw, (max-width: 768px) 50vw, (max-width: 1024px) 40vw, 30vw"
                    className="hidden dark:block rounded-b-xl object-cover shadow-md "
                    alt="Hero"
                    priority
                />
                <Image
                    src="/images/site/hero-desktop-light.webp"
                    fill
                    sizes="(max-width: 640px) 60vw, (max-width: 768px) 50vw, (max-width: 1024px) 40vw, 30vw"
                    className="block dark:hidden rounded-b-xl object-cover opacity-85"
                    alt="Hero"
                    priority
                />
            </div>
            <h1 className="text-center text-xl font-bold sm:text-xl md:text-2xl">
                Building with Next.js
            </h1>
            <p className="sm:text-md text-center text-base text-foreground-muted dark:text-foreground-onDark md:text-lg">
                Go from beginner to expert <br className="sm:hidden" /> by
                learning the foundations of Next.js
            </p>
        </section>
    );
}
