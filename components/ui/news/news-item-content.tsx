import { INews } from '@/lib/news-util';
import ReactMarkdown from 'react-markdown';
import Image from 'next/image';
import NewsItemHeader from '@/components/ui/news/news-item-header';

export default function NewsItemContent({ newsItem }: { newsItem: INews }) {
    const { title, date, slug, image, content } = newsItem;
    const imagePath = `/images/news/${slug}/${image}`;

    const customRenderers = {
        img({ src, alt }: { src?: string; alt?: string }) {
            if (!src) return null;

            return (
                <Image
                    src={`/images/news/${slug}/${src}`}
                    alt={alt || 'News Image'}
                    width={600}
                    height={600}
                    sizes="(max-width: 600px) 100vw, 600px"
                    className="mx-auto rounded-3xl object-contain"
                />
            );
        },
    };

    return (
        <article>
            <NewsItemHeader title={title} date={date} imagePath={imagePath} />
            <ReactMarkdown
                components={{ img: customRenderers.img }}
                className="prose lg:prose-xl dark:prose-invert"
            >
                {content}
            </ReactMarkdown>
        </article>
    );
}
