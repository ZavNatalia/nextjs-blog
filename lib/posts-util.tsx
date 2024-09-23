import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { IPost } from '@/components/ui/posts/post-card/post-card';

const postsDirectory = path.join(process.cwd(), 'posts');

export function getPostsFiles() {
    return fs.readdirSync(postsDirectory)
}

export function getPostData(postIdentifier: string): IPost | null {
    const postSlug: string = postIdentifier.replace(/\.md$/, '');
    const filePath = path.join(postsDirectory, `${postSlug}.md`);

    if (!fs.existsSync(filePath)) {
        console.error(`File not found: ${filePath}`);
        return null;
    }

    try {
        const fileContent = fs.readFileSync(filePath, 'utf-8');
        const {data, content} = matter(fileContent);
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
export function getAllPosts(): IPost[] {
    const postFiles = getPostsFiles();
    const allPosts = postFiles.map(postFile => getPostData(postFile))
        .filter((post): post is IPost => post !== null);
    return allPosts.sort((postA, postB) => postA.date > postB.date ? -1 : 1);
}

export function getFeaturedPosts() {
    const allPosts = getAllPosts();
    return allPosts.filter(post => post.isFeatured);
}