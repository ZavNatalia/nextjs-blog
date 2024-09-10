import AllPosts from '@/components/ui/posts/all-posts';
import { getAllPosts } from '@/lib/posts-util';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: "All Posts",
    description: "A list of all programming-related tutorials and posts!",
};

export default function Posts() {
    const posts = getAllPosts();
    return (
        <main className="flex min-h-full flex-col items-center justify-between p-24 w-full">
            <AllPosts posts={posts}/>
        </main>
    )
}