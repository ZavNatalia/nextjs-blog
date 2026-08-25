import { NextRequest } from 'next/server';

import { config, proxy } from './proxy';

/**
 * Next strips its RSC headers before proxy runs, so the accept header is the
 * only thing that separates a document navigation from a client-side one.
 */
function request(
    path: string,
    { cookie, rsc }: { cookie?: string; rsc?: boolean } = {},
) {
    const headers = new Headers({
        'accept-language': 'en-US,en;q=0.9',
        accept: rsc ? '*/*' : 'text/html,application/xhtml+xml',
    });
    if (cookie) headers.set('cookie', `locale=${cookie}`);
    return new NextRequest(`https://zav.me${path}`, { headers });
}

const setCookie = (response: Response) =>
    response.headers.get('set-cookie') ?? '';

describe('proxy', () => {
    describe('paths without a locale', () => {
        it('redirects to the locale from the cookie', () => {
            const response = proxy(request('/posts', { cookie: 'ru' }));
            expect(response.headers.get('location')).toBe(
                'https://zav.me/ru/posts',
            );
        });

        it('falls back to the Accept-Language header without a cookie', () => {
            const response = proxy(request('/posts'));
            expect(response.headers.get('location')).toBe(
                'https://zav.me/en/posts',
            );
        });

        it('does not touch the cookie on client-side requests', () => {
            const response = proxy(request('/posts', { rsc: true }));
            expect(setCookie(response)).toBe('');
        });
    });

    describe('paths with a locale', () => {
        it('stores the locale of the requested page', () => {
            const response = proxy(request('/ru/posts', { cookie: 'en' }));
            expect(setCookie(response)).toContain('locale=ru');
        });

        it('stores the locale with SameSite=Lax so it survives external entry', () => {
            const response = proxy(request('/ru/posts', { cookie: 'en' }));
            expect(setCookie(response)).toContain('SameSite=lax');
        });

        it('does not rewrite the cookie when it already matches', () => {
            const response = proxy(request('/ru/posts', { cookie: 'ru' }));
            expect(setCookie(response)).toBe('');
        });

        it('does not touch the cookie on client-side requests', () => {
            const response = proxy(
                request('/en/posts', { cookie: 'ru', rsc: true }),
            );
            expect(setCookie(response)).toBe('');
        });
    });

    describe('matcher', () => {
        const matches = (pathname: string) =>
            new RegExp(`^${config.matcher[0]}$`).test(pathname);

        it('runs for app pages', () => {
            expect(matches('/')).toBe(true);
            expect(matches('/ru/posts')).toBe(true);
        });

        it('skips sitemap and robots so they are served as-is', () => {
            expect(matches('/sitemap.xml')).toBe(false);
            expect(matches('/robots.txt')).toBe(false);
        });

        it('skips api, assets and internals', () => {
            expect(matches('/api/comments')).toBe(false);
            expect(matches('/images/site/hero.png')).toBe(false);
            expect(matches('/_next/static/chunk.js')).toBe(false);
        });
    });
});
