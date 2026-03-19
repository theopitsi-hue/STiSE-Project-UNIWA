const { test, expect } = require('@playwright/test');

const BASE_URL = 'http://localhost:3000';

// Mock APIs
const mockStores = async (page, stores = []) => {
  await page.route('**/api/stores', route =>
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(stores)
    })
  );
};

const mockCategories = async (page, categories = []) => {
  await page.route('**/api/categories', route =>
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(categories)
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

// Mock login before tests
const preLogin = async (page) => {
  // Simulate the user already logged in by setting token and user in localStorage
  await page.addInitScript(() => {
    localStorage.setItem('authToken', 'fake-token');
    localStorage.setItem('user', JSON.stringify({ id: 1, name: 'Test User', role: 1 }));
  });
};

test.beforeEach(async ({ page }) => {
  // Pre-login
  await preLogin(page);

  // Mock APIs
  await mockUser(page);
  await mockStores(page, []);
  await mockCategories(page, []);
});

test.describe('Stores Page', () => {
  test('displays stores correctly', async ({ page }) => {
    await mockStores(page, [
      { id: 1, name: 'Papas Pizzeria', slug: 'papas-pizzeria', minOrder: 10, deliveryTime: 30, categories: [{ id: 1, name: 'Pizza' }] },
      { id: 2, name: 'Burger Queen', slug: 'burger-queen', minOrder: 5, deliveryTime: 20, categories: [{ id: 2, name: 'Burgers' }] }
    ]);
    await mockCategories(page, [
      { id: 1, name: 'Pizza', sortIndex: 1, iconName: 'Pizza' },
      { id: 2, name: 'Burgers', sortIndex: 2, iconName: 'Box' }
    ]);

    await page.goto(`${BASE_URL}/stores`);

    await expect(page.getByRole('button', { name: /Papas Pizzeria/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /Burger Queen/i })).toBeVisible();
  });

  test('can search stores', async ({ page }) => {
    await mockStores(page, [
      { id: 1, name: 'Papas Pizzeria', slug: 'papas-pizzeria', minOrder: 10, deliveryTime: 30, categories: [{ id: 1, name: 'Pizza' }] },
      { id: 2, name: 'Burger Queen', slug: 'burger-queen', minOrder: 5, deliveryTime: 20, categories: [{ id: 2, name: 'Burgers' }] }
    ]);
    await page.goto(`${BASE_URL}/stores`);

    await page.fill('input[placeholder="Search for a store"]', 'pizzeria');
    await expect(page.getByRole('button', { name: /Papas Pizzeria/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /Burger Queen/i })).not.toBeVisible();
  });
});