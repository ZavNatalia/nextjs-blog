import { vi } from 'vitest';
import fs from 'fs';

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

import { getNewsFiles, getNewsData, getAllNews, getLatestNews } from './news';

const makeMd = (frontmatter: Record<string, unknown>, content = 'body') => {
    const lines = Object.entries(frontmatter).map(([k, v]) => `${k}: ${v}`);
    return `---\n${lines.join('\n')}\n---\n${content}`;
};

beforeEach(() => {
    vi.clearAllMocks();
});

describe('getNewsFiles', () => {
    it('returns file list for a locale', async () => {
        mockReaddir.mockResolvedValue(['news1.md', 'news2.md'] as any);
        const files = await getNewsFiles('en');
        expect(files).toEqual(['news1.md', 'news2.md']);
    });
});

describe('getNewsData', () => {
    it('parses frontmatter and returns news object', async () => {
        mockAccess.mockResolvedValue(undefined);
        mockReadFile.mockResolvedValue(
            makeMd({
                title: 'Test News',
                date: "'2025-01-01'",
                excerpt: 'An excerpt',
                isLatest: true,
            }),
        );

        const news = await getNewsData('news1.md', 'en');
        expect(news).toMatchObject({
            slug: 'news1',
            title: 'Test News',
            excerpt: 'An excerpt',
            isLatest: true,
        });
        expect(news!.content).toBe('body');
    });

    it('returns null when file does not exist', async () => {
        mockAccess.mockRejectedValue(new Error('ENOENT'));
        const news = await getNewsData('missing.md', 'en');
        expect(news).toBeNull();
    });
});

describe('getAllNews', () => {
    it('returns news sorted by date descending', async () => {
        mockReaddir.mockResolvedValue(['a.md', 'b.md'] as any);
        mockAccess.mockResolvedValue(undefined);

        mockReadFile
            .mockResolvedValueOnce(
                makeMd({ title: 'Old', date: "'2024-01-01'", excerpt: 'old', isLatest: false }),
            )
            .mockResolvedValueOnce(
                makeMd({ title: 'New', date: "'2025-06-01'", excerpt: 'new', isLatest: false }),
            );

        const news = await getAllNews('en');
        expect(news).toHaveLength(2);
        expect(news[0].title).toBe('New');
        expect(news[1].title).toBe('Old');
    });
});

describe('getLatestNews', () => {
    it('returns only news with isLatest: true', async () => {
        mockReaddir.mockResolvedValue(['a.md', 'b.md'] as any);
        mockAccess.mockResolvedValue(undefined);

        mockReadFile
            .mockResolvedValueOnce(
                makeMd({ title: 'Latest', date: "'2025-01-01'", excerpt: 'l', isLatest: true }),
            )
            .mockResolvedValueOnce(
                makeMd({ title: 'Older', date: "'2025-01-02'", excerpt: 'o', isLatest: false }),
            );

        const news = await getLatestNews('en');
        expect(news).toHaveLength(1);
        expect(news[0].title).toBe('Latest');
    });
});
