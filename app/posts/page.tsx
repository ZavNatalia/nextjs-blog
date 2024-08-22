import PostsGrid from '@/components/ui/posts/posts-grid';

export default function Posts() {
    return (
        <main className="flex min-h-screen flex-col items-center justify-between p-24 w-full">
            <h1>Posts</h1>
            <PostsGrid posts={[]}/>
        </main>
    )
}