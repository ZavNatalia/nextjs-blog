import { Inter } from 'next/font/google';
import './globals.css';
import RootClientLayout from '@/components/ui/RootClientLayout';
import { ReactNode } from 'react';
import { i18n, type Locale } from '@/i18n-config';
import { getDictionary } from '@/get-dictionary';
import { TranslationProvider } from '@/hooks/useDictionary';
const inter = Inter({ subsets: ['latin'] });

export const metadata = ({ params }: { params: any }) => {
    const lang = params?.lang || "en";
    const manifestPath = `/${lang}/manifest.webmanifest`;

    return {
        title: {
            template: "%s | Natalia's Next blog",
            default: "Natalia's Next blog",
        },
        description: lang === 'ru'
            ? 'Я пишу о программировании и веб-разработке.'
            : 'I post about programming and web development.',
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
    };
};


export async function generateStaticParams() {
    return i18n.locales.map((locale) => ({ lang: locale }));
}

export default async function RootLayout(props: {
    children: ReactNode;
    params: Promise<{ lang: Locale }>;
}) {
    const params = await props.params;
    const dictionary = getDictionary(params.lang);
    const { children } = props;

    return (
        <html lang={params.lang}>
        <body className={inter.className}>
        <TranslationProvider dictionary={dictionary}>
            <RootClientLayout>
                {children}
            </RootClientLayout>
            <div id="notifications" />
        </TranslationProvider>
        </body>
        </html>
    );
}
