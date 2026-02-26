import type { CommentStatus } from '@/lib/types/mongodb';

export function moderateContent(content: string): CommentStatus {
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
