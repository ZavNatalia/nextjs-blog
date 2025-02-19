import "server-only";

export function getDictionary(lang: string) {
    const dictionaries: Record<string, any> = {
        en: require('./dictionaries/en.json'),
        ru: require('./dictionaries/ru.json')
    };
    return dictionaries[lang] || dictionaries.en;
}
