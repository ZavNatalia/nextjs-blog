import Image from 'next/image';

export default function Hero() {
    return (
        <section className="flex gap-4 md:gap-4 flex-col max-w-md md:max-w-lg
        items-center rounded-3xl bg-primary-light pb-4 p-4 sm:pt-0">
            <Image
                src="/images/site/hero-desktop.webp"
                width={384}
                height={215}
                className="hidden sm:block w-auto rounded-b-3xl"
                alt="Hero"
                priority
            />
            <h1 className="text-2xl md:text-3xl font-bold text-primary text-center">Building with Next.js</h1>
            <p className="text-lg md:text-xl text-secondary text-center">Go from beginner to expert by learning the foundations of
                Next.js</p>
        </section>
    )
}