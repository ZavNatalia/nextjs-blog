import PostCard, { IPost } from '@/components/ui/posts/post-card/post-card';

export default function PostsGrid({ posts }: { posts: IPost[] }) {
    if (!posts) {
        return <div>No posts</div>;
    }
    return (
        <ul className="mx-auto grid grid-cols-1 gap-6 xl:grid-cols-2">
            {posts?.map((post) => <PostCard post={post} key={post.slug} />)}
        </ul>
    );
}
