import Image from 'next/image';

export default function Hero() {
    return (
        <section className="flex gap-4 md:gap-6 flex-col max-w-md lg:max-w-lg xl:max-w-xl
        items-center rounded-3xl bg-primary-light pb-6 px-6 sm:px-8 md:px-12">
            <div className="w-full relative aspect-[5/3]">
                <Image
                    src="/images/site/hero-desktop.webp"
                    fill
                    sizes="(max-width: 640px) 60vw, (max-width: 768px) 50vw, (max-width: 1024px) 40vw, 40vw"
                    style={{ objectFit: 'cover' }}
                    className="rounded-b-3xl"
                    alt="Hero"
                    priority
                />
            </div>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-primary text-center mt-4">Building with Next.js</h1>
            <p className="text-base sm:text-lg md:text-xl text-secondary text-center">Go from beginner to expert <br className="sm:hidden"/> by learning the foundations of Next.js</p>
        </section>
    )
}