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

    test('requires consent before the message can be sent', async ({
        page,
    }) => {
        await page.goto('/en/contact');

        const consent = page.getByRole('checkbox');
        const sendButton = page.getByRole('button', { name: 'Send message' });

        await expect(consent).toBeVisible();
        await expect(consent).not.toBeChecked();
        await expect(sendButton).toBeDisabled();

        await page.getByLabel('Your name').fill('John');
        await page.getByLabel('Your message').fill('Hello');
        await consent.check();

        await expect(sendButton).toBeEnabled();
    });
});
