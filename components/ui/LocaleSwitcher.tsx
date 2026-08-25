'use client';

import { usePathname } from 'next/navigation';

import { useDictionary } from '@/hooks/useDictionary';
import { i18n } from '@/i18n-config';

const locales: string[] = [...i18n.locales];

export default function LocaleSwitcher() {
    const pathname = usePathname();
    const dictionary = useDictionary()?.['navigation'];

    // A document navigation, not a router push: proxy.ts stores the chosen
    // locale in a cookie, and it only trusts document requests to do that.
    const switchLocale = (locale: string) => {
        const newPath = pathname.replace(/^\/(en|ru)/, `/${locale}`);
        window.location.assign(newPath);
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
