import PostsGrid from '@/components/ui/posts/posts-grid';
import { IPost } from '@/components/ui/posts/post-item';

export default function Posts({posts}: {posts: IPost[]}) {
    return (
        <main className="flex min-h-full flex-col items-center justify-between p-24 w-full">
            <h1 className="text-2xl">Posts</h1>
            <PostsGrid posts={posts}/>
        </main>
    )
}