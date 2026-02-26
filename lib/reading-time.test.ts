import { calculateReadingTime } from './reading-time';

describe('calculateReadingTime', () => {
    it('returns 1 for very short content', () => {
        expect(calculateReadingTime('Hello world')).toBe(1);
    });

    it('returns 1 for empty content', () => {
        expect(calculateReadingTime('')).toBe(1);
    });

    it('calculates correct reading time for longer content', () => {
        const words = Array(400).fill('word').join(' ');
        expect(calculateReadingTime(words)).toBe(2);
    });

    it('strips code blocks from word count', () => {
        const content =
            '```js\nconst x = 1;\nconst y = 2;\n```\n' +
            Array(200).fill('word').join(' ');
        expect(calculateReadingTime(content)).toBe(1);
    });

    it('strips image markdown from word count', () => {
        const content =
            '![alt text](image.png)\n' + Array(200).fill('word').join(' ');
        expect(calculateReadingTime(content)).toBe(1);
    });

    it('keeps link text but strips URLs', () => {
        const content =
            '[click here](https://example.com) ' +
            Array(198).fill('word').join(' ');
        expect(calculateReadingTime(content)).toBe(1);
    });

    it('rounds up to nearest minute', () => {
        const words = Array(201).fill('word').join(' ');
        expect(calculateReadingTime(words)).toBe(2);
    });
});
