import { renderHook } from '@testing-library/react';

import type { Dictionary } from './useDictionary';
import { TranslationProvider, useDictionary } from './useDictionary';

const mockDictionary = {
    home: { title: 'Home' },
} as unknown as Dictionary;

describe('useDictionary', () => {
    it('returns dictionary from TranslationProvider', () => {
        const wrapper = ({ children }: { children: React.ReactNode }) => (
            <TranslationProvider dictionary={mockDictionary}>{children}</TranslationProvider>
        );

        const { result } = renderHook(() => useDictionary(), { wrapper });
        expect(result.current).toBe(mockDictionary);
    });

    it('throws error when used outside TranslationProvider', () => {
        expect(() => {
            renderHook(() => useDictionary());
        }).toThrow('useDictionary must be used within a TranslationProvider');
    });
});
