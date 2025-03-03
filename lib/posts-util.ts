import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { IPost } from '@/components/ui/posts/post-card/post-card';
import { Locale } from '@/i18n-config';

const postsDirectory = (lang: Locale) =>
    path.join(process.cwd(), `posts/${lang}`);

export async function getPostsFiles(lang: Locale) {
    return await fs.promises.readdir(postsDirectory(lang));
}

export async function getPostData(
    postIdentifier: string,
    lang: Locale,
): Promise<IPost | null> {
    const postSlug: string = postIdentifier.replace(/\.md$/, '');
    const filePath = path.join(postsDirectory(lang), `${postSlug}.md`);

    try {
        await fs.promises.access(filePath);
        const fileContent = await fs.promises.readFile(filePath, 'utf-8');
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
export async function getAllPosts(lang: Locale): Promise<IPost[]> {
    const postFiles = await getPostsFiles(lang);
    const allPosts = await Promise.all(
        postFiles.map((postFile) => getPostData(postFile, lang)),
    );

    return allPosts
        .filter((post): post is IPost => post !== null)
        .sort((postA, postB) => (postA.date > postB.date ? -1 : 1));
}

export async function getFeaturedPosts(lang: Locale) {
    const allPosts = await getAllPosts(lang);
    return allPosts.filter((post) => post.isFeatured);
}
