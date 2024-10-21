import PostsGrid from '@/components/ui/posts/posts-grid/posts-grid';
import { getFeaturedPosts } from '@/lib/posts-util';
import Link from 'next/link';

export default function FeaturedPosts() {
    const featuredPosts = getFeaturedPosts();
    return (
        <div className="flex flex-col items-center gap-4 rounded-3xl bg-primary-dark/30 px-4 py-6 lg:gap-6 lg:px-8 lg:py-12">
            <h1 className="text-2xl font-bold text-accent lg:text-4xl">
                Featured Posts
            </h1>
            <PostsGrid posts={featuredPosts} />
            <Link href="/posts">
                <button className="button">All posts</button>
            </Link>
        </div>
    );
}
