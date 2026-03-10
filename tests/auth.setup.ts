import { test as setup } from "@playwright/test";

const authFile = "playwright/.auth/user.json";

const EMAIL = process.env.TEST_EMAIL ?? "";
const PASSWORD = process.env.TEST_PASSWORD ?? "";
const FIRST_NAME = process.env.TEST_FIRST_NAME ?? "Test";
const LAST_NAME = process.env.TEST_LAST_NAME ?? "User";

setup("authenticate", async ({ page }) => {
    // Шаг 1: Пробуем Sign Up
    await page.goto("/auth/sign-up");

    await page.getByLabel("First Name").fill(FIRST_NAME);
    await page.getByLabel("Last Name").fill(LAST_NAME);
    await page.getByLabel("Email").fill(EMAIL);
    await page.locator("#password").fill(PASSWORD);
    await page.getByRole("button", { name: "Sign Up" }).click();

    // Ждём: либо редирект на главную (успех), либо ошибка (юзер уже существует)
    await Promise.race([
        page.waitForURL("/", { timeout: 5000 }),
        page.waitForSelector("[class*=ErrorMessage]", { timeout: 5000 }),
    ]).catch(() => {});

    // Шаг 2: Если Sign Up не сработал (уже есть аккаунт) — Sign In
    if (!page.url().endsWith("/")) {
        await page.goto("/auth/login");

        await page.getByLabel("Email").fill(EMAIL);
        await page.locator("#password").fill(PASSWORD);
        await page.getByRole("button", { name: "Sign in" }).click();

        await page.waitForURL("/");
    }

    // Сохраняем cookies + localStorage в файл
    await page.context().storageState({ path: authFile });
});
