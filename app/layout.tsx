import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import MainNavigation from '@/components/ui/main-navigation';
import { ReactNode } from 'react';
import Head from 'next/head';

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
            <Head>
                <link rel="icon" href="/favicon.ico" />

                <link
                    rel="apple-touch-icon"
                    sizes="180x180"
                    href="/icons/apple-touch-icon.png"
                />

                <link
                    rel="icon"
                    type="image/png"
                    sizes="36x36"
                    href="/icons/android-icon-36x36.png"
                />
                <link
                    rel="icon"
                    type="image/png"
                    sizes="48x48"
                    href="/icons/android-icon-48x48.png"
                />
                <link
                    rel="icon"
                    type="image/png"
                    sizes="72x72"
                    href="/icons/android-icon-72x72.png"
                />
                <link
                    rel="icon"
                    type="image/png"
                    sizes="96x96"
                    href="/icons/android-icon-96x96.png"
                />
                <link
                    rel="icon"
                    type="image/png"
                    sizes="192x192"
                    href="/icons/android-icon-192x192.png"
                />

                <link
                    rel="icon"
                    type="image/png"
                    sizes="32x32"
                    href="/icons/favicon-32x32.png"
                />
                <link
                    rel="icon"
                    type="image/png"
                    sizes="16x16"
                    href="/icons/favicon-16x16.png"
                />

                <link rel="manifest" href="/app/manifest.webmanifest" />
            </Head>
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
