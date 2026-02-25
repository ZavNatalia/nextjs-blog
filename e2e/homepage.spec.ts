import { expect, test } from '@playwright/test';

test.describe('Homepage (EN)', () => {
    test('displays hero card with English text', async ({ page }) => {
        await page.goto('/en');

        await expect(
            page.getByRole('heading', { name: 'Building with Next.js' }),
        ).toBeVisible();
        await expect(
            page.getByText('All about Next.js and modern web development'),
        ).toBeVisible();
    });

    test('displays Featured Posts section', async ({ page }) => {
        await page.goto('/en');

        await expect(
            page.getByRole('heading', { name: 'Featured Posts' }),
        ).toBeVisible();
        await expect(
            page.getByRole('link', { name: 'All posts', exact: true }),
        ).toBeVisible();
    });

    test('navigates to posts page via "All posts" link', async ({ page }) => {
        await page.goto('/en');

        await page.getByRole('link', { name: 'All posts', exact: true }).click();

        await expect(page).toHaveURL(/\/en\/posts$/);
    });

    test('has working navigation links', async ({ page }) => {
        await page.goto('/en');

        const header = page.getByRole('banner');
        await expect(
            header.getByRole('link', { name: 'Posts' }),
        ).toBeVisible();
        await expect(
            header.getByRole('link', { name: 'Contact' }),
        ).toBeVisible();
    });
});

test.describe('Homepage (RU)', () => {
    test('displays hero card with Russian text', async ({ page }) => {
        await page.goto('/ru');

        await expect(
            page.getByRole('heading', { name: 'Создаём с Next.js' }),
        ).toBeVisible();
        await expect(
            page.getByText('Всё о Next.js и современной веб-разработке'),
        ).toBeVisible();
    });
});
