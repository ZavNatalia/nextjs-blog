import PostCard, { IPost } from '@/components/ui/posts/post-card/post-card';

export default function PostsGrid({ posts }: { posts: IPost[] }) {
    if (!posts) {
        return <div>No posts</div>;
    }
    return (
        <ul className="container mx-auto grid grid-cols-1 gap-10 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
            {posts?.map((post) => <PostCard post={post} key={post.slug} />)}
        </ul>
    );
}
