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
    usePathname: () => '/en/posts',
}));

import Breadcrumbs from './Breadcrumbs';

const breadcrumbs = [
    { link: '/', title: 'Home' },
    { link: '/posts', title: 'Posts' },
];

describe('Breadcrumbs', () => {
    it('renders all breadcrumb links', () => {
        render(<Breadcrumbs breadcrumbs={breadcrumbs} />);
        expect(screen.getByText('home')).toBeInTheDocument();
        expect(screen.getByText('posts')).toBeInTheDocument();
    });

    it('renders separator between items', () => {
        render(<Breadcrumbs breadcrumbs={breadcrumbs} />);
        expect(screen.getByText('/')).toBeInTheDocument();
    });

    it('highlights active breadcrumb', () => {
        render(<Breadcrumbs breadcrumbs={breadcrumbs} />);
        const postsLink = screen.getByText('posts').closest('a');
        expect(postsLink).toHaveClass('text-accent');
    });

    it('does not show separator after last item', () => {
        render(<Breadcrumbs breadcrumbs={breadcrumbs} />);
        const separators = screen.getAllByText('/');
        expect(separators).toHaveLength(1);
    });
});
