import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

const mockPush = vi.fn();
const mockRefresh = vi.fn();

vi.mock('next/navigation', () => ({
    useRouter: () => ({
        push: mockPush,
        refresh: mockRefresh,
    }),
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
        expect(enButton).toHaveClass('bg-background-tertiary');
    });

    it('switches locale on click', async () => {
        render(<LocaleSwitcher />);
        await userEvent.click(
            screen.getByRole('button', { name: 'Switch to Russian' }),
        );
        expect(mockPush).toHaveBeenCalledWith('/ru/posts');
        expect(mockRefresh).toHaveBeenCalled();
    });
});
