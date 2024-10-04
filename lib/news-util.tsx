import path from 'path';
import fs from 'fs';
import matter from 'gray-matter';

export interface INews {
    slug: string;
    title: string;
    date: string;
    image?: any;
    excerpt: string;
    content?: string;
    isLatest: boolean;
}

const newsDirectory = path.join(process.cwd(), 'news');
export function getNewsFiles() {
    return fs.readdirSync(newsDirectory);
}

export function getNewsData(newsIdentifier: string): INews | null {
    const newsSlug: string = newsIdentifier.replace(/\.md$/, '');
    const filePath = path.join(newsDirectory, `${newsSlug}.md`);

    if (!fs.existsSync(filePath)) {
        console.error(`File not found: ${filePath}`);
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
export function getAllNews(): INews[] {
    const newsFiles = getNewsFiles();
    const allNews = newsFiles
        .map((newsFile) => getNewsData(newsFile))
        .filter((news): news is INews => news !== null);
    return allNews.sort((newsA, newsB) => (newsA.date > newsB.date ? -1 : 1));
}

export function getLatestNews() {
    const allNews = getAllNews();
    return allNews.filter((news) => news.isLatest);
}
