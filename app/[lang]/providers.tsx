import { TranslationProvider } from '@/hooks/useDictionary';
import RootClientLayout from '@/components/ui/RootClientLayout';
import { ThemeProvider } from 'next-themes';
import { Session } from 'next-auth';

export function Providers({
    dictionary,
    session,
    children,
}: {
    dictionary: Record<string, any>;
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
