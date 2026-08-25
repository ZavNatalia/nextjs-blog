import { match as matchLocale } from '@formatjs/intl-localematcher';
import Negotiator from 'negotiator';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import { i18n } from './i18n-config';

const COOKIE_NAME = 'locale';
const COOKIE_OPTIONS = {
    path: '/',
    maxAge: 60 * 60 * 24 * 365,
    httpOnly: true,
    secure: true,
    // lax, not strict: a strict cookie is not sent when the user arrives from
    // an external site (search results, messengers), which is exactly when the
    // stored preference has to be honored.
    sameSite: 'lax' as const,
};

/**
 * Only a document navigation may store the locale.
 *
 * <Link> prefetches pages in the background, including pages of the locale the
 * user has just left; letting those write the cookie would roll the stored
 * locale back. Next strips its own RSC headers before this runs, so the accept
 * header is the only way to tell a document request from a client-side one —
 * which is why LocaleSwitcher navigates the document instead of routing.
 */
function isDocumentRequest(request: NextRequest): boolean {
    return request.headers.get('accept')?.includes('text/html') ?? false;
}

function getLocale(request: NextRequest): string {
    const langCookie = request.cookies.get(COOKIE_NAME)?.value;
    const locales: string[] = [...i18n.locales];

    if (langCookie && locales.includes(langCookie)) {
        return langCookie;
    }

    const negotiatorHeaders: Record<string, string> = {};
    request.headers.forEach((value, key) => (negotiatorHeaders[key] = value));

    const languages = new Negotiator({
        headers: negotiatorHeaders,
    }).languages();
    return matchLocale(languages, locales, i18n.defaultLocale);
}

export function proxy(request: NextRequest) {
    const pathname = request.nextUrl.pathname;

    if (/^\/(api|_next|favicon\.ico)/.test(pathname)) {
        return NextResponse.next();
    }

    const locales: string[] = [...i18n.locales];
    const localeInPath = locales.some(
        (locale) =>
            pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`,
    );

    const storedLocale = request.cookies.get(COOKIE_NAME)?.value;

    if (!localeInPath) {
        const locale = getLocale(request);
        const response = NextResponse.redirect(
            new URL(`/${locale}${pathname}`, request.url),
        );

        if (isDocumentRequest(request) && storedLocale !== locale) {
            response.cookies.set(COOKIE_NAME, locale, COOKIE_OPTIONS);
        }
        return response;
    }

    const currentLocale = pathname.split('/')[1];
    const response = NextResponse.next();

    if (
        locales.includes(currentLocale) &&
        isDocumentRequest(request) &&
        storedLocale !== currentLocale
    ) {
        response.cookies.set(COOKIE_NAME, currentLocale, COOKIE_OPTIONS);
    }

    return response;
}

export const config = {
    matcher: [
        '/((?!api|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|images/).*)',
    ],
};
