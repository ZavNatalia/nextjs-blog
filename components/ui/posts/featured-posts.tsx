import PostsGrid from '@/components/ui/posts/posts-grid';
import { getFeaturedPosts } from '@/lib/posts-util';

export default function FeaturedPosts() {
    const featuredPosts = getFeaturedPosts();
    return (
        <div className="bg-gray-950 p-8 rounded-3xl">
            <h1 className="text-4xl text-center font-bold mb-8 text-amber-500">Featured Posts</h1>
            <PostsGrid posts={featuredPosts}/>
        </div>
    )
}