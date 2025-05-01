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
                className={`icon-button button-xs rounded-lg px-2 py-1 font-bold ${
                    isActive
                        ? 'bg-background-secondary/70 hover:bg-background-secondary/70 ' +
                          ' md:bg-background-tertiary/70 hover:md:bg-background-tertiary/70' +
                          ' text-foreground hover:text-foreground'
                        : 'hover:text-accent hover:bg-background-secondary/70 md:hover:bg-background-tertiary/70'
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
