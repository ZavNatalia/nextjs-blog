import PostItem, { IPost } from '@/components/ui/posts/post-item';

export default function PostsGrid({posts}: {posts: IPost[]}) {
    return (
        <ul>
            {posts.map(post => <PostItem post={post} key={post.slug}/>)}
        </ul>
    )
}