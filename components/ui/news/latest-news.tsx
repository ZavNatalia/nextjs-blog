import { getLatestNews } from '@/lib/news-util';
import NewsList from '@/components/ui/news/news-list';
import { Locale } from '@/i18n-config';
import type { getDictionary } from '@/get-dictionary';

export default async function LatestNews({
    lang,
    dictionary,
}: {
    lang: Locale;
    dictionary: Awaited<ReturnType<typeof getDictionary>>['server-component'];
}) {
    const latestNews = await getLatestNews(lang);
    return (
        <div className="px-4 md:rounded-3xl md:bg-primary-light/60 md:p-6 md:dark:bg-dark-soft/40 lg:p-10">
            <NewsList newsList={latestNews} dictionary={dictionary} />
        </div>
    );
}
