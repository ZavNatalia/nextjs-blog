'use client';

import { usePathname, useRouter } from 'next/navigation';
import { i18n } from '@/i18n-config';
import { useDictionary } from '@/hooks/useDictionary';

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
                className={`icon-button rounded-2xl border-2 border-transparent px-2 py-1 text-base md:rounded-xl md:p-1 md:text-xs ${
                    isActive
                        ? 'bg-primary dark:bg-dark ' +
                        'md:bg-primary-contrast md:dark:bg-dark-soft ' +
                        'text-foreground '
                        : ''
                } `}
            >
                {locale.toUpperCase()}
            </button>
        );
    };

    return (
        <div className="flex gap-2">
            {locales.map((locale) => renderSwitchButton(locale))}
        </div>
    );
}
