import PostContent from '@/components/ui/posts/post-detail/post-content';
import { getPostData, getPostsFiles } from '@/lib/posts-util';
import Breadcrumbs, { Breadcrumb } from '@/components/ui/Breadcrumbs';
import { notFound } from 'next/navigation';
import { IPost } from '@/components/ui/posts/post-card/post-card';
import Link from 'next/link';
import { getDictionary } from '@/get-dictionary';
import { Locale } from '@/i18n-config';
import BackToTopButton from '@/components/ui/BackToTopButton';
import Script from 'next/script';
import fs from 'fs';
import path from 'path';

export const revalidate = 3600;
export const dynamic = 'force-static';

interface PageProps {
    params: Promise<{ slug: string; lang: Locale }>;
}

const substringText = (text: string, length = 50): string =>
    text.length > length ? `${text.substring(0, length)}...` : text;

async function getPost(slug: string, lang: Locale): Promise<IPost | null> {
    return await getPostData(slug, lang);
}
async function getAvailableLanguages(
    slug: string,
): Promise<Partial<Record<Locale, string>>> {
    const langs: Locale[] = ['en', 'ru'];
    const result: Partial<Record<Locale, string>> = {};

    langs.forEach((lang) => {
        const filePath = path.join(process.cwd(), `posts/${lang}/${slug}.md`);
        if (fs.existsSync(filePath)) {
            result[lang] = `https://zav.me/${lang}/posts/${slug}`;
        }
    });

    return result;
}

function shortenDescription(text: string, maxLength = 150): string {
    if (text.length <= maxLength) return text;

    const truncated = text.slice(0, maxLength);

    const lastSpace = truncated.lastIndexOf(' ');
    return `${truncated.slice(0, lastSpace)}...`;
}

export async function generateMetadata(props: PageProps) {
    const { lang, slug } = await props.params;
    const post = await getPost(slug, lang);
    if (!post) return { title: 'Post Not Found' };
    const alternatesLanguages = await getAvailableLanguages(slug);

    const imageUrl = `https://zav.me/images/posts/${slug}/${post.image}`;
    const baseUrl = `https://zav.me`;

    return {
        title: post.title,
        description: shortenDescription(post.excerpt),
        openGraph: {
            title: post.title,
            description: post.excerpt,
            type: 'article',
            url: `${baseUrl}/${lang}/posts/${slug}`,
            images: [
                {
                    url: imageUrl,
                    alt: post.title,
                },
            ],
        },
        twitter: {
            card: 'summary_large_image',
            title: post.title,
            description: post.excerpt,
            images: [imageUrl],
        },
        alternates: {
            canonical: `${baseUrl}/${lang}/posts/${slug}`,
            languages: alternatesLanguages,
        },
    };
}

export default async function Page(props: PageProps) {
    const { slug, lang } = await props.params;
    const post = await getPost(slug, lang);
    const dictionary = await getDictionary(lang)?.['posts-page'];

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

    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'BlogPosting',
        headline: post.title,
        description: post.excerpt,
        image: `https://zav.me/images/posts/${post.slug}/${post.image}`,
        datePublished: post.date,
        mainEntityOfPage: `https://zav.me/${lang}/posts/${post.slug}`,
    };

    return (
        <main className="page">
            <h1 className="sr-only">{post.title}</h1>
            <Breadcrumbs breadcrumbs={breadcrumbs} />
            <PostContent post={post} dictionary={dictionary} />
            <Link
                aria-label={dictionary.goToAllPosts}
                href="/posts"
                className="button button-solid button-md"
            >
                {dictionary.goToAllPosts}
            </Link>
            <BackToTopButton />
            <Script
                id="post-jsonld"
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
        </main>
    );
}

export async function generateStaticParams(props: PageProps) {
    const { lang } = await props.params;
    const postsFileNames = await getPostsFiles(lang);
    return postsFileNames
        .map((fileName) => fileName.replace(/\.md$/, ''))
        .map((slug) => ({ slug }));
}
