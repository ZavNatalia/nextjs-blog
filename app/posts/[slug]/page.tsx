import PostContent from '@/components/ui/posts/post-detail/post-content';
import { getPostData, getPostsFiles } from '@/lib/posts-util';
import Breadcrumbs, { Breadcrumb } from '@/components/ui/breadcrumbs';
import { notFound } from 'next/navigation';
import { IPost } from '@/components/ui/posts/post-card';

interface PageProps {
    params: { slug: string };
}

const substringText = (text: string, length = 50): string =>
    text.length > length ? `${text.substring(0, length)}...` : text;

async function getPost(slug: string): Promise<IPost | null> {
    return getPostData(slug);
}

export async function generateMetadata({ params }: PageProps) {
    const post = await getPost(params.slug);
    if (!post) return { title: 'Post Not Found' };

    return {
        title: post.title,
        description: post.excerpt,
    };
}

export default async function Page({ params }: PageProps) {
    const post = await getPost(params.slug);

    if (!post) {
        notFound();
    }

    const breadcrumbs: Breadcrumb[] = [
        { title: 'main', link: '/' },
        { title: 'all posts', link: '/posts' },
        { title: substringText(post.title).toLowerCase(), link: `/posts/${post.slug}` },
    ];

    return (
        <main className="flex min-h-full flex-col items-center justify-between px-32 py-8 w-full gap-8">
            <Breadcrumbs breadcrumbs={breadcrumbs} />
            <PostContent post={post} />
        </main>
    );
}

export async function generateStaticParams() {
    const postsFileNames = getPostsFiles();
    return postsFileNames
        .map(fileName => fileName.replace(/\.md$/, ''))
        .map(slug => ({ slug }));
}