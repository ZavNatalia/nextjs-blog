import { getLocale } from './getLocale';

describe('getLocale', () => {
    it('maps "en" to "en-US"', () => {
        expect(getLocale('en')).toBe('en-US');
    });

    it('maps "ru" to "ru-RU"', () => {
        expect(getLocale('ru')).toBe('ru-RU');
    });

    it('falls back to "en-US" for unknown locale', () => {
        // @ts-expect-error testing unknown locale
        expect(getLocale('fr')).toBe('en-US');
    });
});
