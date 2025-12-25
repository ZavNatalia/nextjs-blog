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
        <header className="after:bg-accent relative mb-6 flex w-full flex-col gap-3 pb-6 after:absolute after:bottom-0 after:block after:h-2 after:w-full dark:after:bg-accent-700 md:mb-10 md:flex-row md:justify-between md:gap-10 md:pb-8">
            <div>
                <h2 className="mb-2 text-2xl font-bold leading-snug md:mb-4 md:text-3xl lg:text-4xl">
                    {title}
                </h2>
                <span className="text-secondary text-base">
                    {formattedDate}
                </span>
            </div>
        </header>
    );
}
