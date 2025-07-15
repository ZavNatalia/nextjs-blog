import path from 'path';
import fs from 'fs';
import matter from 'gray-matter';
import { Locale } from '@/i18n-config';

export interface INews {
    slug: string;
    title: string;
    date: string;
    image?: any;
    excerpt: string;
    content?: string;
    isLatest: boolean;
}

const newsDirectory = (lang: Locale) =>
    path.join(process.cwd(), `data/news/${lang}`);
export async function getNewsFiles(lang: Locale) {
    return fs.readdirSync(newsDirectory(lang));
}

export function getNewsData(
    newsIdentifier: string,
    lang: Locale,
): INews | null {
    const newsSlug: string = newsIdentifier.replace(/\.md$/, '');
    const filePath = path.join(newsDirectory(lang), `${newsSlug}.md`);

    if (!fs.existsSync(filePath)) {
        console.log(`File not found: ${filePath}`);
        return null;
    }

    try {
        const fileContent = fs.readFileSync(filePath, 'utf-8');
        const { data, content } = matter(fileContent);
        return {
            slug: newsSlug,
            ...data,
            content,
        } as INews;
    } catch (error) {
        console.error(`Error reading file ${filePath}:`, error);
        return null;
    }
}
export async function getAllNews(lang: Locale): Promise<INews[]> {
    const newsFiles = await getNewsFiles(lang);
    const allNews = newsFiles
        .map((newsFile) => getNewsData(newsFile, lang))
        .filter((news): news is INews => news !== null);
    return allNews.sort((newsA, newsB) => (newsA.date > newsB.date ? -1 : 1));
}

export async function getLatestNews(lang: Locale) {
    const allNews = await getAllNews(lang);
    return allNews.filter((news) => news.isLatest);
}
