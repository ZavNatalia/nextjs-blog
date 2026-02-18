import { expect, test } from '@playwright/test';

test.describe('Posts page (EN)', () => {
    test('displays posts list with breadcrumbs', async ({ page }) => {
        await page.goto('/en/posts');

        const nav = page.locator('nav').filter({ hasText: 'all posts' });
        await expect(nav).toBeVisible();
        await expect(nav.getByText('all posts')).toBeVisible();
    });

    test('displays post cards with "Read more" links', async ({ page }) => {
        await page.goto('/en/posts');

        const postCards = page.getByRole('listitem');
        await expect(postCards.first()).toBeVisible();

        const readMoreLinks = page.getByRole('link', {
            name: /Read more/,
        });
        expect(await readMoreLinks.count()).toBeGreaterThan(0);
    });

    test('navigates to a post detail page', async ({ page }) => {
        await page.goto('/en/posts');

        const firstReadMore = page
            .getByRole('link', { name: /Read more/ })
            .first();
        await firstReadMore.click();

        await expect(page).toHaveURL(/\/en\/posts\/.+/);
        await expect(
            page.getByRole('link', { name: 'Go to all posts' }),
        ).toBeVisible();
    });
});

test.describe('Posts page (RU)', () => {
    test('displays posts list with Russian breadcrumbs', async ({ page }) => {
        await page.goto('/ru/posts');

        const nav = page.locator('nav').filter({ hasText: 'все посты' });
        await expect(nav).toBeVisible();
        await expect(nav.getByText('все посты')).toBeVisible();
    });
});

test.describe('Post detail page', () => {
    test('renders post content with markdown', async ({ page }) => {
        await page.goto('/en/posts/next-js-15');

        await expect(page.locator('article')).toBeVisible();
        await expect(
            page.getByRole('link', { name: 'Go to all posts' }),
        ).toBeVisible();
    });

    test('shows 404 for non-existent post', async ({ page }) => {
        await page.goto('/en/posts/this-post-does-not-exist');

        await expect(page.getByText('404')).toBeVisible();
    });
});
