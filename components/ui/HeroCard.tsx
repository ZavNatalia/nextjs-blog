'use client';
import Image from 'next/image';
import { type getDictionary } from '@/get-dictionary';
export default function HeroCard({
    dictionary,
}: {
    dictionary: Awaited<ReturnType<typeof getDictionary>>['common'];
}) {
    return (
        <section className="flex max-w-md flex-col items-center gap-1 overflow-hidden rounded-3xl bg-gradient-to-b from-orange-300 via-orange-100 to-white px-6 pb-4 shadow-md dark:bg-gradient-to-br dark:from-purple-950/60 dark:via-pink-800/70 dark:to-yellow-700 sm:px-10 md:max-w-lg md:gap-2 lg:pb-6 xl:max-w-xl">
            <div className="relative w-full max-w-sm overflow-hidden rounded-b-xl">
                <Image
                    src="/images/site/hero-desktop-dark.webp"
                    width={600}
                    height={336}
                    sizes="(max-width: 640px) 60vw, (max-width: 768px) 50vw, (max-width: 1024px) 40vw, 30vw"
                    className="hidden rounded-b-xl object-cover shadow-md dark:block"
                    alt="Hero"
                />
                <Image
                    src="/images/site/hero-desktop-light.webp"
                    width={600}
                    height={342}
                    sizes="(max-width: 640px) 60vw, (max-width: 768px) 50vw, (max-width: 1024px) 40vw, 30vw"
                    className="block rounded-b-xl object-cover dark:hidden"
                    alt="Hero"
                    priority
                />
            </div>
            <h1 className="text-center text-xl font-extrabold tracking-wider text-foreground/90 dark:text-foreground sm:text-xl md:text-2xl">
                {dictionary.greetings}
            </h1>
            <p className="sm:text-md text-center text-base text-foreground-muted dark:text-foreground-onDark md:text-lg">
                {dictionary.greetingsDescription}
            </p>
        </section>
    );
}
