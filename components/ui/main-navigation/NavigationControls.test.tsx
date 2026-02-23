import { render, screen } from '@testing-library/react';

vi.mock('@/components/ui/LocaleSwitcher', () => ({
    default: () => <div data-testid="locale-switcher" />,
}));

vi.mock('@/components/ui/ThemeSwitcher', () => ({
    default: () => <div data-testid="theme-switcher" />,
}));

import { NavigationControls } from './NavigationControls';

describe('NavigationControls', () => {
    it('renders locale and theme switchers', () => {
        render(<NavigationControls />);
        expect(screen.getByTestId('locale-switcher')).toBeInTheDocument();
        expect(screen.getByTestId('theme-switcher')).toBeInTheDocument();
    });

    it('applies mobile styles when isMobile is true', () => {
        const { container } = render(<NavigationControls isMobile />);
        expect(container.firstChild).toHaveClass('flex-col');
    });

    it('applies desktop styles when isMobile is false', () => {
        const { container } = render(<NavigationControls isMobile={false} />);
        expect(container.firstChild).toHaveClass('ml-3');
    });
});
