'use client';
import { ReactNode } from 'react';
import { SessionProvider } from 'next-auth/react';
import MainNavigation from '@/components/ui/MainNavigation';
import CookieConsent from '@/components/ui/CookieConsent';
import Footer from '@/components/ui/Footer';

export default function RootClientLayout({ children }: { children: ReactNode }) {
    return (
        <SessionProvider>
            <div className="flex min-h-screen flex-col">
                <MainNavigation />
                {children}
                <CookieConsent />
                <Footer/>
            </div>
        </SessionProvider>
    );
}
