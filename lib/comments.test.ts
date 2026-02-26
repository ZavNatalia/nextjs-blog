import { describe, expect, it } from 'vitest';

import { moderateContent } from './comments';

describe('moderateContent', () => {
    it('approves normal text', () => {
        expect(moderateContent('Great article, thanks for sharing!')).toBe(
            'approved',
        );
    });

    it('flags content with http:// URLs', () => {
        expect(moderateContent('Check http://spam.com for deals')).toBe(
            'pending',
        );
    });

    it('flags content with https:// URLs', () => {
        expect(moderateContent('Visit https://example.com now')).toBe(
            'pending',
        );
    });

    it('flags content with www. URLs', () => {
        expect(moderateContent('Go to www.spam.com for more')).toBe('pending');
    });

    it('flags content with 5+ repeated characters', () => {
        expect(moderateContent('This is greaaaaat')).toBe('pending');
    });

    it('approves content with 4 repeated characters', () => {
        expect(moderateContent('This is greeeat')).toBe('approved');
    });

    it('flags content with >70% uppercase', () => {
        expect(moderateContent('THIS IS ALL CAPS TEXT HERE')).toBe('pending');
    });

    it('approves content with <=70% uppercase', () => {
        expect(moderateContent('This Is Normal Text')).toBe('approved');
    });

    it('approves short lowercase content', () => {
        expect(moderateContent('nice post')).toBe('approved');
    });
});
