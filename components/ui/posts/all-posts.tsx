import { IPost } from '@/components/ui/posts/post-card/post-card';
import PostsGrid from '@/components/ui/posts/posts-grid/posts-grid';

export default function AllPosts({ posts }: { posts: IPost[] }) {
    return (
        <div className="w-full">
            <h2 className="mb-5 text-center text-2xl font-bold lg:mb-10 lg:text-4xl">
                All posts
            </h2>
            <PostsGrid posts={posts} />
        </div>
    );
}
