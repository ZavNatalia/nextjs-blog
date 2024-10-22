import { Suspense } from 'react';
import Hero from '@/components/ui/hero-card';
import FeaturedPosts from '@/components/ui/posts/featured-posts';
import PostsGridSkeleton from '@/components/ui/posts/posts-grid/posts-grid-skeleton';
import LatestNews from '@/components/ui/news/latest-news';

const FeaturedPostsFallback = () => (
        <div
            className="w-full flex flex-col items-center gap-5 lg:rounded-3xl lg:bg-primary-dark/40 px-4 py-4 md:py-6 lg:gap-8 lg:px-8 lg:py-8">
            <h2 className="text-accent text-2xl font-bold lg:text-4xl">
                Featured Posts
            </h2>
            <PostsGridSkeleton />
        </div>
    )
;

export default function Home() {
    return (
        <main className="page">
            <Hero />
            <Suspense fallback={<FeaturedPostsFallback />}>
                <FeaturedPosts />
            </Suspense>
            <LatestNews />
        </main>
    );
}
