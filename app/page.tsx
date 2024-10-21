import { Suspense } from 'react';
import Hero from '@/components/ui/hero-card';
import FeaturedPosts from '@/components/ui/posts/featured-posts';
import PostsGridSkeleton from '@/components/ui/posts/posts-grid/posts-grid-skeleton';
import LatestNews from '@/components/ui/news/latest-news';

const FeaturedPostsFallback = () => (
    <div className="w-full rounded-3xl bg-primary-dark/30 px-4 py-6 lg:px-8 lg:py-12">
        <PostsGridSkeleton title="Featured Posts" />
    </div>
);

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
