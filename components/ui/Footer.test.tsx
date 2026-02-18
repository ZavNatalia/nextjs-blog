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

vi.mock('@/hooks/useDictionary', () => ({
    useDictionary: () => ({
        common: {
            githubAccount: 'GitHub profile',
        },
    }),
}));

import Footer from './Footer';

describe('Footer', () => {
    it('renders copyright with current year', () => {
        render(<Footer />);
        const year = new Date().getFullYear();
        expect(screen.getByText(new RegExp(`© ${year}`))).toBeInTheDocument();
    });

    it('renders GitHub link with aria-label', () => {
        render(<Footer />);
        const link = screen.getByRole('link', { name: 'GitHub profile' });
        expect(link).toHaveAttribute('href', 'https://github.com/ZavNatalia');
        expect(link).toHaveAttribute('target', '_blank');
    });
});
