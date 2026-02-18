import { render } from '@testing-library/react';

import PostsGridSkeleton from './posts-grid-skeleton';

describe('PostsGridSkeleton', () => {
    it('renders default 4 skeleton cards', () => {
        const { container } = render(<PostsGridSkeleton />);
        const items = container.querySelectorAll('li');
        expect(items).toHaveLength(4);
    });

    it('renders custom count of skeleton cards', () => {
        const { container } = render(<PostsGridSkeleton count={2} />);
        const items = container.querySelectorAll('li');
        expect(items).toHaveLength(2);
    });
});
