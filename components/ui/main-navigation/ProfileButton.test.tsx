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

import ProfileButton from './ProfileButton';

describe('ProfileButton', () => {
    it('renders link to profile page', () => {
        render(<ProfileButton title="Profile" normalizedPathname="/posts" />);
        const link = screen.getByRole('link', { name: 'Profile' });
        expect(link).toHaveAttribute('href', '/profile');
    });

    it('renders name initial when name is provided', () => {
        render(
            <ProfileButton
                title="Profile"
                normalizedPathname="/posts"
                userName="Alice"
                userEmail="alice@test.com"
            />,
        );
        expect(screen.getByText('A')).toBeInTheDocument();
    });

    it('renders email initial when no name', () => {
        render(
            <ProfileButton
                title="Profile"
                normalizedPathname="/posts"
                userEmail="user@test.com"
            />,
        );
        expect(screen.getByText('U')).toBeInTheDocument();
    });

    it('calls onClick when clicked', async () => {
        const { default: userEvent } =
            await import('@testing-library/user-event');
        const onClick = vi.fn();
        render(
            <ProfileButton
                title="Profile"
                normalizedPathname="/posts"
                onClick={onClick}
            />,
        );
        await userEvent.click(screen.getByRole('link'));
        expect(onClick).toHaveBeenCalledOnce();
    });
});
