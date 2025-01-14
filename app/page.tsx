import React, { Suspense } from 'react';
import Hero from '@/components/ui/hero-card';
import FeaturedPosts from '@/components/ui/posts/featured-posts';
import PostsGridSkeleton from '@/components/ui/posts/posts-grid/posts-grid-skeleton';
import LatestNews from '@/components/ui/news/latest-news';

const FeaturedPostsFallback: React.FC = () => (
    <div className="flex w-full flex-col items-center gap-5 px-4 py-4 md:py-6 lg:gap-8 lg:rounded-3xl lg:bg-primary-dark/40 lg:px-8 lg:py-8">
        <h2 className="text-2xl font-bold text-accent lg:text-4xl">
            Featured Posts
        </h2>
        <PostsGridSkeleton />
    </div>
);

export default function Home() {
    return (
        <main className="page">
            <Hero />
            <LatestNews />
            <Suspense fallback={<FeaturedPostsFallback />}>
                <FeaturedPosts />
            </Suspense>
        </main>
    );
}
