import { IPost } from '@/components/ui/posts/post-card/post-card';
import PostsGrid from '@/components/ui/posts/posts-grid/posts-grid';

export default function AllPosts({ posts }: { posts: IPost[] }) {
    return (
        <div className="w-full">
            <h2 className="mb-10 text-center text-4xl font-bold">All posts</h2>
            <PostsGrid posts={posts} />
        </div>
    );
}
