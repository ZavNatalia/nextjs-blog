import React, { Suspense } from 'react';

import HeroCard from '@/components/ui/HeroCard';
import LatestNews from '@/components/ui/news/latest-news';
import LatestNewsSkeleton from '@/components/ui/news/latest-news-skeleton';
import FeaturedPosts from '@/components/ui/posts/featured-posts';
import { getDictionary } from '@/get-dictionary';
import { Locale } from '@/i18n-config';

export default async function HomePage(props: {
    params: Promise<{ lang: Locale }>;
}) {
    const { lang } = await props.params;
    const dictionary = await getDictionary(lang)?.['common'];

    return (
        <main className="page">
            <HeroCard dictionary={dictionary} />
            <Suspense fallback={<LatestNewsSkeleton />}>
                <LatestNews lang={lang} />
            </Suspense>
            <FeaturedPosts dictionary={dictionary} lang={lang} />
        </main>
    );
}
