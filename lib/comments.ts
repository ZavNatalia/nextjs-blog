import type { CommentStatus } from '@/lib/types/mongodb';

const PROFANITY_EN = [
    'fuck',
    'shit',
    'asshole',
    'bitch',
    'damn',
    'cunt',
    'dick',
    'bastard',
    'piss',
    'slut',
    'whore',
];

const PROFANITY_RU = [
    'блять',
    'бля',
    'сука',
    'хуй',
    'пизд',
    'ебат',
    'ёбан',
    'нахуй',
    'пидор',
    'мудак',
    'залуп',
    'дерьм',
];

function containsProfanity(content: string): boolean {
    const lower = content.toLowerCase();

    // Latin words: word boundary match
    const enPattern = new RegExp(`\\b(${PROFANITY_EN.join('|')})`, 'i');
    if (enPattern.test(lower)) return true;

    // Cyrillic words: no \b support, match as substrings (stems catch inflections)
    const ruPattern = new RegExp(`(${PROFANITY_RU.join('|')})`, 'i');
    return ruPattern.test(lower);
}

export function moderateContent(content: string): CommentStatus {
    // Check for profanity
    if (containsProfanity(content)) {
        return 'pending';
    }

    // Check for URLs
    if (/https?:\/\/|www\./i.test(content)) {
        return 'pending';
    }

    // Check for 5+ repeated characters
    if (/(.)\1{4,}/.test(content)) {
        return 'pending';
    }

    // Check for >70% uppercase (only count letters)
    const letters = content.replace(/[^a-zA-Z]/g, '');
    if (letters.length > 0) {
        const upperCount = letters.replace(/[^A-Z]/g, '').length;
        if (upperCount / letters.length > 0.7) {
            return 'pending';
        }
    }

    return 'approved';
}
