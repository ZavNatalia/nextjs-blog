import { render, screen } from '@testing-library/react';

vi.mock('next/image', () => ({
    default: ({ alt, ...props }: { alt: string; [key: string]: unknown }) => (
        <img alt={alt} {...props} />
    ),
}));

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

import HeroCard from './HeroCard';

const mockDictionary = {
    greetings: 'Welcome to my blog!',
    greetingsDescription: 'A place for web dev articles.',
    goToAllPosts: 'Go to all posts',
} as never;

describe('HeroCard', () => {
    it('renders greeting text', () => {
        render(<HeroCard dictionary={mockDictionary} lang="en" />);
        expect(screen.getByText('Welcome to my blog!')).toBeInTheDocument();
        expect(
            screen.getByText('A place for web dev articles.'),
        ).toBeInTheDocument();
    });

    it('renders background hero images', () => {
        render(<HeroCard dictionary={mockDictionary} lang="en" />);
        const images = screen.getAllByRole('presentation');
        expect(images).toHaveLength(2);
    });

    it('renders CTA link to posts page', () => {
        render(<HeroCard dictionary={mockDictionary} lang="en" />);
        const link = screen.getByRole('link', { name: 'Go to all posts' });
        expect(link).toHaveAttribute('href', '/en/posts');
    });
});
