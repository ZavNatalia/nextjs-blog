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

import Logo from './Logo';

describe('Logo', () => {
    it('renders link to home page', () => {
        render(<Logo title="Home" />);
        const link = screen.getByRole('link', { name: 'Home' });
        expect(link).toHaveAttribute('href', '/');
    });

    it('renders site name', () => {
        render(<Logo title="Home" />);
        expect(screen.getByText('Next.js Craft')).toBeInTheDocument();
    });
});
