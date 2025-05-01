import './globals.css';
import { ReactNode } from 'react';
import { i18n, type Locale } from '@/i18n-config';
import { getDictionary } from '@/get-dictionary';
import { getServerSession } from 'next-auth';
import { Providers } from './providers';

import localFont from 'next/font/local';

export const openSans = localFont({
    src: [
        {
            path: '../../public/fonts/Open_Sans/static/OpenSans-Regular.ttf',
            weight: '400',
            style: 'normal',
        },
        {
            path: '../../public/fonts/Open_Sans/static/OpenSans-Bold.ttf',
            weight: '700',
            style: 'normal',
        },
        {
            path: '../../public/fonts/Open_Sans/static/OpenSans-Medium.ttf',
            weight: '500',
            style: 'medium',
        },
        {
            path: '../../public/fonts/Open_Sans/static/OpenSans-Italic.ttf',
            weight: '400',
            style: 'italic',
        },
    ],
    variable: '--font-open-sans',
});

export async function generateMetadata(props: {
    params: Promise<{ lang: Locale }>;
}) {
    const { lang } = await props.params;
    const manifestPath = `/${lang}/manifest.webmanifest`;
    const dictionary = await getDictionary(lang)?.['common'];

    const baseUrl = 'https://zav.me';

    return {
        title: {
            template: `%s | ${dictionary.blogTitle}`,
            default: dictionary.blogTitle,
        },
        description: dictionary.blogDescription,
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
        manifest: manifestPath,
        alternates: {
            canonical: `${baseUrl}/${lang}`,
            languages: {
                en: `${baseUrl}/en`,
                ru: `${baseUrl}/ru`,
            },
        },
    };
}

export async function generateStaticParams() {
    return i18n.locales.map((locale) => ({ lang: locale }));
}

export default async function RootLayout(props: {
    children: ReactNode;
    params: Promise<{ lang: Locale }>;
}) {
    const params = await props.params;
    const dictionary = await getDictionary(params.lang);
    const session = await getServerSession();

    return (
        <html suppressHydrationWarning lang={params.lang}>
            <body className={openSans.className}>
                <Providers dictionary={dictionary} session={session}>
                    {props.children}
                </Providers>
            </body>
        </html>
    );
}
