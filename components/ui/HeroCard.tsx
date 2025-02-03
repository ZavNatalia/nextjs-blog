import Image from 'next/image';

export default function HeroCard() {
    return (
        <section className="mt-4 flex max-w-md flex-col items-center gap-1 overflow-hidden rounded-3xl bg-gradient-to-br from-purple-950/60 via-pink-800/70 to-yellow-700 px-8 pb-4 sm:px-8 md:gap-2 md:px-10 lg:max-w-xs xl:max-w-md">
            <div className="relative aspect-[7/4] w-full">
                <Image
                    src="/images/site/hero-desktop.webp"
                    fill
                    sizes="(max-width: 640px) 60vw, (max-width: 768px) 50vw, (max-width: 1024px) 40vw, 30vw"
                    className="rounded-b-xl object-cover shadow-md"
                    alt="Hero"
                    priority
                />
            </div>
            <h1 className="text-center text-xl font-bold text-primary sm:text-xl md:text-2xl">
                Building with Next.js
            </h1>
            <p className="sm:text-md text-center text-base text-primary/90 md:text-lg">
                Go from beginner to expert <br className="sm:hidden" /> by
                learning the foundations of Next.js
            </p>
        </section>
    );
}
