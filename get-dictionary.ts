import 'server-only';

import en from './dictionaries/en.json';
import ru from './dictionaries/ru.json';

export type Dictionary = typeof en;

const dictionaries: Record<string, Dictionary> = { en, ru };

export function getDictionary(lang: string): Dictionary {
    return dictionaries[lang] || dictionaries.en;
}
