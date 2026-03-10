import { test, expect } from '@playwright/test';

test.describe('ModalHireMe', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/');
        // Открываем модалку через кнопку "Hire Me" на главной
        await page.getByRole('button', { name: /hire me/i }).first().click();
        // Ждём появления формы
        await expect(page.getByText("Let's talk!")).toBeVisible();
    });

    test('opens modal with form fields', async ({ page }) => {
        await expect(page.getByLabel('Name')).toBeVisible();
        await expect(page.getByLabel('Email')).toBeVisible();
        await expect(page.getByLabel('Description')).toBeVisible();
        await expect(page.getByRole('button', { name: 'Send' })).toBeVisible();
    });

    test('shows validation errors when submitting empty form', async ({ page }) => {
        await page.getByRole('button', { name: 'Send' }).click();
        await expect(page.getByText('Please write Name')).toBeVisible();
        await expect(page.getByText('Please write Email')).toBeVisible();
        await expect(page.getByText('Please write Description')).toBeVisible();
    });

    test('shows email validation error for incorrect email', async ({ page }) => {
        await page.getByLabel('Email').fill('not-an-email');
        await page.getByRole('button', { name: 'Send' }).click();
        await expect(page.getByText('Please write correct email')).toBeVisible();
    });

    test('fills and submits form successfully', async ({ page }) => {
        await page.getByLabel('Name').fill('John Doe');
        await page.getByLabel('Email').fill('john@example.com');
        await page.getByLabel('Description').fill('I want to hire you for a project');

        await page.getByRole('button', { name: 'Send' }).click();

        // После успешной отправки модалка закрывается
        await expect(page.getByText("Let's talk!")).not.toBeVisible();
    });

    test('closes modal on Close button click', async ({ page }) => {
        // Кнопка Close в футере формы (MUI outlined button), не X-кнопка
        await page.getByRole('button', { name: 'Close' }).last().click();
        await expect(page.getByText("Let's talk!")).not.toBeVisible();
    });
});
