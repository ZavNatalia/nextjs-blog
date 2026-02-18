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

vi.mock('next/image', () => ({
    default: ({ alt, ...props }: { alt: string; [key: string]: unknown }) => (
        <img alt={alt} {...props} />
    ),
}));

import { NavigationList } from './NavigationList';

const mockDictionary = {
    home: 'Home',
    posts: 'Posts',
    contact: 'Contact',
    auth: 'Sign In',
    userProfile: 'Profile',
    openMenu: 'Open menu',
    closeMenu: 'Close menu',
} as never;

describe('NavigationList', () => {
    it('renders main navigation links', () => {
        render(
            <NavigationList
                normalizedPathname="/"
                session={null}
                status="unauthenticated"
                dictionary={mockDictionary}
            />,
        );
        expect(screen.getByText('Home')).toBeInTheDocument();
        expect(screen.getByText('Posts')).toBeInTheDocument();
        expect(screen.getByText('Contact')).toBeInTheDocument();
    });

    it('shows auth link when no session', () => {
        render(
            <NavigationList
                normalizedPathname="/"
                session={null}
                status="unauthenticated"
                dictionary={mockDictionary}
            />,
        );
        expect(screen.getByText('Sign In')).toBeInTheDocument();
    });

    it('shows loader when status is loading', () => {
        const { container } = render(
            <NavigationList
                normalizedPathname="/"
                session={null}
                status="loading"
                dictionary={mockDictionary}
            />,
        );
        expect(container.querySelector('.animate-spin')).toBeInTheDocument();
        expect(screen.queryByText('Sign In')).not.toBeInTheDocument();
    });

    it('shows profile button when authenticated', () => {
        render(
            <NavigationList
                normalizedPathname="/"
                session={{ user: { email: 'test@test.com' } }}
                status="authenticated"
                dictionary={mockDictionary}
            />,
        );
        expect(screen.getByRole('link', { name: 'Profile' })).toBeInTheDocument();
        expect(screen.queryByText('Sign In')).not.toBeInTheDocument();
    });

    it('highlights active link', () => {
        render(
            <NavigationList
                normalizedPathname="/posts"
                session={null}
                status="unauthenticated"
                dictionary={mockDictionary}
            />,
        );
        const postsLink = screen.getByText('Posts').closest('a');
        expect(postsLink).toHaveClass('text-accent');
    });
});
