export const getLocale = (value: 'en' | 'ru') =>
    ({
        en: 'en-US',
        ru: 'ru-RU',
    })[value] || 'en-US';
