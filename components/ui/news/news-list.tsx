'use client';
import NewsItemContent from '@/components/ui/news/news-item-content';
import { useEffect, useState } from 'react';
import { INews } from '@/lib/news-util';

export default function NewsList({ latestNews }: { latestNews: INews[] }) {
    const [showButton, setShowButton] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 600) {
                setShowButton(true);
            } else {
                setShowButton(false);
            }
        };
        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    };

    if (!latestNews) {
        return;
    }

    return (
        <>
            <ul>
                {latestNews.map((item) => (
                    <NewsItemContent newsItem={item} key={item.slug} />
                ))}
            </ul>
            {showButton && (
                <button
                    onClick={scrollToTop}
                    className="button fixed bottom-8 right-8 rounded-full bg-primary-contrast/80 dark:bg-dark-soft text-secondary shadow-md hover:bg-accent dark:hover:bg-accent-dark hover:text-foreground-contrast"
                >
                    Back to Top
                </button>
            )}
        </>
    );
}
