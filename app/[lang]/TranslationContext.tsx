'use client';

import { createContext, ReactNode, useContext } from 'react';

export type Dictionary = Record<string, any>;

const TranslationContext = createContext<Dictionary | null>(null);

export const TranslationProvider = ({
                                        children,
                                        dictionary,
                                    }: {
    children: ReactNode;
    dictionary: Dictionary;
}) => {
    return (
        <TranslationContext.Provider value={dictionary}>
            {children}
        </TranslationContext.Provider>
    );
};

export const useDictionary = () => {
    const context = useContext(TranslationContext);
    if (!context) {
        throw new Error('useDictionary must be used within a TranslationProvider');
    }
    return context;
};
