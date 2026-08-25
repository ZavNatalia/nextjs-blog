import { ThemeProvider } from 'next-themes';

import RootClientLayout from '@/components/ui/RootClientLayout';
import type { Dictionary } from '@/hooks/useDictionary';
import { TranslationProvider } from '@/hooks/useDictionary';
import type { Locale } from '@/i18n-config';

export function Providers({
    dictionary,
    locale,
    children,
}: {
    dictionary: Dictionary;
    locale: Locale;
    children: React.ReactNode;
}) {
    return (
        <ThemeProvider attribute="class">
            <TranslationProvider dictionary={dictionary} locale={locale}>
                <RootClientLayout>{children}</RootClientLayout>
            </TranslationProvider>
        </ThemeProvider>
    );
}
