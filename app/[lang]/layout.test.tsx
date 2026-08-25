vi.mock('next/font/local', () => ({
    default: () => ({ className: 'font', variable: '--font' }),
}));

import { dynamicParams, generateStaticParams } from '@/app/[lang]/layout';

describe('locale segment', () => {
    it('rejects params outside the configured locales', async () => {
        expect(dynamicParams).toBe(false);
        expect(await generateStaticParams()).toEqual([
            { lang: 'en' },
            { lang: 'ru' },
        ]);
    });
});
