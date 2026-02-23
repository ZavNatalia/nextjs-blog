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

vi.mock('next/navigation', () => ({
    useParams: () => ({ lang: 'en' }),
}));

vi.mock('@/hooks/useDictionary', () => ({
    useDictionary: () => ({
        'not-found': {
            notFound: 'Page not found',
            weCouldNotFindPage: 'The page you are looking for does not exist.',
            returnHome: 'Return Home',
        },
    }),
}));

import NotFoundCard from './NotFoundCard';

describe('NotFoundCard', () => {
    it('renders 404 heading', () => {
        render(<NotFoundCard />);
        expect(screen.getByText('404')).toBeInTheDocument();
    });

    it('renders not found message', () => {
        render(<NotFoundCard />);
        expect(screen.getByText('Page not found')).toBeInTheDocument();
    });

    it('renders return home link with locale', () => {
        render(<NotFoundCard />);
        const link = screen.getByRole('link', { name: 'Return Home' });
        expect(link).toHaveAttribute('href', '/en');
    });
});
