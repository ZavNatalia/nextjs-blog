import { render, screen } from '@testing-library/react';

import PostHeader from './post-header';

describe('PostHeader', () => {
    it('renders title', () => {
        render(<PostHeader title="My Post Title" date="2025-03-15" />);
        expect(screen.getByText('My Post Title')).toBeInTheDocument();
    });

    it('renders formatted date', () => {
        render(<PostHeader title="My Post Title" date="2025-03-15" />);
        expect(screen.getByText(/March 15, 2025/)).toBeInTheDocument();
    });

    it('renders reading time when provided', () => {
        render(
            <PostHeader
                title="My Post Title"
                date="2025-03-15"
                readingTime={5}
                readingTimeLabel="min read"
            />,
        );
        expect(screen.getByText(/· 5 min read/)).toBeInTheDocument();
    });

    it('does not render reading time when not provided', () => {
        render(<PostHeader title="My Post Title" date="2025-03-15" />);
        expect(screen.queryByText(/min read/)).not.toBeInTheDocument();
    });
});
