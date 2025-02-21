import PostsGridSkeleton from '@/components/ui/posts/posts-grid/posts-grid-skeleton';

export default function Loading() {
    return (
        <main className="page">
            <div className="mt-[38px] w-full lg:mt-[50px]">
                <div className="h-8 w-3/5 animate-pulse rounded-lg bg-primary/10/90 lg:h-8 lg:animate-none" />
                <PostsGridSkeleton />
            </div>
        </main>
    );
}
