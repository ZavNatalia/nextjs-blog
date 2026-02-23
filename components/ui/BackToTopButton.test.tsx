import { act, fireEvent, render, screen } from '@testing-library/react';

vi.mock('@/hooks/useDictionary', () => ({
    useDictionary: () => ({
        common: {
            backToTop: 'Back to top',
        },
    }),
}));

import BackToTopButton from './BackToTopButton';

describe('BackToTopButton', () => {
    it('is hidden when scroll is below threshold', () => {
        render(<BackToTopButton threshold={600} />);
        expect(screen.queryByTitle('Back to top')).not.toBeInTheDocument();
    });

    it('appears when scroll exceeds threshold', () => {
        render(<BackToTopButton threshold={100} />);

        act(() => {
            Object.defineProperty(window, 'scrollY', { value: 200, writable: true });
            fireEvent.scroll(window);
        });

        expect(screen.getByTitle('Back to top')).toBeInTheDocument();
    });

    it('scrolls to top on click', async () => {
        const scrollToSpy = vi.spyOn(window, 'scrollTo').mockImplementation(() => {});
        render(<BackToTopButton threshold={100} />);

        act(() => {
            Object.defineProperty(window, 'scrollY', { value: 200, writable: true });
            fireEvent.scroll(window);
        });

        const { default: userEvent } = await import('@testing-library/user-event');
        await userEvent.click(screen.getByTitle('Back to top'));
        expect(scrollToSpy).toHaveBeenCalledWith({ top: 0, behavior: 'smooth' });

        scrollToSpy.mockRestore();
    });
});
