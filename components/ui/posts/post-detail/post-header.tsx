import Image from 'next/image';

export default function PostHeader({
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
        <header className="relative mb-10 flex max-w-[820px] justify-between gap-10 pb-8 after:absolute after:bottom-0 after:block after:h-2 after:w-full after:bg-accent-hover">
            <div>
                <h1 className="mb-4 text-5xl font-bold leading-snug">
                    {title}
                </h1>
                <span className="text-lg text-secondary">{formattedDate}</span>
            </div>
            <div className="relative h-[200px] w-[200px] flex-shrink-0 md:h-[300px] md:w-[300px]">
                <Image
                    className="rounded-3xl object-cover"
                    src={imagePath}
                    alt={title}
                    fill
                    sizes="300px"
                />
            </div>
        </header>
    );
}
