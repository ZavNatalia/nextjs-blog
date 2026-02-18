import { render } from '@testing-library/react';

import { PostCardSkeleton } from './post-card-skeleton';

describe('PostCardSkeleton', () => {
    it('renders skeleton with pulse animation', () => {
        const { container } = render(<PostCardSkeleton />);
        expect(container.querySelector('.animate-pulse')).toBeInTheDocument();
    });

    it('renders as a list item', () => {
        const { container } = render(<PostCardSkeleton />);
        expect(container.querySelector('li')).toBeInTheDocument();
    });
});
