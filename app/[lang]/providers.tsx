import { Session } from 'next-auth';
import { ThemeProvider } from 'next-themes';

import RootClientLayout from '@/components/ui/RootClientLayout';
import type { Dictionary } from '@/hooks/useDictionary';
import { TranslationProvider } from '@/hooks/useDictionary';

export function Providers({
    dictionary,
    session,
    children,
}: {
    dictionary: Dictionary;
    session: Session | null;
    children: React.ReactNode;
}) {
    return (
        <ThemeProvider attribute="class">
            <TranslationProvider dictionary={dictionary}>
                <RootClientLayout session={session}>
                    {children}
                </RootClientLayout>
            </TranslationProvider>
        </ThemeProvider>
    );
}
