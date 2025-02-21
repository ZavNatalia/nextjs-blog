import PostCard, { IPost } from '@/components/ui/posts/post-card/post-card';
import { getDictionary } from '@/get-dictionary';

export default function PostsGrid({
                                      posts,
                                      dictionary
}: {
    posts: IPost[] ,
    dictionary: Awaited<ReturnType<typeof getDictionary>>["server-component"]
}) {

    return (
        <ul className="mx-auto grid grid-cols-1 gap-6 lg:grid-cols-2">
            {posts?.map((post) => <PostCard
                post={post}
                key={post.slug}
                dictionary={dictionary}
            />)}
        </ul>
    );
}
