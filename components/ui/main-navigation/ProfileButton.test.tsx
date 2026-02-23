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

import ProfileButton from './ProfileButton';

describe('ProfileButton', () => {
    it('renders link to profile page', () => {
        render(
            <ProfileButton title="Profile" normalizedPathname="/posts" />,
        );
        const link = screen.getByRole('link', { name: 'Profile' });
        expect(link).toHaveAttribute('href', '/profile');
    });

    it('renders avatar image', () => {
        render(
            <ProfileButton title="Profile" normalizedPathname="/posts" />,
        );
        expect(screen.getByAltText('User avatar')).toBeInTheDocument();
    });

    it('calls onClick when clicked', async () => {
        const { default: userEvent } = await import('@testing-library/user-event');
        const onClick = vi.fn();
        render(
            <ProfileButton title="Profile" normalizedPathname="/posts" onClick={onClick} />,
        );
        await userEvent.click(screen.getByRole('link'));
        expect(onClick).toHaveBeenCalledOnce();
    });
});
