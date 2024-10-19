import Image from 'next/image';

export default function Hero() {
    return (
        <section className="flex max-w-md flex-col items-center gap-2 rounded-3xl bg-gradient-to-br from-purple-950/60 via-pink-800/70 to-yellow-700 px-6 pb-6 sm:px-8 md:gap-3 md:px-12 lg:max-w-md xl:max-w-lg">
            <div className="relative aspect-[7/4] w-full">
                <Image
                    src="/images/site/hero-desktop.webp"
                    fill
                    sizes="(max-width: 640px) 60vw, (max-width: 768px) 50vw, (max-width: 1024px) 40vw, 30vw"
                    className="rounded-b-3xl object-cover"
                    alt="Hero"
                    priority
                />
            </div>
            <h1 className="text-center text-xl font-bold text-white sm:text-2xl md:text-3xl">
                Building with Next.js
            </h1>
            <p className="text-center text-base text-white/90 sm:text-lg md:text-xl">
                Go from beginner to expert <br className="sm:hidden" /> by
                learning the foundations of Next.js
            </p>
        </section>
    );
}
