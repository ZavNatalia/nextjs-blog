import Image from 'next/image';

export default function Hero() {
    return (
        <section className="flex gap-6 flex-col max-w-lg
        items-center rounded-3xl bg-gray-700 pb-4">
            <Image
                src="/images/site/hero-desktop.webp"
                width={360}
                height={220}
                className="hidden md:block rounded-b-3xl"
                alt="Hero"
            />
            <h1 className="text-4xl font-bold text-gray-300 text-center">Building with Next.js</h1>
            <p className="text-xl text-gray-400 text-center">Go from beginner to expert by learning the foundations of
                Next.js</p>
        </section>
    )
}