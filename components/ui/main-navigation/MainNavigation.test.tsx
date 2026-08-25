import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

vi.mock('next/navigation', () => ({
    usePathname: () => '/en/posts',
    useRouter: () => ({ push: vi.fn(), refresh: vi.fn() }),
}));

vi.mock('next-auth/react', () => ({
    useSession: () => ({
        data: null,
        status: 'unauthenticated',
    }),
}));

vi.mock('@/hooks/useDictionary', () => ({
    useDictionary: () => ({
        common: {
            blogTitle: 'The Workshop',
        },
        navigation: {
            home: 'Home',
            posts: 'Posts',
            contact: 'Contact',
            auth: 'Sign In',
            userProfile: 'Profile',
            moderation: 'Moderation',
            openMenu: 'Open menu',
            closeMenu: 'Close menu',
            switchToEn: 'English',
            switchToRu: 'Russian',
            switchToDarkTheme: 'Dark theme',
            switchToLightTheme: 'Light theme',
        },
    }),
    useLocale: () => 'en',
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

vi.mock('next-themes', () => ({
    useTheme: () => ({ theme: 'dark', setTheme: vi.fn() }),
}));

import MainNavigation from './MainNavigation';

describe('MainNavigation', () => {
    it('renders logo and navigation links', () => {
        render(<MainNavigation />);
        expect(screen.getByText('The Workshop')).toBeInTheDocument();
        expect(screen.getAllByText('Posts').length).toBeGreaterThan(0);
        expect(screen.getAllByText('Contact').length).toBeGreaterThan(0);
    });

    it('renders mobile menu button', () => {
        render(<MainNavigation />);
        expect(
            screen.getByRole('button', { name: 'Open menu' }),
        ).toBeInTheDocument();
    });

    it('opens mobile menu on button click', async () => {
        render(<MainNavigation />);
        await userEvent.click(
            screen.getByRole('button', { name: 'Open menu' }),
        );
        expect(
            screen.getByRole('button', { name: 'Close menu' }),
        ).toBeInTheDocument();
    });

    it('prefixes navigation links with the active locale', () => {
        render(<MainNavigation />);
        const postsLinks = screen.getAllByRole('link', { name: 'Posts' });
        postsLinks.forEach((link) =>
            expect(link).toHaveAttribute('href', '/en/posts'),
        );
    });
});
