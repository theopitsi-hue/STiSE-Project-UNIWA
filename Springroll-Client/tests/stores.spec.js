const { test, expect } = require('@playwright/test');

const BASE_URL = 'http://localhost:3000';

// Helpers: Mock APIs
const mockStores = async (page, data = [], delay = 0) => {
  await page.route('**/api/stores', async route => {
    if (delay) await new Promise(res => setTimeout(res, delay));
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(data)
    });
  });
};

const mockCategories = async (page, data = []) => {
  await page.route('**/api/categories', route =>
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(data)
    })
  );
};

const mockUser = async (page, user = { id: 1, name: 'Test User', role: 1 }) => {
  await page.route('**/api/user', route =>
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(user)
    })
  );
};

// Global setup for each test
test.beforeEach(async ({ page }) => {
  // Fake auth token
  await page.addInitScript(() => {
    localStorage.setItem('authToken', 'fake-token');
  });

  // Default user mock
  await mockUser(page);
});

// Tests!!!

test.describe('Stores Page (E2E Integration)', () => {
  // 1) Loading
  test('shows loading initially', async ({ page }) => {
    await mockStores(page, [], 500);
    await mockCategories(page, []);
    
    await page.goto(`${BASE_URL}/stores`);
    await expect(page.getByText('Loading stores...')).toBeVisible();
  });

  // 2) Display
  test('displays stores from API', async ({ page }) => {
    await mockStores(page, [
      { id: 1, name: 'Papas Pizzeria', slug: 'papas-pizzeria', minOrder: 10, deliveryTime: 30 },
      { id: 2, name: 'Burger Queen', slug: 'burger-queen', minOrder: 5, deliveryTime: 20 }
    ]);
    await mockCategories(page, [
      { id: 1, name: 'Pizza', sortIndex: 1, iconName: 'Pizza' },
      { id: 2, name: 'Burgers', sortIndex: 2, iconName: 'Box' }
    ]);

    await page.goto(`${BASE_URL}/stores`);

    await expect(page.getByRole('heading', { name: 'Papas Pizzeria' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Burger Queen' })).toBeVisible();
  });

  // 3) Empty set
  test('handles empty store list', async ({ page }) => {
    await mockStores(page, []);
    await mockCategories(page, []);

    await page.goto(`${BASE_URL}/stores`);

    await expect(page.getByText('Loading stores...')).not.toBeVisible();
  });

  // 4) Navigation
  test('navigates to store details when clicked', async ({ page }) => {
    await mockStores(page, [
      { id: 1, name: 'Papas Pizzeria', slug: 'papas-pizzeria', minOrder: 10, deliveryTime: 30 }
    ]);
    await mockCategories(page, [
      { id: 1, name: 'Pizza', sortIndex: 1, iconName: 'Pizza' }
    ]);

    await page.goto(`${BASE_URL}/stores`);

    const storeButton = page.getByRole('button', { name: /Papas Pizzeria/i });
    await expect(storeButton).toBeVisible();

    await storeButton.click();

    await expect(page).toHaveURL(`${BASE_URL}/stores/papas-pizzeria`);
  });

});