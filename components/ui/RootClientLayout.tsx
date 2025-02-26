'use client';
import { ReactNode } from 'react';
import { SessionProvider } from 'next-auth/react';
import MainNavigation from '@/components/ui/MainNavigation';
import CookieConsent from '@/components/ui/CookieConsent';
import Footer from '@/components/ui/Footer';
import { TranslationProvider } from '@/hooks/useDictionary';

export default function RootClientLayout({
                                             dictionary,
                                             children,
                                         }: {
    dictionary: Record<string, any>,
    children: ReactNode
}) {
    return (
        <SessionProvider refetchOnWindowFocus={false}
                         refetchInterval={0}
                         refetchWhenOffline={false}>
            <TranslationProvider dictionary={dictionary}>
                <div className="flex min-h-screen flex-col">
                    <MainNavigation />
                    {children}
                    <CookieConsent />
                    <Footer />
                    <div id="notifications" />
                </div>
            </TranslationProvider>
        </SessionProvider>
    );
}
