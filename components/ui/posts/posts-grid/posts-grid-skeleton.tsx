import { PostCardSkeleton } from '@/components/ui/posts/post-card/post-card-skeleton';

export default function PostsGridSkeleton({ count = 4 }: { count?: number }) {
    return (
        <div className="flex w-full flex-col gap-6">
            <div className="mt-1 h-[42px] w-full animate-pulse rounded-lg border border-border-500 bg-foreground-muted/10" />
            <ul className="mx-auto grid w-full grid-cols-1 gap-6 lg:grid-cols-2 xl:grid-cols-3">
                {Array.from({ length: count }, (_, index) => (
                    <PostCardSkeleton key={index} />
                ))}
            </ul>
        </div>
    );
}
