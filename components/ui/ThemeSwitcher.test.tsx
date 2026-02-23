import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

const mockSetTheme = vi.fn();

vi.mock('next-themes', () => ({
    useTheme: () => ({
        theme: 'light',
        setTheme: mockSetTheme,
    }),
}));

vi.mock('@/hooks/useDictionary', () => ({
    useDictionary: () => ({
        navigation: {
            switchToDarkTheme: 'Switch to dark theme',
            switchToLightTheme: 'Switch to light theme',
        },
    }),
}));

import ThemeSwitcher from './ThemeSwitcher';

beforeEach(() => {
    vi.clearAllMocks();
});

describe('ThemeSwitcher', () => {
    it('renders button after mounting', async () => {
        await act(async () => {
            render(<ThemeSwitcher />);
        });
        expect(
            screen.getByRole('button', { name: 'Switch to dark theme' }),
        ).toBeInTheDocument();
    });

    it('calls setTheme on click', async () => {
        await act(async () => {
            render(<ThemeSwitcher />);
        });
        await userEvent.click(screen.getByRole('button'));
        expect(mockSetTheme).toHaveBeenCalledWith('dark');
    });
});
