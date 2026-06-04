import { getLocale } from '@/components/utils/getLocale';
import { Locale } from '@/i18n-config';

export default function NewsItemHeader({
    title,
    lang,
    date,
}: {
    title: string;
    date: string;
    imagePath: string;
    lang: Locale;
}) {
    const formattedDate = new Date(date).toLocaleDateString(getLocale(lang), {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    });
    return (
        <header className="relative mb-6 flex w-full flex-col gap-4 pb-6 after:absolute after:bottom-0 after:block after:h-2 after:w-full after:bg-accent md:mb-10 md:flex-row md:justify-between dark:after:bg-accent-700">
            <h2 className="text-2xl leading-snug font-bold md:text-3xl">
                {title}
            </h2>
            <span className="text-base text-secondary">{formattedDate}</span>
        </header>
    );
}
