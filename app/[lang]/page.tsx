import React, { Suspense } from 'react';
import HeroCard from '@/components/ui/HeroCard';
import FeaturedPosts from '@/components/ui/posts/featured-posts';
import { getDictionary } from '@/get-dictionary';
import { Locale } from '@/i18n-config';
import Loader from '@/components/ui/Loader';
import LatestNews from '@/components/ui/news/latest-news';

export default async function HomePage(props: {
    params: Promise<{ lang: Locale }>;
}) {
    const { lang } = await props.params;
    const dictionary = await getDictionary(lang)?.['server-component'];

    return (
        <main className="page">
            <HeroCard dictionary={dictionary} />
            <Suspense fallback={<Loader size={50} />}>
                <LatestNews lang={lang} dictionary={dictionary} />
            </Suspense>
            <FeaturedPosts dictionary={dictionary} lang={lang} />
        </main>
    );
}
