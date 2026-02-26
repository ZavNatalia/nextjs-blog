import { render, screen } from '@testing-library/react';

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

import type { IPost } from '@/components/ui/posts/post-card/post-card';

import PostsGrid from './posts-grid';

const mockPosts: IPost[] = [
    {
        slug: 'first-post',
        title: 'First Post',
        date: '2025-03-15',
        excerpt: 'First excerpt',
        isFeatured: true,
        image: 'first.png',
    },
    {
        slug: 'second-post',
        title: 'Second Post',
        date: '2025-03-16',
        excerpt: 'Second excerpt',
        isFeatured: false,
        image: 'second.png',
    },
];

const mockDictionary = { readMore: 'Read More', minRead: 'min read' };

describe('PostsGrid', () => {
    it('renders all posts', () => {
        render(
            <PostsGrid
                posts={mockPosts}
                dictionary={mockDictionary}
                lang="en"
            />,
        );
        expect(screen.getByText('First Post')).toBeInTheDocument();
        expect(screen.getByText('Second Post')).toBeInTheDocument();
    });

    it('renders empty grid when no posts', () => {
        const { container } = render(
            <PostsGrid posts={[]} dictionary={mockDictionary} lang="en" />,
        );
        const list = container.querySelector('ul');
        expect(list?.children).toHaveLength(0);
    });
});
