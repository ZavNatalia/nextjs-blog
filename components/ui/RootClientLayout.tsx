'use client';
import { SessionProvider } from 'next-auth/react';
import { ReactNode } from 'react';

import CookieConsent from '@/components/ui/CookieConsent';
import Footer from '@/components/ui/Footer';
import MainNavigation from '@/components/ui/main-navigation/MainNavigation';

export default function RootClientLayout({
    children,
}: {
    children: ReactNode;
}) {
    return (
        <SessionProvider>
            <div className="relative flex min-h-screen flex-col">
                <MainNavigation />
                {children}
                <CookieConsent />
                <Footer />
                <div id="notifications" />
            </div>
        </SessionProvider>
    );
}
