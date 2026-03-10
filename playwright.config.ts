import { defineConfig, devices } from "@playwright/test";
import dotenv from "dotenv";
import path from "path";

// Automatically loads .env.test before all tests
dotenv.config({ path: path.resolve(__dirname, ".env.test") });

export default defineConfig({
    testDir: "./tests",
    fullyParallel: true,
    forbidOnly: !!process.env.CI,
    retries: process.env.CI ? 2 : 0,
    workers: process.env.CI ? 1 : undefined,
    reporter: "html",
    use: {
        baseURL: "http://localhost:3000",
        trace: "on-first-retry",
        screenshot: "only-on-failure",
    },
    projects: [
        // 1. First login and save auth state
        {
            name: "setup",
            testMatch: /auth\.setup\.ts/,
        },
        // 2. Tests without authentication (hire-me form, public pages)
        {
            name: "unauthenticated",
            use: { ...devices["Desktop Chrome"] },
            testIgnore: /works|certificates/,
        },
        // 3. Tests with authentication (works, certificates)
        {
            name: "authenticated",
            use: {
                ...devices["Desktop Chrome"],
                storageState: "playwright/.auth/user.json",
            },
            dependencies: ["setup"],
            testMatch: /works|certificates/,
        },
    ],
    webServer: {
        command: "npm start",
        url: "http://localhost:3000",
        reuseExistingServer: !process.env.CI,
        timeout: 120_000,
    },
});
