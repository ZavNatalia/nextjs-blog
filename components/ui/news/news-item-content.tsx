import { INews } from '@/lib/news-util';
import ReactMarkdown, { Components } from 'react-markdown';
import { ComponentPropsWithoutRef } from 'react';
import Image from 'next/image';
import NewsItemHeader from '@/components/ui/news/news-item-header';

export default function NewsItemContent({ newsItem }: { newsItem: INews }) {
    const { title, date, slug, image, content } = newsItem;
    const imagePath = `/images/news/${slug}/${image}`;

    const customRenderers: Components = {
        p: ({
            node,
            ...props
        }: ComponentPropsWithoutRef<'p'> & { node: any }) => {
            if (node.children[0]?.tagName === 'img') {
                const img = node.children[0];
                return (
                    <div className="flex justify-center">
                        <Image
                            className="rounded-3xl object-contain"
                            src={`/images/news/${slug}/${img.properties.src}`}
                            alt={img.properties.alt}
                            width={600}
                            height={600}
                            sizes="(max-width: 600px) 100vw, 600px"
                        />
                    </div>
                );
            }
            return <p {...props} />;
        },
    };

    return (
        <article>
            <NewsItemHeader title={title} date={date} imagePath={imagePath} />
            <ReactMarkdown
                components={customRenderers}
                className="prose lg:prose-xl dark:prose-invert"
            >
                {content as string}
            </ReactMarkdown>
        </article>
    );
}
