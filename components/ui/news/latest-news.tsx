import { getLatestNews } from '@/lib/news-util';
import NewsList from '@/components/ui/news/news-list/news-list';
import { Locale } from '@/i18n-config';
import BackToTopButton from '@/components/ui/BackToTopButton';
import Script from 'next/script';

export const revalidate = 3600;
export const dynamic = 'force-static';

export default async function LatestNews({ lang }: { lang: Locale }) {
    const latestNews = await getLatestNews(lang);
    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'ItemList',
        itemListElement: latestNews.map((news, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            name: news.title,
            url: `https://zav.me/${lang}/news/${news.slug}`,
        })),
    };
    return (
        <div className="px-4 md:rounded-3xl md:bg-background-secondary/60 md:p-6 lg:p-10">
            <NewsList newsList={latestNews} lang={lang} />
            <Script
                id="home-news-jsonld"
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <BackToTopButton />
        </div>
    );
}
