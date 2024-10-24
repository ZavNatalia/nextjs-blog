import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import MainNavigation from '@/components/ui/main-navigation';
import { ReactNode } from 'react';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
    title: {
        template: "%s | Natalia's blog",
        default: "Natalia's blog",
    },
    description: 'I post about programming and web development.',
};

export default function RootLayout({
    children,
}: Readonly<{
    children: ReactNode;
}>) {
    return (
        <html lang="ru">
            <body className={inter.className}>
                <div className="flex min-h-screen flex-col">
                    <MainNavigation />
                    {children}
                </div>
                <div id="notifications"></div>
            </body>
        </html>
    );
}
