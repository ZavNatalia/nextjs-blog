'use client';
import { ReactNode } from 'react';
import MainNavigation from '@/components/ui/main-navigation/MainNavigation';
import CookieConsent from '@/components/ui/CookieConsent';
import { SessionProvider } from 'next-auth/react';
import { Session } from 'next-auth';
import Footer from '@/components/ui/Footer';

export default function RootClientLayout({
    children,
    session,
}: {
    children: ReactNode;
    session: Session | null;
}) {
    return (
        <SessionProvider session={session}>
            <div className="flex min-h-screen flex-col">
                <MainNavigation />
                {children}
                <CookieConsent />
                <Footer />
                <div id="notifications" />
            </div>
        </SessionProvider>
    );
}
