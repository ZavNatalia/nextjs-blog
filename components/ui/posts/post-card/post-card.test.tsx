import { render, screen } from '@testing-library/react';

import type { IPost } from './post-card';
import PostCard from './post-card';

vi.mock('next/link', () => ({
    default: ({ children, href, ...props }: { children: React.ReactNode; href: string; [key: string]: unknown }) => (
        <a href={href} {...props}>
            {children}
        </a>
    ),
}));

const mockPost: IPost = {
    slug: 'test-post',
    title: 'My Test Post',
    date: '2025-03-15',
    excerpt: 'This is a test excerpt for the post card.',
    isFeatured: true,
    image: 'test.png',
};

const mockDictionary = { readMore: 'Read More' };

describe('PostCard', () => {
    it('renders post title', () => {
        render(<PostCard post={mockPost} dictionary={mockDictionary} lang="en" />);
        expect(screen.getByText('My Test Post')).toBeInTheDocument();
    });

    it('renders formatted date', () => {
        render(<PostCard post={mockPost} dictionary={mockDictionary} lang="en" />);
        expect(screen.getByText(/Mar 15, 2025/)).toBeInTheDocument();
    });

    it('renders excerpt', () => {
        render(<PostCard post={mockPost} dictionary={mockDictionary} lang="en" />);
        expect(screen.getByText('This is a test excerpt for the post card.')).toBeInTheDocument();
    });

    it('renders read more link with correct href', () => {
        render(<PostCard post={mockPost} dictionary={mockDictionary} lang="en" />);
        const link = screen.getByRole('link', { name: /Read More - My Test Post/i });
        expect(link).toHaveAttribute('href', 'posts/test-post');
    });
});
