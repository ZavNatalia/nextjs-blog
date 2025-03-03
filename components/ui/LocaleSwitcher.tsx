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
                className={`icon-button text-md rounded-2xl border-2 border-transparent px-2 py-1 transition-colors duration-300 md:rounded-xl md:p-1 md:text-xs ${
                    isActive
                        ? 'border-muted bg-primary-light/80 text-foreground dark:border-muted-dark/80 dark:bg-dark/80 md:border-muted-light'
                        : ''
                } `}
            >
                {locale.toUpperCase()}
            </button>
        );
    };

    return <div className="flex gap-2">{locales.map(renderSwitchButton)}</div>;
}
