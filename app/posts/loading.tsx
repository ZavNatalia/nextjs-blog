import PostsGridSkeleton from '@/components/ui/posts/posts-grid/posts-grid-skeleton';

export default function Loading() {
    return (
        <main className="page">
            <div className="mt-[76px] w-full">
                <PostsGridSkeleton title="All posts" />
            </div>
        </main>
    );
}
