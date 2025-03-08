'use client';
import { ReactNode } from 'react';
import { SessionProvider } from 'next-auth/react';
import MainNavigation from '@/components/ui/main-navigation/MainNavigation';
import CookieConsent from '@/components/ui/CookieConsent';

export default function RootClientLayout({
    children,
}: {
    children: ReactNode;
}) {
    return (
        <SessionProvider
            refetchOnWindowFocus={false}
            refetchInterval={0}
            refetchWhenOffline={false}
        >
            <div className="flex min-h-screen flex-col">
                <MainNavigation />
                {children}
                <CookieConsent />
            </div>
        </SessionProvider>
    );
}
