import { expect, test } from '@playwright/test';

test.describe('Auth page (EN)', () => {
    test('displays login form by default', async ({ page }) => {
        await page.goto('/en/auth');

        await expect(
            page.getByRole('heading', { name: 'Login' }),
        ).toBeVisible();
        await expect(page.getByLabel('Email')).toBeVisible();
        await expect(
            page.getByLabel('Password', { exact: true }),
        ).toBeVisible();
        await expect(
            page.getByRole('button', { name: 'Login', exact: true }),
        ).toBeVisible();
    });

    test('switches to sign up form', async ({ page }) => {
        await page.goto('/en/auth');

        await page.getByRole('button', { name: 'Create new account' }).click();

        await expect(
            page.getByRole('heading', { name: 'Sign Up' }),
        ).toBeVisible();
        await expect(page.getByLabel('Confirm Password')).toBeVisible();
    });

    test('shows validation errors on empty login submit', async ({ page }) => {
        await page.goto('/en/auth');

        await page.getByRole('button', { name: 'Login', exact: true }).click();

        await expect(page.getByText('Email is required')).toBeVisible();
        await expect(page.getByText('Password is required')).toBeVisible();
    });

    test('shows email validation error for invalid email', async ({ page }) => {
        await page.goto('/en/auth');

        await page.getByLabel('Email').fill('not-an-email');
        await page.getByLabel('Password', { exact: true }).click();

        await expect(page.getByText('Invalid email address')).toBeVisible();
    });

    test('shows password length validation error on sign up', async ({
        page,
    }) => {
        await page.goto('/en/auth');

        await page.getByRole('button', { name: 'Create new account' }).click();

        await page.getByLabel('Email').fill('test@example.com');
        await page.getByLabel('Password', { exact: true }).fill('123');
        await page.getByLabel('Confirm Password').click();

        await expect(
            page.getByText('Password must be at least 7 characters'),
        ).toBeVisible();
    });
});

test.describe('Auth page (RU)', () => {
    test('displays login form in Russian', async ({ page }) => {
        await page.goto('/ru/auth');

        await expect(
            page.getByRole('heading', { name: 'Войти' }),
        ).toBeVisible();
        await expect(
            page.getByRole('button', { name: 'Войти', exact: true }),
        ).toBeVisible();
    });
});
