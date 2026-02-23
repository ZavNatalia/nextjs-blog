import { fireEvent, render, screen } from '@testing-library/react';

import type { IPost } from '@/components/ui/posts/post-card/post-card';

import PostsPageClient from './posts-page-client';

vi.mock('next/link', () => ({
    default: ({
        children,
        href,
        ...props
    }: {
        children: React.ReactNode;
        href: string;
        [key: string]: unknown;
    }) => (
        <a href={href} {...props}>
            {children}
        </a>
    ),
}));

const mockPosts: IPost[] = [
    {
        slug: 'nextjs-guide',
        title: 'Getting Started with Next.js',
        date: '2025-03-15',
        excerpt: 'A comprehensive guide to building apps with Next.js',
        isFeatured: true,
        readingTime: 5,
    },
    {
        slug: 'react-hooks',
        title: 'React Hooks Deep Dive',
        date: '2025-03-16',
        excerpt: 'Understanding useState, useEffect and custom hooks',
        isFeatured: false,
        readingTime: 3,
    },
];

const mockDictionary = {
    readMore: 'Read More',
    minRead: 'min read',
    searchPlaceholder: 'Search posts...',
    noSearchResults: 'No posts found matching your search.',
    noPosts: 'No posts yet.',
};

describe('PostsPageClient', () => {
    it('renders all posts initially', () => {
        render(
            <PostsPageClient
                posts={mockPosts}
                dictionary={mockDictionary}
                lang="en"
            />,
        );
        expect(screen.getByText('Getting Started with Next.js')).toBeInTheDocument();
        expect(screen.getByText('React Hooks Deep Dive')).toBeInTheDocument();
    });

    it('renders search input with placeholder', () => {
        render(
            <PostsPageClient
                posts={mockPosts}
                dictionary={mockDictionary}
                lang="en"
            />,
        );
        expect(screen.getByPlaceholderText('Search posts...')).toBeInTheDocument();
    });

    it('filters posts by title', () => {
        render(
            <PostsPageClient
                posts={mockPosts}
                dictionary={mockDictionary}
                lang="en"
            />,
        );
        const input = screen.getByPlaceholderText('Search posts...');
        fireEvent.change(input, { target: { value: 'Next.js' } });

        expect(screen.getByText('Getting Started with Next.js')).toBeInTheDocument();
        expect(screen.queryByText('React Hooks Deep Dive')).not.toBeInTheDocument();
    });

    it('filters posts by excerpt', () => {
        render(
            <PostsPageClient
                posts={mockPosts}
                dictionary={mockDictionary}
                lang="en"
            />,
        );
        const input = screen.getByPlaceholderText('Search posts...');
        fireEvent.change(input, { target: { value: 'custom hooks' } });

        expect(screen.queryByText('Getting Started with Next.js')).not.toBeInTheDocument();
        expect(screen.getByText('React Hooks Deep Dive')).toBeInTheDocument();
    });

    it('shows no results message when search matches nothing', () => {
        render(
            <PostsPageClient
                posts={mockPosts}
                dictionary={mockDictionary}
                lang="en"
            />,
        );
        const input = screen.getByPlaceholderText('Search posts...');
        fireEvent.change(input, { target: { value: 'xyz-nonexistent' } });

        expect(
            screen.getByText('No posts found matching your search.'),
        ).toBeInTheDocument();
    });

    it('shows all posts when search is cleared', () => {
        render(
            <PostsPageClient
                posts={mockPosts}
                dictionary={mockDictionary}
                lang="en"
            />,
        );
        const input = screen.getByPlaceholderText('Search posts...');
        fireEvent.change(input, { target: { value: 'Next.js' } });
        fireEvent.change(input, { target: { value: '' } });

        expect(screen.getByText('Getting Started with Next.js')).toBeInTheDocument();
        expect(screen.getByText('React Hooks Deep Dive')).toBeInTheDocument();
    });

    it('shows noPosts message when posts array is empty', () => {
        render(
            <PostsPageClient
                posts={[]}
                dictionary={mockDictionary}
                lang="en"
            />,
        );
        expect(screen.getByText('No posts yet.')).toBeInTheDocument();
    });
});
