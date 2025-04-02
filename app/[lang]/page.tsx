import React from 'react';
import HeroCard from '@/components/ui/HeroCard';
import FeaturedPosts from '@/components/ui/posts/featured-posts';
import { getDictionary } from '@/get-dictionary';
import { Locale } from '@/i18n-config';
import LatestNews from '@/components/ui/news/latest-news';

export default async function HomePage(props: {
    params: Promise<{ lang: Locale }>;
}) {
    const { lang } = await props.params;
    const dictionary = await getDictionary(lang)?.['common'];

    return (
        <main className="page">
            <HeroCard dictionary={dictionary} />
            <LatestNews lang={lang} />
            <FeaturedPosts dictionary={dictionary} lang={lang} />
        </main>
    );
}
