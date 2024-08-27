import PostItem, { IPost } from '@/components/ui/posts/post-item';

export default function PostsGrid({posts}: { posts: IPost[] }) {
    if (!posts) {
        return <div>No posts</div>
    }
    return (
        <div className="container mx-auto">
            <ul className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8'>
                {posts?.map(post =>
                    <PostItem post={post} key={post.slug}/>
                )}
            </ul>
        </div>

    )
}