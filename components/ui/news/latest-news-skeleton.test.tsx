import { render } from '@testing-library/react';

import LatestNewsSkeleton from './latest-news-skeleton';

describe('LatestNewsSkeleton', () => {
    it('renders default 2 skeleton items', () => {
        const { container } = render(<LatestNewsSkeleton />);
        const items = container.querySelectorAll('li');
        expect(items).toHaveLength(2);
    });

    it('renders custom number of skeleton items', () => {
        const { container } = render(<LatestNewsSkeleton count={3} />);
        const items = container.querySelectorAll('li');
        expect(items).toHaveLength(3);
    });

    it('wraps in article with card class', () => {
        const { container } = render(<LatestNewsSkeleton />);
        const article = container.querySelector('article');
        expect(article).toBeInTheDocument();
        expect(article).toHaveClass('card');
    });
});
