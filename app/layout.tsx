import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import MainNavigation from '@/components/ui/main-navigation';
import { ReactNode } from 'react';

// The viewport meta tag is automatically set,
// and manual configuration is usually unnecessary as the default is sufficient.
// export const viewport: Viewport = {
//     width: 'device-width',
//     initialScale: 1,
//     maximumScale: 1,
//     userScalable: false,
// }

const inter = Inter({subsets: ["latin"]});

export const metadata: Metadata = {
    title: {
        template: '%s | Natalia\'s blog',
        default: "Natalia's blog",
    },
    description: "I post about programming and web development.",
};

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: ReactNode;
}>) {
    return (
        <html lang="en">
        <body className={inter.className}>
        <div className="flex flex-col min-h-screen">
            <MainNavigation/>
            {children}
        </div>
        <div id='notifications'></div>
        </body>
        </html>
    );
}
