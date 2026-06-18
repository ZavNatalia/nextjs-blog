export default function PostHeader({
    title,
    date,
    readingTime,
    readingTimeLabel,
}: {
    title: string;
    date: string;
    readingTime?: number;
    readingTimeLabel?: string;
}) {
    const formattedDate = new Date(date).toLocaleDateString('en-US', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    });
    const underlineStyle =
        'after:absolute after:bottom-0 after:block after:h-1 after:w-full after:bg-accent';
    return (
        <header
            className={`${underlineStyle} relative mb-6 flex flex-col gap-1 pb-6 md:gap-2`}
        >
            <h1 className="text-xl leading-snug font-bold md:text-3xl">
                {title}
            </h1>
            <span className="text-sm text-secondary md:text-base">
                {formattedDate}
                {readingTime && readingTimeLabel && (
                    <span>
                        {' '}
                        · {readingTime} {readingTimeLabel}
                    </span>
                )}
            </span>
        </header>
    );
}
