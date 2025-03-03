import PostContent from '@/components/ui/posts/post-detail/post-content';
import { getPostData, getPostsFiles } from '@/lib/posts-util';
import Breadcrumbs, { Breadcrumb } from '@/components/ui/Breadcrumbs';
import { notFound } from 'next/navigation';
import { IPost } from '@/components/ui/posts/post-card/post-card';
import Link from 'next/link';
import { getDictionary } from '@/get-dictionary';
import { Locale } from '@/i18n-config';

interface PageProps {
    params: Promise<{ slug: string; lang: Locale }>;
}

const substringText = (text: string, length = 50): string =>
    text.length > length ? `${text.substring(0, length)}...` : text;

async function getPost(slug: string, lang: Locale): Promise<IPost | null> {
    return getPostData(slug, lang);
}

export async function generateMetadata(props: PageProps) {
    const { lang, slug } = await props.params;
    const post = await getPost(slug, lang);
    if (!post) return { title: 'Post Not Found' };

    return {
        title: post.title,
        description: post.excerpt,
    };
}

export default async function Page(props: PageProps) {
    const { slug, lang } = await props.params;
    const post = await getPost(slug, lang);

    const dictionary = getDictionary(lang)?.['posts-page'];

    if (!post) {
        notFound();
    }

    const breadcrumbs: Breadcrumb[] = [
        { title: dictionary.main, link: '/' },
        { title: dictionary.allPosts, link: '/posts' },
        {
            title: substringText(post.title).toLowerCase(),
            link: `/posts/${post.slug}`,
        },
    ];

    return (
        <main className="page">
            <Breadcrumbs breadcrumbs={breadcrumbs} />
            <PostContent post={post} />
            <Link href="/posts" className="button-accent">
                {dictionary.goToAllPosts}
            </Link>
        </main>
    );
}

export async function generateStaticParams(props: PageProps) {
    const { lang } = await props.params;
    const postsFileNames = getPostsFiles(lang);
    return postsFileNames
        .map((fileName) => fileName.replace(/\.md$/, ''))
        .map((slug) => ({ slug }));
}
