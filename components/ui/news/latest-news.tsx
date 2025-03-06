import { getLatestNews } from '@/lib/news-util';
import NewsList from '@/components/ui/news/news-list/news-list';
import { Locale } from '@/i18n-config';
import BackToTopButton from '@/components/ui/BackToTopButton';

export default async function LatestNews({ lang }: { lang: Locale }) {
    const latestNews = await getLatestNews(lang);
    return (
        <div className="px-4 md:rounded-3xl md:bg-primary-light/60 md:p-6 md:dark:bg-dark-soft/40 lg:p-10">
            <NewsList newsList={latestNews} lang={lang} />
            <BackToTopButton />
        </div>
    );
}
