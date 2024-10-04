import { getLatestNews } from '@/lib/news-util';
import NewsList from '@/components/ui/news/news-list';

export default function LatestNews() {
    const latestNews = getLatestNews();
    return (
        <div className="rounded-3xl bg-primary-light/30 p-12">
            <NewsList latestNews={latestNews} />
        </div>
    );
}
