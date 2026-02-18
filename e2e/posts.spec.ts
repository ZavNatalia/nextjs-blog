import { expect, test } from '@playwright/test';

test.describe('Posts page (EN)', () => {
    test('displays posts list with breadcrumbs', async ({ page }) => {
        await page.goto('/en/posts');

        const breadcrumbs = page.locator('nav', { hasText: 'all posts' });
        await expect(breadcrumbs).toBeVisible();
        await expect(breadcrumbs.getByText('all posts')).toBeVisible();
    });

    test('displays post cards with "Read more" links', async ({ page }) => {
        await page.goto('/en/posts');

        await expect(page.getByRole('listitem').first()).toBeVisible();
        await expect(
            page.getByRole('link', { name: /Read more/ }).first(),
        ).toBeVisible();
    });

    test('navigates to a post detail page', async ({ page }) => {
        await page.goto('/en/posts');

        await page
            .getByRole('link', { name: /Read more/ })
            .first()
            .click();

        await expect(page).toHaveURL(/\/en\/posts\/.+/);
        await expect(
            page.getByRole('link', { name: 'Go to all posts' }),
        ).toBeVisible();
    });
});

test.describe('Posts page (RU)', () => {
    test('displays posts list with Russian breadcrumbs', async ({ page }) => {
        await page.goto('/ru/posts');

        const breadcrumbs = page.locator('nav', { hasText: 'все посты' });
        await expect(breadcrumbs).toBeVisible();
        await expect(breadcrumbs.getByText('все посты')).toBeVisible();
    });
});

test.describe('Post detail page', () => {
    test('renders post content with markdown', async ({ page }) => {
        await page.goto('/en/posts/next-js-15');

        await expect(page.getByRole('article')).toBeVisible();
        await expect(
            page.getByRole('link', { name: 'Go to all posts' }),
        ).toBeVisible();
    });

    test('shows 404 for non-existent post', async ({ page }) => {
        await page.goto('/en/posts/this-post-does-not-exist');

        await expect(
            page.getByRole('heading', { name: '404' }),
        ).toBeVisible();
    });
});
