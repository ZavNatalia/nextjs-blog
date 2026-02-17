'use client';

import { createContext, ReactNode, useContext } from 'react';

import type { Dictionary } from '@/get-dictionary';
export type { Dictionary };

const UseDictionary = createContext<Dictionary | null>(null);

export const TranslationProvider = ({
    children,
    dictionary,
}: {
    children: ReactNode;
    dictionary: Dictionary;
}) => {
    return (
        <UseDictionary.Provider value={dictionary}>
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
    return context;
};
