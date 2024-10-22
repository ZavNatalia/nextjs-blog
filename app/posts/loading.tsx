import PostsGridSkeleton from '@/components/ui/posts/posts-grid/posts-grid-skeleton';

export default function Loading() {
    return (
        <main className="page">
            <div className="mt-[48px] w-full lg:mt-[60px]">
                <h2 className="mb-5 text-center text-2xl font-bold lg:mb-8 lg:text-4xl">
                    All posts
                </h2>
                <PostsGridSkeleton />
            </div>
        </main>
    );
}
