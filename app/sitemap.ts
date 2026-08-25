import type { MetadataRoute } from 'next';

import { i18n, type Locale } from '@/i18n-config';
import { getAllNews } from '@/lib/news';
import { getAllPosts } from '@/lib/posts';

const BASE_URL = 'https://zav.me';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const locales = i18n.locales;

    const staticPages = locales.map((lang) => ({
        url: `${BASE_URL}/${lang}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.7,
        alternates: {
            languages: {
                ...Object.fromEntries(
                    locales.map((l) => [l, `${BASE_URL}/${l}`]),
                ),
                'x-default': BASE_URL,
            },
        },
    }));

    const postEntries = (
        await Promise.all(
            locales.map(async (lang: Locale) => {
                const posts = await getAllPosts(lang);
                return posts.map((post) => ({
                    url: `${BASE_URL}/${lang}/posts/${post.slug}`,
                    lastModified: new Date(post.date),
                    changeFrequency: 'weekly' as const,
                    priority: 0.7,
                    alternates: {
                        languages: {
                            ...Object.fromEntries(
                                locales.map((l) => [
                                    l,
                                    `${BASE_URL}/${l}/posts/${post.slug}`,
                                ]),
                            ),
                            'x-default': `${BASE_URL}/posts/${post.slug}`,
                        },
                    },
                }));
            }),
        )
    ).flat();

    const newsEntries = (
        await Promise.all(
            locales.map(async (lang: Locale) => {
                const news = await getAllNews(lang);
                return news.map((item) => ({
                    url: `${BASE_URL}/${lang}/news/${item.slug}`,
                    lastModified: new Date(item.date),
                    changeFrequency: 'weekly' as const,
                    priority: 0.7,
                    alternates: {
                        languages: {
                            ...Object.fromEntries(
                                locales.map((l) => [
                                    l,
                                    `${BASE_URL}/${l}/news/${item.slug}`,
                                ]),
                            ),
                            'x-default': `${BASE_URL}/news/${item.slug}`,
                        },
                    },
                }));
            }),
        )
    ).flat();

    return [...staticPages, ...postEntries, ...newsEntries];
}
