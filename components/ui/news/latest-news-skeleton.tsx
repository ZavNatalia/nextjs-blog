import NewsItemSkeleton from '@/components/ui/news/news-list/news-item-skeleton';

export default function LatestNewsSkeleton({ count = 2 }: { count?: number }) {
    return (
        <article className="card max-w-5xl lg:p-8">
            <ul>
                {Array.from({ length: count }, (_, index) => (
                    <NewsItemSkeleton key={index} />
                ))}
            </ul>
        </article>
    );
}
