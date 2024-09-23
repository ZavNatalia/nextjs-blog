import { Suspense } from 'react';
import Hero from '@/components/ui/hero-card';
import FeaturedPosts from '@/components/ui/posts/featured-posts';
import PostsGridSkeleton from '@/components/ui/posts/posts-grid/posts-grid-skeleton';

const FeaturedPostsFallback = () => (
    <div className="w-full bg-primary-dark p-8 rounded-3xl">
        <PostsGridSkeleton title='Featured Posts' />
    </div>
);

export default function Home() {
    return (
        <main className="page">
            <Hero />
            <Suspense fallback={<FeaturedPostsFallback />}>
                <FeaturedPosts />
            </Suspense>
        </main>
    );
}