import { expect, test } from '@playwright/test';

test.describe('404 Not Found (EN)', () => {
    test('shows 404 page for non-existent route', async ({ page }) => {
        await page.goto('/en/this-page-does-not-exist');

        await expect(
            page.getByRole('heading', { name: '404' }),
        ).toBeVisible();
        await expect(
            page.getByText('Oops! Page Not Found.'),
        ).toBeVisible();
        await expect(
            page.getByRole('link', { name: 'Return Home' }),
        ).toBeVisible();
    });

    test('Return Home link navigates to homepage', async ({ page }) => {
        await page.goto('/en/some-nonexistent-path');

        await page.getByRole('link', { name: 'Return Home' }).click();

        await expect(page).toHaveURL(/\/en$/);
    });
});

test.describe('404 Not Found (RU)', () => {
    test('shows 404 page in Russian', async ({ page }) => {
        await page.goto('/ru/this-page-does-not-exist');

        await expect(
            page.getByRole('heading', { name: '404' }),
        ).toBeVisible();
        await expect(
            page.getByText('Ой! Похоже, этой страницы не существует.'),
        ).toBeVisible();
        await expect(
            page.getByRole('link', { name: 'Вернуться на главную' }),
        ).toBeVisible();
    });
});

test.describe('404 for deep paths', () => {
    test('shows 404 for deeply nested non-existent route', async ({
        page,
    }) => {
        await page.goto('/en/some/deeply/nested/route');

        await expect(
            page.getByRole('heading', { name: '404' }),
        ).toBeVisible();
    });
});
