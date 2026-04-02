import { test as base, expect } from '@playwright/test';
import HomePage from './pageObjects/HomePage';
import ProductsPage from './pageObjects/ProductsPage';
import ProductDetailsPage from './pageObjects/ProductDetailsPage';
import CartPage from './pageObjects/CartPage';
import LoginPage from './pageObjects/LoginPage';
import RegistrationPage from './pageObjects/RegistrationPage';
import RequestsApi from '../api/helpers/https.helper';
import { generateUserData, type UserData } from '../api/helpers/data.helper';

interface TestFixtures {
  homePage: HomePage;
  productsPage: ProductsPage;
  productDetailsPage: ProductDetailsPage;
  cartPage: CartPage;
  loginPage: LoginPage;
  registrationPage: RegistrationPage;
  registeredUser: UserData;
}

export const test = base.extend<TestFixtures>({
  homePage: async ({ page }, use) => {
    // Block ads once per page
    await page.route('**/*doubleclick*', (route) => route.abort());
    await page.route('**/*googlesyndication*', (route) => route.abort());
    await page.route('**/*googletagmanager*', (route) => route.abort());

    await use(new HomePage(page));
  },
  productsPage: async ({ page }, use) => {
    await use(new ProductsPage(page));
  },
  productDetailsPage: async ({ page }, use) => {
    await use(new ProductDetailsPage(page));
  },
  cartPage: async ({ page }, use) => {
    await use(new CartPage(page));
  },
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },
  registrationPage: async ({ page }, use) => {
    await use(new RegistrationPage(page));
  },
  registeredUser: async ({ request }, use) => {
    const api = new RequestsApi(request);
    const userData = generateUserData();

    await api.createAccount(userData);
    await use(userData);
    await api.deleteAccount({ email: userData.email, password: userData.password });
  },
});

export { expect };
