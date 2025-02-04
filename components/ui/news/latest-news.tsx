import { getLatestNews } from '@/lib/news-util';
import NewsList from '@/components/ui/news/news-list';

export default function LatestNews() {
    const latestNews = getLatestNews();
    return (
        <div className="px-4 md:rounded-3xl md:bg-primary-light md:dark:bg-dark-soft/40 md:p-6 lg:p-10">
            <NewsList latestNews={latestNews} />
        </div>
    );
}
