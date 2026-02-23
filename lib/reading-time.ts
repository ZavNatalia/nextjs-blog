const WORDS_PER_MINUTE = 200;

export function calculateReadingTime(content: string): number {
    const cleaned = content
        .replace(/```[\s\S]*?```/g, '')
        .replace(/`[^`]*`/g, '')
        .replace(/!\[.*?\]\(.*?\)/g, '')
        .replace(/\[([^\]]*)\]\(.*?\)/g, '$1')
        .replace(/#{1,6}\s/g, '')
        .replace(/[*_~>|-]/g, '')
        .trim();

    const words = cleaned.split(/\s+/).filter(Boolean).length;
    const minutes = Math.ceil(words / WORDS_PER_MINUTE);

    return Math.max(1, minutes);
}
