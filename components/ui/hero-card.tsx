import Image from 'next/image';

export default function Hero() {
    return (
        <section className="flex gap-4 md:gap-4 flex-col max-w-md md:max-w-lg
        items-center rounded-3xl bg-gray-600 shadow-lg pb-4 p-4 sm:pt-0">
            <Image
                src="/images/site/hero-desktop.webp"
                width={380}
                height={240}
                className="hidden sm:block rounded-b-3xl"
                alt="Hero"
            />
            <h1 className="text-2xl md:text-3xl font-bold text-blue-100 text-center">Building with Next.js</h1>
            <p className="text-lg md:text-xl text-gray-300 text-center">Go from beginner to expert by learning the foundations of
                Next.js</p>
        </section>
    )
}