import Hero from '@/components/ui/hero-card';
import FeaturedPosts from '@/components/ui/posts/featured-posts';

export default function Home() {
    return (
        <main className="page">
            <Hero/>
            <FeaturedPosts />
        </main>
    );
}
