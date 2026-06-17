'use client';

import { usePathname, useRouter } from 'next/navigation';

import { useDictionary } from '@/hooks/useDictionary';
import { i18n } from '@/i18n-config';

const locales: string[] = [...i18n.locales];

export default function LocaleSwitcher() {
    const router = useRouter();
    const pathname = usePathname();
    const dictionary = useDictionary()?.['navigation'];

    const switchLocale = (locale: string) => {
        const newPath = pathname.replace(/^\/(en|ru)/, `/${locale}`);
        router.push(newPath);
        router.refresh();
    };

    const renderSwitchButton = (locale: string) => {
        const isActive = pathname.startsWith(`/${locale}`);
        const getTitle =
            locale === 'en' ? dictionary.switchToEn : dictionary.switchToRu;

        return (
            <button
                title={getTitle}
                aria-label={getTitle}
                key={locale}
                onClick={() => switchLocale(locale)}
                className={`button button-md font-bold md:px-1 md:py-1 md:text-sm ${
                    isActive
                        ? 'text-accent'
                        : 'text-secondary hover:text-accent'
                } `}
            >
                {locale.toUpperCase()}
            </button>
        );
    };

    return (
        <div className="flex gap-1">
            {locales.map((locale) => renderSwitchButton(locale))}
        </div>
    );
}
