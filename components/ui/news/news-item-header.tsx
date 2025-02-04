import Image from 'next/image';

export default function NewsItemHeader({
    title,
    date,
    imagePath,
}: {
    title: string;
    date: string;
    imagePath: string;
}) {
    const formattedDate = new Date(date).toLocaleDateString('en-US', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    });
    return (
        <header className="relative mb-6 flex flex-col gap-3 pb-6 after:absolute after:bottom-0 after:block after:h-2 after:w-full after:bg-accent dark:after:bg-accent-dark md:mb-10 md:flex-row md:justify-between md:gap-10 md:pb-8">
            <div>
                <h1 className="mb-2 text-2xl font-bold leading-snug md:mb-4 md:text-3xl lg:text-4xl">
                    {title}
                </h1>
                <span className="text-md text-secondary md:text-lg">
                    {formattedDate}
                </span>
            </div>
            <div className="relative h-[200px] w-[200px] flex-shrink-0 self-center md:h-[220px] md:w-[220px]">
                <Image
                    className="rounded-xl object-cover"
                    src={imagePath}
                    alt={title}
                    fill
                    sizes="220px"
                />
            </div>
        </header>
    );
}
