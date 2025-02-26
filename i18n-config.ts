export const i18n = {
    locales: ["en", "ru"],
    defaultLocale: "en",
    localeDetection: true,
} as const;

export type Locale = (typeof i18n)["locales"][number];