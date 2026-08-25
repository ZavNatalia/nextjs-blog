import { localePath } from './locale-path';

describe('localePath', () => {
    it('returns the locale root for "/"', () => {
        expect(localePath('ru', '/')).toBe('/ru');
    });

    it('prefixes nested paths with the locale', () => {
        expect(localePath('ru', '/posts')).toBe('/ru/posts');
        expect(localePath('en', '/admin/comments')).toBe('/en/admin/comments');
    });
});
