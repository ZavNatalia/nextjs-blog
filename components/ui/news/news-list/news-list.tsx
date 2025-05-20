import React from 'react';
import { INews } from '@/lib/news-util';
import { Locale } from '@/i18n-config';
import NewsItemHeader from '@/components/ui/news/news-list/news-item-header';
import ReactMarkdown, { Components } from 'react-markdown';
import Image from 'next/image';

export default function NewsList({
    newsList,
    lang,
}: {
    newsList: INews[];
    lang: Locale;
}) {
    if (!newsList) {
        return;
    }

    const NewsItem = ({
        newsItem,
        lang,
    }: {
        newsItem: INews;
        lang: Locale;
    }) => {
        const { title, date, slug, image, content } = newsItem;
        const imagePath = `/images/news/${slug}/${image}`;

        const customRenderers: Components = {
            img({ src, alt }: { src?: string | Blob; alt?: string }) {
                if (!src) return null;

                return (
                    <Image
                        src={`/images/posts/${slug}/${src}`}
                        alt={alt || 'Post Image'}
                        width={500}
                        height={500}
                        sizes="(max-width: 869px) 100vw, 500px"
                        className="mx-auto rounded-xl object-contain"
                    />
                );
            },
            a({ href, children }) {
                const isExternal = href?.startsWith('http');
                const ariaLabel = React.Children.toArray(children)
                    .filter((child) => typeof child === 'string')
                    .join(' ')
                    .trim();
                return (
                    <a
                        aria-label={ariaLabel || undefined}
                        href={href}
                        target={isExternal ? '_blank' : undefined}
                        rel={isExternal ? 'noopener noreferrer' : undefined}
                    >
                        {children}
                    </a>
                );
            },
        };

        return (
            <li className="lg:max-w-4xl">
                <NewsItemHeader
                    title={title}
                    date={date}
                    imagePath={imagePath}
                    lang={lang}
                />
                <ReactMarkdown
                    components={customRenderers}
                    className="markdown-content prose-sm dark:prose-invert lg:prose-lg"
                >
                    {content}
                </ReactMarkdown>
            </li>
        );
    };

    return (
        <ul>
            {newsList.map((item) => (
                <NewsItem newsItem={item} key={item.slug} lang={lang} />
            ))}
        </ul>
    );
}
