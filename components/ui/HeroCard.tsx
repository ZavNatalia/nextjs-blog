"use client"
import Image from 'next/image';
import { type getDictionary } from '@/get-dictionary';
export default function HeroCard({
                                     dictionary,
                                 }: {
    dictionary: Awaited<ReturnType<typeof getDictionary>>["server-component"];
}) {
    return (
        <section className="flex max-w-md flex-col items-center gap-1 overflow-hidden rounded-3xl
        px-6 pb-4 lg:pb-6 sm:px-10 md:gap-2 md:max-w-lg xl:max-w-xl shadow-md
        bg-gradient-to-b dark:bg-gradient-to-br
        from-orange-300 dark:from-purple-950/60
        via-orange-100 dark:via-pink-800/70
        to-white dark:to-yellow-700">
            <div className="relative w-full max-w-sm rounded-b-xl overflow-hidden">
                <Image
                    src="/images/site/hero-desktop-dark.webp"
                    width={600}
                    height={336}
                    sizes="(max-width: 640px) 60vw, (max-width: 768px) 50vw, (max-width: 1024px) 40vw, 30vw"
                    className="hidden dark:block rounded-b-xl object-cover shadow-md "
                    alt="Hero"
                    priority
                />
                <Image
                    src="/images/site/hero-desktop-light.webp"
                    width={600}
                    height={342}
                    sizes="(max-width: 640px) 60vw, (max-width: 768px) 50vw, (max-width: 1024px) 40vw, 30vw"
                    className="block dark:hidden rounded-b-xl object-cover"
                    alt="Hero"
                    priority
                />
            </div>
            <h1 className="text-center text-xl tracking-wider font-extrabold text-foreground/90 dark:text-foreground sm:text-xl md:text-2xl">
                {dictionary.greetings}
            </h1>
            <p className="sm:text-md text-center text-base text-foreground-muted dark:text-foreground-onDark md:text-lg">
                {dictionary.greetingsDescription}
            </p>
        </section>
    );
}
