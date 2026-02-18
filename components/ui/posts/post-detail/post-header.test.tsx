import { render, screen } from '@testing-library/react';

vi.mock('next/image', () => ({
    default: ({
        alt,
        onLoad,
        ...props
    }: {
        alt: string;
        onLoad?: () => void;
        [key: string]: unknown;
    }) => <img alt={alt} {...props} onLoad={onLoad} />,
}));

import PostHeader from './post-header';

describe('PostHeader', () => {
    it('renders title', () => {
        render(
            <PostHeader
                title="My Post Title"
                date="2025-03-15"
                imagePath="/images/posts/test/cover.png"
            />,
        );
        expect(screen.getByText('My Post Title')).toBeInTheDocument();
    });

    it('renders formatted date', () => {
        render(
            <PostHeader
                title="My Post Title"
                date="2025-03-15"
                imagePath="/images/posts/test/cover.png"
            />,
        );
        expect(screen.getByText(/March 15, 2025/)).toBeInTheDocument();
    });

    it('renders image with alt text', () => {
        render(
            <PostHeader
                title="My Post Title"
                date="2025-03-15"
                imagePath="/images/posts/test/cover.png"
            />,
        );
        expect(screen.getByAltText('My Post Title')).toBeInTheDocument();
    });

    it('shows loading skeleton initially', () => {
        const { container } = render(
            <PostHeader
                title="My Post Title"
                date="2025-03-15"
                imagePath="/images/posts/test/cover.png"
            />,
        );
        expect(container.querySelector('.square-skeleton')).toBeInTheDocument();
    });
});
