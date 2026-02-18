import { render, screen } from '@testing-library/react';

import NewsItemHeader from './news-item-header';

describe('NewsItemHeader', () => {
    it('renders title', () => {
        render(
            <NewsItemHeader
                title="Test News"
                date="2025-06-15"
                imagePath="/images/test.png"
                lang="en"
            />,
        );
        expect(screen.getByText('Test News')).toBeInTheDocument();
    });

    it('renders formatted date in English', () => {
        render(
            <NewsItemHeader
                title="Test News"
                date="2025-06-15"
                imagePath="/images/test.png"
                lang="en"
            />,
        );
        expect(screen.getByText(/June 15, 2025/)).toBeInTheDocument();
    });

    it('renders formatted date in Russian', () => {
        render(
            <NewsItemHeader
                title="Тестовая новость"
                date="2025-06-15"
                imagePath="/images/test.png"
                lang="ru"
            />,
        );
        expect(screen.getByText(/15 июня 2025/)).toBeInTheDocument();
    });
});
