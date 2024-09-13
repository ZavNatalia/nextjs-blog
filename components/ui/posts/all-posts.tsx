import { IPost } from '@/components/ui/posts/post-card';
import PostsGrid from '@/components/ui/posts/posts-grid';

export default function AllPosts({posts}: {posts: IPost[]}) {
    return (
        <div className='w-full'>
            <h2 className="text-4xl font-bold mb-10 text-center">
                All posts
            </h2>
            <PostsGrid posts={posts}/>
        </div>
    )
}