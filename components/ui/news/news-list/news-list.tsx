import { INews } from '@/lib/news-util';
import { Locale } from '@/i18n-config';
import NewsItemHeader from '@/components/ui/news/news-list/news-item-header';
import ReactMarkdown from 'react-markdown';

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

    const NewsItem = ({ newsItem }: { newsItem: INews }) => {
        const { title, date, slug, image, content } = newsItem;
        const imagePath = `/images/news/${slug}/${image}`;
        return (
            <li className="lg:max-w-4xl">
                <NewsItemHeader
                    title={title}
                    date={date}
                    imagePath={imagePath}
                    lang={lang}
                />
                <ReactMarkdown className="markdown-content prose-sm dark:prose-invert lg:prose-lg">
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
