import { renderHook, act } from '@testing-library/react';
import { useTheme } from './useTheme';

beforeEach(() => {
    localStorage.clear();
    document.documentElement.classList.remove('dark', 'light');
});

describe('useTheme', () => {
    it('defaults to dark theme', () => {
        const { result } = renderHook(() => useTheme());
        expect(result.current.theme).toBe('dark');
    });

    it('toggleTheme switches dark to light', () => {
        const { result } = renderHook(() => useTheme());

        act(() => {
            result.current.toggleTheme();
        });

        expect(result.current.theme).toBe('light');
        expect(document.documentElement.classList.contains('dark')).toBe(false);
    });

    it('toggleTheme switches light back to dark', () => {
        const { result } = renderHook(() => useTheme());

        act(() => {
            result.current.toggleTheme();
        });
        act(() => {
            result.current.toggleTheme();
        });

        expect(result.current.theme).toBe('dark');
        expect(document.documentElement.classList.contains('dark')).toBe(true);
    });

    it('persists theme to localStorage', () => {
        const { result } = renderHook(() => useTheme());

        act(() => {
            result.current.toggleTheme();
        });

        expect(localStorage.getItem('theme')).toBe('light');
    });

    it('reads stored theme from localStorage', () => {
        localStorage.setItem('theme', 'light');
        const { result } = renderHook(() => useTheme());
        expect(result.current.theme).toBe('light');
    });
});
