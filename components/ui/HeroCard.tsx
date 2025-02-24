"use client"
import Image from 'next/image';

export default function HeroCard() {
    return (
        <section className="flex max-w-xs flex-col items-center gap-1 overflow-hidden rounded-3xl
        px-8 pb-4 sm:px-8 md:gap-2 md:px-10 lg:max-w-lg xl:max-w-xl shadow-md
        bg-gradient-to-b dark:bg-gradient-to-br
        from-orange-300 dark:from-purple-950/60
        via-orange-100 dark:via-pink-800/70
        to-white dark:to-yellow-700">
            <div className="relative aspect-[7/4] w-full rounded-b-xl overflow-hidden">
                <Image
                    src="/images/site/hero-desktop-dark.webp"
                    fill
                    sizes="(max-width: 640px) 60vw, (max-width: 768px) 50vw, (max-width: 1024px) 40vw, 30vw"
                    className="hidden dark:block rounded-b-xl object-cover shadow-md "
                    alt="Hero"
                />
                <Image
                    src="/images/site/hero-desktop-light.webp"
                    fill
                    sizes="(max-width: 640px) 60vw, (max-width: 768px) 50vw, (max-width: 1024px) 40vw, 30vw"
                    className="block dark:hidden rounded-b-xl object-cover"
                    alt="Hero"
                    priority
                />
            </div>
            <h1 className="text-center text-xl tracking-wider font-extrabold text-foreground/90 dark:text-foreground sm:text-xl md:text-2xl">
                Building with Next.js
            </h1>
            <p className="sm:text-md text-center text-base text-foreground-muted dark:text-foreground-onDark md:text-lg">
                Go from beginner to expert <br />
                by learning the foundations of Next.js
            </p>
        </section>
    );
}
