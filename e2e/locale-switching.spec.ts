import { expect, test } from '@playwright/test';

test.describe('Locale switching', () => {
    test('switches from EN to RU on homepage', async ({ page }) => {
        await page.goto('/en');

        await expect(
            page.getByRole('heading', { name: 'Building with Next.js' }),
        ).toBeVisible();

        await page
            .getByRole('button', { name: 'Switch to Russian' })
            .click();
        await page.waitForURL('**/ru');

        await expect(
            page.getByRole('heading', { name: 'Создаём с Next.js' }),
        ).toBeVisible();
    });

    test('switches from RU to EN on homepage', async ({ page }) => {
        await page.goto('/ru');

        await expect(
            page.getByRole('heading', { name: 'Создаём с Next.js' }),
        ).toBeVisible();

        await page
            .getByRole('button', { name: 'Выбрать английский язык' })
            .click();
        await page.waitForURL('**/en');

        await expect(
            page.getByRole('heading', { name: 'Building with Next.js' }),
        ).toBeVisible();
    });

    test('preserves current route when switching locale on posts page', async ({
        page,
    }) => {
        await page.goto('/en/posts');

        const nav = page.locator('nav').filter({ hasText: 'all posts' });
        await expect(nav).toBeVisible();

        await page
            .getByRole('button', { name: 'Switch to Russian' })
            .click();
        await page.waitForURL('**/ru/posts');

        await expect(page).toHaveURL(/\/ru\/posts$/);
        const ruNav = page.locator('nav').filter({ hasText: 'все посты' });
        await expect(ruNav).toBeVisible();
    });
});
