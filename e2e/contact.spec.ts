import { expect, test } from '@playwright/test';

test.describe('Contact page', () => {
    test('renders contact form with all fields', async ({ page }) => {
        await page.goto('/en/contact');

        await expect(
            page.getByRole('heading', { name: 'How can I help you?' }),
        ).toBeVisible();
        await expect(page.getByLabel('Your Email')).toBeVisible();
        await expect(page.getByLabel('Your name')).toBeVisible();
        await expect(page.getByLabel('Your message')).toBeVisible();
        await expect(
            page.getByRole('button', { name: 'Send message' }),
        ).toBeVisible();
    });
});
