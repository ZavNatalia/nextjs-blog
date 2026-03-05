import { ThemeProvider } from 'next-themes';

import RootClientLayout from '@/components/ui/RootClientLayout';
import type { Dictionary } from '@/hooks/useDictionary';
import { TranslationProvider } from '@/hooks/useDictionary';

export function Providers({
    dictionary,
    children,
}: {
    dictionary: Dictionary;
    children: React.ReactNode;
}) {
    return (
        <ThemeProvider attribute="class">
            <TranslationProvider dictionary={dictionary}>
                <RootClientLayout>
                    {children}
                </RootClientLayout>
            </TranslationProvider>
        </ThemeProvider>
    );
}
