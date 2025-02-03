import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import RootClientLayout from '@/components/ui/RootClientLayout';
import { ReactNode } from 'react';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
    title: {
        template: "%s | Natalia's blog",
        default: "Natalia's blog",
    },
    description: 'I post about programming and web development.',
    icons: {
        icon: [
            '/favicon.ico',
            {
                url: '/icons/favicon-16x16.png',
                sizes: '16x16',
                type: 'image/png',
            },
            {
                url: '/icons/favicon-32x32.png',
                sizes: '32x32',
                type: 'image/png',
            },
            {
                url: '/icons/android-icon-192x192.png',
                sizes: '192x192',
                type: 'image/png',
            },
        ],
        apple: '/icons/apple-touch-icon.png',
    },
    manifest: '/manifest.webmanifest',
};

export default function RootLayout({ children }: { children: ReactNode }) {
    return (
        <html lang="ru">
        <body className={inter.className}>
        <RootClientLayout>
            {children}
        </RootClientLayout>
        <div id="notifications"></div>
        </body>
        </html>
    );
}
