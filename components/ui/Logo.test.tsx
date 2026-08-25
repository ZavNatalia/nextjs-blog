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
            blogTitle: 'The Workshop',
        },
    }),
    useLocale: () => 'ru',
}));

import Logo from './Logo';

describe('Logo', () => {
    it('renders link to the localized home page', () => {
        render(<Logo title="Home" />);
        const link = screen.getByRole('link', { name: 'Home' });
        expect(link).toHaveAttribute('href', '/ru');
    });

    it('renders site name', () => {
        render(<Logo title="Home" />);
        expect(screen.getByText('The Workshop')).toBeInTheDocument();
    });
});
