import fs from 'fs';
import { vi } from 'vitest';

vi.mock('fs', () => ({
    default: {
        promises: {
            readdir: vi.fn(),
            access: vi.fn(),
            readFile: vi.fn(),
        },
    },
}));

const mockReaddir = vi.mocked(fs.promises.readdir);
const mockAccess = vi.mocked(fs.promises.access);
const mockReadFile = vi.mocked(fs.promises.readFile);

import { getAllPosts, getFeaturedPosts,getPostData, getPostsFiles } from './posts';

const makeMd = (frontmatter: Record<string, unknown>, content = 'body') => {
    const lines = Object.entries(frontmatter).map(([k, v]) => `${k}: ${v}`);
    return `---\n${lines.join('\n')}\n---\n${content}`;
};

beforeEach(() => {
    vi.clearAllMocks();
});

describe('getPostsFiles', () => {
    it('returns file list for a locale', async () => {
        mockReaddir.mockResolvedValue(['post1.md', 'post2.md'] as never);
        const files = await getPostsFiles('en');
        expect(files).toEqual(['post1.md', 'post2.md']);
    });
});

describe('getPostData', () => {
    it('parses frontmatter and returns post object', async () => {
        mockAccess.mockResolvedValue(undefined);
        mockReadFile.mockResolvedValue(
            makeMd({
                title: 'Test Post',
                date: "'2025-01-01'",
                excerpt: 'An excerpt',
                image: 'test.png',
                isFeatured: true,
            }),
        );

        const post = await getPostData('post1.md', 'en');
        expect(post).toMatchObject({
            slug: 'post1',
            title: 'Test Post',
            excerpt: 'An excerpt',
            isFeatured: true,
            readingTime: 1,
        });
        expect(post!.content).toBe('body');
    });

    it('returns null when file does not exist', async () => {
        mockAccess.mockRejectedValue(new Error('ENOENT'));
        const post = await getPostData('missing.md', 'en');
        expect(post).toBeNull();
    });
});

describe('getAllPosts', () => {
    it('returns posts sorted by date descending', async () => {
        mockReaddir.mockResolvedValue(['a.md', 'b.md'] as never);
        mockAccess.mockResolvedValue(undefined);

        mockReadFile
            .mockResolvedValueOnce(
                makeMd({ title: 'Old', date: "'2024-01-01'", excerpt: 'old', isFeatured: false }),
            )
            .mockResolvedValueOnce(
                makeMd({ title: 'New', date: "'2025-06-01'", excerpt: 'new', isFeatured: false }),
            );

        const posts = await getAllPosts('en');
        expect(posts).toHaveLength(2);
        expect(posts[0].title).toBe('New');
        expect(posts[1].title).toBe('Old');
    });
});

describe('getFeaturedPosts', () => {
    it('returns only posts with isFeatured: true', async () => {
        mockReaddir.mockResolvedValue(['a.md', 'b.md'] as never);
        mockAccess.mockResolvedValue(undefined);

        mockReadFile
            .mockResolvedValueOnce(
                makeMd({ title: 'Featured', date: "'2025-01-01'", excerpt: 'f', isFeatured: true }),
            )
            .mockResolvedValueOnce(
                makeMd({ title: 'Normal', date: "'2025-01-02'", excerpt: 'n', isFeatured: false }),
            );

        const posts = await getFeaturedPosts('en');
        expect(posts).toHaveLength(1);
        expect(posts[0].title).toBe('Featured');
    });
});
