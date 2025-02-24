import PostCard, { IPost } from '@/components/ui/posts/post-card/post-card';
import { getDictionary } from '@/get-dictionary';
import { Locale } from '@/i18n-config';

export default function PostsGrid({
                                      posts,
                                      dictionary,
                                      lang,
                                  }: {
    posts: IPost[],
    dictionary: Awaited<ReturnType<typeof getDictionary>>['server-component'],
    lang: Locale
}) {

    return (
        <ul className="mx-auto grid grid-cols-1 gap-6 lg:grid-cols-2">
            {posts?.map((post) => <PostCard
                post={post}
                key={post.slug}
                dictionary={dictionary}
                lang={lang}
            />)}
        </ul>
    );
}
