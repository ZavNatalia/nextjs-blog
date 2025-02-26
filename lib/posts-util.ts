import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { IPost } from '@/components/ui/posts/post-card/post-card';
import { Locale } from '@/i18n-config';

const postsDirectory = (lang: Locale) => path.join(process.cwd(), `posts/${lang}`);

export function getPostsFiles(lang: Locale) {
    return fs.readdirSync(postsDirectory(lang));
}

export function getPostData(postIdentifier: string, lang: Locale): IPost | null {
    const postSlug: string = postIdentifier.replace(/\.md$/, '');
    const filePath = path.join(postsDirectory(lang), `${postSlug}.md`);

    if (!fs.existsSync(filePath)) {
        console.error(`File not found: ${filePath}`);
        return null;
    }

    try {
        const fileContent = fs.readFileSync(filePath, 'utf-8');
        const { data, content } = matter(fileContent);
        return {
            slug: postSlug,
            ...data,
            content,
        } as IPost;
    } catch (error) {
        console.error(`Error reading file ${filePath}:`, error);
        return null;
    }
}
export function getAllPosts(lang: Locale): IPost[] {
    const postFiles = getPostsFiles(lang);
    const allPosts = postFiles
        .map((postFile) => getPostData(postFile, lang))
        .filter((post): post is IPost => post !== null);
    return allPosts.sort((postA, postB) => (postA.date > postB.date ? -1 : 1));
}

export function getFeaturedPosts(lang: Locale) {
    const allPosts = getAllPosts(lang);
    return allPosts.filter((post) => post.isFeatured);
}
