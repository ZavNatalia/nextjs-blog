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
                    width={500}
                    height={500}
                    sizes="(max-width: 400px) 100vw, (max-width: 500px) 50vw, 500px"
                    className="mx-auto rounded-3xl object-contain"
                />
            );
        },
    };

    return (
        <li className="lg:max-w-4xl">
            <NewsItemHeader title={title} date={date} imagePath={imagePath} />
            <ReactMarkdown
                components={{ img: customRenderers.img }}
                className="markdown-content prose-sm lg:prose-lg dark:prose-invert"
            >
                {content}
            </ReactMarkdown>
        </li>
    );
}
