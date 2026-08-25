'use client';

import { createContext, ReactNode, useContext } from 'react';

import type { Dictionary } from '@/get-dictionary';
import type { Locale } from '@/i18n-config';
export type { Dictionary };

interface TranslationContextValue {
    dictionary: Dictionary;
    locale: Locale;
}

const UseDictionary = createContext<TranslationContextValue | null>(null);

export const TranslationProvider = ({
    children,
    dictionary,
    locale,
}: {
    children: ReactNode;
    dictionary: Dictionary;
    locale: Locale;
}) => {
    return (
        <UseDictionary.Provider value={{ dictionary, locale }}>
            {children}
        </UseDictionary.Provider>
    );
};

export const useDictionary = () => {
    const context = useContext(UseDictionary);
    if (!context) {
        throw new Error(
            'useDictionary must be used within a TranslationProvider',
        );
    }
    return context.dictionary;
};

export const useLocale = () => {
    const context = useContext(UseDictionary);
    if (!context) {
        throw new Error('useLocale must be used within a TranslationProvider');
    }
    return context.locale;
};
