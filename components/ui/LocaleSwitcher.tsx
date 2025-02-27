'use client';

import { usePathname, useRouter } from 'next/navigation';
import { i18n } from '@/i18n-config';

const locales: string[] = [...i18n.locales];

export default function LocaleSwitcher() {
    const router = useRouter();
    const pathname = usePathname();

    const switchLocale = (locale: string) => {
        const newPath = pathname.replace(/^\/(en|ru)/, `/${locale}`);
        router.push(newPath);
        router.refresh();
    };

    const renderSwitchButton = (locale: string) => {
        const isActive = pathname.startsWith(`/${locale}`);
        return (
            <button
                title={locale}
                key={locale}
                onClick={() => switchLocale(locale)}
                className={`icon-button border-2 border-transparent rounded-xl p-2 lg:p-1 text-md lg:text-xs transition-colors duration-300
                    ${isActive 
                    ? 'border-muted-light/90 dark:border-muted-dark/80 bg-primary-light/80 dark:bg-dark/80 text-foreground' 
                    : ''}
                    `}
            >
                {locale.toUpperCase()}
            </button>
        );
    };

    return (
        <div className="flex lg:gap-2">
            {locales.map(renderSwitchButton)}
        </div>
    );
}
