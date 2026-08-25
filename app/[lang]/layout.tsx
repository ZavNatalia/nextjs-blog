import './globals.css';

import localFont from 'next/font/local';
import { ReactNode } from 'react';

import { getDictionary } from '@/get-dictionary';
import { i18n, type Locale } from '@/i18n-config';

import { Providers } from './providers';

const openSans = localFont({
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
    params: Promise<{ lang: string }>;
}) {
    const { lang } = await props.params;
    const manifestPath = `/${lang}/manifest.webmanifest`;
    const dictionary = getDictionary(lang as Locale)['common'];

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
                // The locale-less URL picks a language from the request, which
                // is what x-default is meant to point at.
                'x-default': baseUrl,
            },
        },
    };
}

// Without this, an unknown first segment (e.g. a path excluded from the proxy
// matcher) reaches this layout as `lang` and blows up in the data layer with a
// 500 instead of rendering a 404.
export const dynamicParams = false;

export async function generateStaticParams() {
    return i18n.locales.map((locale) => ({ lang: locale }));
}

export default async function RootLayout(props: {
    children: ReactNode;
    params: Promise<{ lang: string }>;
}) {
    const params = await props.params;
    const locale = params.lang as Locale;
    const dictionary = getDictionary(locale);

    return (
        <html suppressHydrationWarning lang={locale}>
            <body className={openSans.className}>
                <Providers dictionary={dictionary} locale={locale}>
                    {props.children}
                </Providers>
            </body>
        </html>
    );
}
