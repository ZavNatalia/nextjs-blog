import PostsGrid from '@/components/ui/posts/posts-grid/posts-grid';
import { getFeaturedPosts } from '@/lib/posts-util';

export default function FeaturedPosts() {
    const featuredPosts = getFeaturedPosts();
    return (
        <div className="rounded-3xl bg-primary-dark/30 p-8">
            <h1 className="mb-8 text-center text-4xl font-bold text-accent">
                Featured Posts
            </h1>
            <PostsGrid posts={featuredPosts} />
        </div>
    );
}
