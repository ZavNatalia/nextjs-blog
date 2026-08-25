import type { Locale } from '@/i18n-config';

/**
 * Prefixes an app-internal path with the active locale.
 *
 * Links must carry the locale themselves: a locale-less href is resolved by
 * proxy.ts at request time, and the App Router resolves it during prefetch —
 * i.e. while the page may still be on the previous locale.
 */
export function localePath(locale: Locale, path: string): string {
    if (path === '/') {
        return `/${locale}`;
    }
    return `/${locale}${path}`;
}
