'use client';
import { ReactNode } from 'react';
import { SessionProvider } from "next-auth/react";
import MainNavigation from '@/components/ui/main-navigation';

export default function RootClientLayout({ children }: { children: ReactNode }) {
    return (
        <SessionProvider>
            <div className="flex min-h-screen flex-col">
                <MainNavigation />
                {children}
            </div>
        </SessionProvider>
    );
}
