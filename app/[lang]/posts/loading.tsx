import PostsGridSkeleton from '@/components/ui/posts/posts-grid/posts-grid-skeleton';

export default function Loading() {
    return (
        <main className="page">
            <div className="mt-[32px] w-full lg:mt-[50px]">
                <div className="mx-auto mb-6 h-12 w-44 animate-pulse rounded-lg bg-primary-contrast dark:bg-dark-soft lg:mb-8 lg:h-[50px]" />
                <PostsGridSkeleton />
            </div>
        </main>
    );
}
