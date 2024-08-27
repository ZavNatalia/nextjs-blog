import { IPost } from '@/components/ui/posts/post-item';
import PostsGrid from '@/components/ui/posts/posts-grid';

export default function FeaturedPosts({posts}: {posts: IPost[]}) {

    return (
        <div className="bg-gray-950 p-8 rounded-3xl">
            <h1 className="text-4xl text-center font-bold mb-8 text-amber-500">Featured Posts</h1>
            <PostsGrid posts={posts}/>
        </div>
    )
}