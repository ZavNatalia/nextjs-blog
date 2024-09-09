import PostContent from '@/components/ui/posts/post-detail/post-content';
import { getPostData, getPostsFiles } from '@/lib/posts-util';

export async function generateMetadata({ params }) {
    const post = await getPost(params);
    return {
        title: post?.title,
        description: post?.excerpt,
    }
}

export default async function Page({ params }) {
    const post = await getPost(params);
    if (!post) {
        return <div>NO POST</div>
    }
    return (
        <main className="flex min-h-full flex-col items-center justify-between p-24 w-full">
            <PostContent post={post}/>
        </main>
    )
}

export async function generateStaticParams() {
    const postsFileNames = getPostsFiles();
    const slugs = postsFileNames.map(slug => slug.replace(/\.md$/, ''));
    return slugs.map((slug) => ({params: {slug: slug}}));
}

async function getPost(params) {
    return getPostData(params?.slug);
}