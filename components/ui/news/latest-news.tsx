import { getLatestNews } from '@/lib/news-util';
import NewsList from '@/components/ui/news/news-list';
import { Locale } from '@/i18n-config';

export default function LatestNews({lang}: {lang: Locale}) {
    const latestNews = getLatestNews(lang);
    return (
        <div className="px-4 md:rounded-3xl md:bg-primary-light/60 md:dark:bg-dark-soft/40 md:p-6 lg:p-10">
            <NewsList latestNews={latestNews} />
        </div>
    );
}
