import { renderHook } from '@testing-library/react';

import type { Dictionary } from './useDictionary';
import { TranslationProvider, useDictionary, useLocale } from './useDictionary';

const mockDictionary = {
    home: { title: 'Home' },
} as unknown as Dictionary;

const wrapper = ({ children }: { children: React.ReactNode }) => (
    <TranslationProvider dictionary={mockDictionary} locale="ru">
        {children}
    </TranslationProvider>
);

describe('useDictionary', () => {
    it('returns dictionary from TranslationProvider', () => {
        const { result } = renderHook(() => useDictionary(), { wrapper });
        expect(result.current).toBe(mockDictionary);
    });

    it('throws error when used outside TranslationProvider', () => {
        expect(() => {
            renderHook(() => useDictionary());
        }).toThrow('useDictionary must be used within a TranslationProvider');
    });
});

describe('useLocale', () => {
    it('returns locale from TranslationProvider', () => {
        const { result } = renderHook(() => useLocale(), { wrapper });
        expect(result.current).toBe('ru');
    });

    it('throws error when used outside TranslationProvider', () => {
        expect(() => {
            renderHook(() => useLocale());
        }).toThrow('useLocale must be used within a TranslationProvider');
    });
});
