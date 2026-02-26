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
        // eslint-disable-next-line @next/next/no-img-element
        <img alt={alt} {...props} />
    ),
}));

import type { Dictionary } from '@/get-dictionary';

import { NavigationList } from './NavigationList';

const mockDictionary = {
    home: 'Home',
    posts: 'Posts',
    contact: 'Contact',
    auth: 'Sign In',
    profile: 'Profile',
    userProfile: 'Profile',
    moderation: 'Moderation',
    switchToLightTheme: 'Light',
    switchToDarkTheme: 'Dark',
    switchToRu: 'RU',
    switchToEn: 'EN',
    openMenu: 'Open menu',
    closeMenu: 'Close menu',
} as Dictionary['navigation'];

describe('NavigationList', () => {
    beforeAll(() => {
        process.env.NEXT_PUBLIC_ADMIN_EMAIL = 'admin@test.com';
    });
    afterAll(() => {
        delete process.env.NEXT_PUBLIC_ADMIN_EMAIL;
    });

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
        expect(
            screen.getByRole('link', { name: 'Profile' }),
        ).toBeInTheDocument();
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

    it('shows moderation link for admin user', () => {
        render(
            <NavigationList
                normalizedPathname="/"
                session={{ user: { email: 'admin@test.com' } }}
                status="authenticated"
                dictionary={mockDictionary}
            />,
        );
        expect(
            screen.getByRole('link', { name: 'Moderation' }),
        ).toBeInTheDocument();
    });

    it('does not show moderation link for non-admin user', () => {
        render(
            <NavigationList
                normalizedPathname="/"
                session={{ user: { email: 'regular@test.com' } }}
                status="authenticated"
                dictionary={mockDictionary}
            />,
        );
        expect(
            screen.queryByRole('link', { name: 'Moderation' }),
        ).not.toBeInTheDocument();
    });
});
