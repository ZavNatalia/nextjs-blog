import { INews } from '@/lib/news-util';
import ReactMarkdown from 'react-markdown';
import NewsItemHeader from '@/components/ui/news/news-item-header';

export default function NewsItemContent({ newsItem }: { newsItem: INews }) {
    const { title, date, slug, image, content } = newsItem;
    const imagePath = `/images/news/${slug}/${image}`;

    return (
        <li className="lg:max-w-4xl">
            <NewsItemHeader title={title} date={date} imagePath={imagePath} />
            <ReactMarkdown className="markdown-content prose-sm dark:prose-invert lg:prose-lg">
                {content}
            </ReactMarkdown>
        </li>
    );
}
