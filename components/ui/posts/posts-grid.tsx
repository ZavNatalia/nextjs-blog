import PostCard, { IPost } from '@/components/ui/posts/post-card';

export default function PostsGrid({posts}: { posts: IPost[] }) {
    if (!posts) {
        return <div>No posts</div>
    }
    return (
        <div className="container mx-auto">
            <ul className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-10'>
                {posts?.map(post =>
                    <PostCard post={post} key={post.slug}/>
                )}
            </ul>
        </div>

    )
}