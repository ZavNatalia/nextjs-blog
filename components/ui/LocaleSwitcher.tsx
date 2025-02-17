'use client';

import { usePathname, useRouter } from 'next/navigation';
import { i18n } from '@/i18n-config';

const locales: string[] = i18n.locales;

export default function LocaleSwitcher() {
    const router = useRouter();
    const pathname = usePathname();

    const switchLocale = (locale: string) => {
        const newPath = pathname.replace(/^\/(en|ru)/, `/${locale}`);
        router.push(newPath);
    };

    const renderSwitchButton = (locale: string) => {
        const isActive = pathname.startsWith(`/${locale}`);
        return (
            <button
                key={locale}
                onClick={() => switchLocale(locale)}
                className={`icon-button rounded-xl p-2 text-sm transition-colors duration-300
                    ${isActive ? 'border-2 border-muted-light/80 dark:border-muted-dark/80' : ''}
                    `}
            >
                {locale.toUpperCase()}
            </button>
        );
    };

    return (
        <div className="flex gap-2">
            {locales.map(renderSwitchButton)}
        </div>
    );
}
