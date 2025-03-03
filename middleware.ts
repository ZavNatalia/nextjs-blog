import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

import { i18n } from './i18n-config';
import { match as matchLocale } from '@formatjs/intl-localematcher';
import Negotiator from 'negotiator';

const COOKIE_NAME = 'locale';
const COOKIE_OPTIONS = {
    path: '/',
    maxAge: 60 * 60 * 24 * 365,
    httpOnly: true,
    secure: true,
    sameSite: 'strict' as const,
};

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

export function middleware(request: NextRequest) {
    const pathname = request.nextUrl.pathname;

    if (/^\/(api|_next|favicon\.ico)/.test(pathname)) {
        return NextResponse.next();
    }

    const locales: string[] = [...i18n.locales];
    const localeInPath = locales.some(
        (locale) =>
            pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`,
    );

    if (!localeInPath) {
        const locale = getLocale(request);
        const response = NextResponse.redirect(
            new URL(`/${locale}${pathname}`, request.url),
        );

        response.cookies.set(COOKIE_NAME, locale, COOKIE_OPTIONS);
        return response;
    }

    const currentLocale = pathname.split('/')[1];
    if (locales.includes(currentLocale)) {
        const response = NextResponse.next();
        response.cookies.set(COOKIE_NAME, currentLocale, COOKIE_OPTIONS);
        return response;
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico|images/).*)'],
};
