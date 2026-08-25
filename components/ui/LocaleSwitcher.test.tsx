import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

const mockAssign = vi.fn();

vi.mock('next/navigation', () => ({
    usePathname: () => '/en/posts',
}));

vi.mock('@/hooks/useDictionary', () => ({
    useDictionary: () => ({
        navigation: {
            switchToEn: 'Switch to English',
            switchToRu: 'Switch to Russian',
        },
    }),
}));

import LocaleSwitcher from './LocaleSwitcher';

beforeEach(() => {
    vi.clearAllMocks();
    Object.defineProperty(window, 'location', {
        configurable: true,
        value: { assign: mockAssign },
    });
});

describe('LocaleSwitcher', () => {
    it('renders buttons for all locales', () => {
        render(<LocaleSwitcher />);
        expect(screen.getByText('EN')).toBeInTheDocument();
        expect(screen.getByText('RU')).toBeInTheDocument();
    });

    it('highlights active locale', () => {
        render(<LocaleSwitcher />);
        const enButton = screen.getByText('EN');
        expect(enButton).toHaveClass('text-accent');
    });

    it('switches locale with a full document navigation', async () => {
        render(<LocaleSwitcher />);
        await userEvent.click(
            screen.getByRole('button', { name: 'Switch to Russian' }),
        );
        expect(mockAssign).toHaveBeenCalledWith('/ru/posts');
    });
});
