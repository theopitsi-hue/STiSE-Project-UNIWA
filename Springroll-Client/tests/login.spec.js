const { test, expect } = require('@playwright/test');

const BASE_URL = 'http://localhost:3000';

// Mock API responses
const mockLogin = async (page, success = true) => {
    await page.route('**/api/account/auth/login', async route => {
        if (success) {
            await route.fulfill({
                status: 200,
                contentType: 'application/json',
                body: JSON.stringify({ id: 1, name: 'Test User', role: 1, message: 'Login successful!' })
            });
        } else {
            await route.fulfill({
                status: 401,
                contentType: 'application/json',
                body: JSON.stringify({ message: 'Invalid credentials' })
            });
        }
    });
};

const mockRegister = async (page, success = true) => {
    await page.route('**/api/account/auth/register', async route => {
        if (success) {
            await route.fulfill({
                status: 200,
                contentType: 'application/json',
                body: JSON.stringify({ id: 2, name: 'New User', role: 1, message: 'Registration successful!' })
            });
        } else {
            await route.fulfill({
                status: 400,
                contentType: 'application/json',
                body: JSON.stringify({ message: 'Email already exists' })
            });
        }
    });
};

test.describe('Login Page (E2E)', () => {
    test.beforeEach(async ({ page }) => {
        // Optional: clear localStorage before each test
        await page.goto(BASE_URL);
        await page.evaluate(() => localStorage.clear());
    });

    test('successful login navigates to stores page', async ({ page }) => {
        await mockLogin(page, true);

        await page.goto(`${BASE_URL}/login`);

        await page.fill('input[type="email"]', 'test@gmail.com');
        await page.fill('input[type="password"]', '123123123');

        await page.click('button:has-text("Login!")');

        // Wait for navigation after login
        await page.waitForURL(`${BASE_URL}/stores`, { timeout: 5000 });

        await expect(page).toHaveURL(`${BASE_URL}/stores`);
    });

    test('failed login shows error message', async ({ page }) => {
        await mockLogin(page, false);

        await page.goto(`${BASE_URL}/login`);

        await page.fill('input[type="email"]', 'wrong@example.com');
        await page.fill('input[type="password"]', 'wrongpassword');

        await page.click('button:has-text("Login!")');

        await expect(page.locator('text=Invalid credentials')).toBeVisible();
        // URL should not change
        await expect(page).toHaveURL(`${BASE_URL}/login`);
    });

    test('successful registration switches to login mode', async ({ page }) => {
        await mockRegister(page, true);

        await page.goto(`${BASE_URL}/login`);

        // Switch to Sign Up
        await page.click('button:has-text("Sign Up")');

        await page.fill('input[placeholder="Username"]', 'NewUser');
        await page.fill('input[type="email"]', 'newuser@example.com');
        await page.fill('input[type="password"]', 'password123');

        await page.click('button:has-text("Sign Up!")');

        // Check popup for registration success
        await expect(page.locator('text=Registration successful! Please log in.')).toBeVisible();

        // Form should switch back to login mode
        await expect(page.locator('text=Login!')).toBeVisible();
    });

    test('failed registration shows error', async ({ page }) => {
        await mockRegister(page, false);

        await page.goto(`${BASE_URL}/login`);

        await page.click('button:has-text("Sign Up")');

        await page.fill('input[placeholder="Username"]', 'NewUser');
        await page.fill('input[type="email"]', 'existing@example.com');
        await page.fill('input[type="password"]', 'password123');

        await page.click('button:has-text("Sign Up!")');

        await expect(page.locator('text=Email already exists')).toBeVisible();

        // Should still be in Sign Up mode
        await expect(page.locator('text=Sign Up!')).toBeVisible();
    });
});