import Hero from '@/components/ui/hero-card';
import { IPost } from '@/components/ui/posts/post-card';
import FeaturedPosts from '@/components/ui/posts/featured-posts';

export default function Home() {
    return (
        <main className="flex min-h-full flex-col items-center justify-between p-14 gap-8">
            <Hero/>
            <FeaturedPosts />
        </main>
    );
}
