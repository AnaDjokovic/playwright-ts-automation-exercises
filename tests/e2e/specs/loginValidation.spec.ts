import { test, expect } from '../fixtures';
import { invalidData, generateUserData } from '../../api/helpers/data.helper';
import { loginErrorMessage } from '../helpers/data.helper';

test.describe('Login E2E tests', () => {
  test('TC01 - Login without prior registration', { tag: ['@regression'] }, async ({ loginPage }) => {
    const userData = generateUserData();

    await loginPage.goToLogin();
    await loginPage.login(userData.email, userData.password);

    const errorMessage = await loginPage.getLoginErrorMessage();

    expect(errorMessage).toBe('Your email or password is incorrect!');
  });

  test.describe('Login with registered user', () => {
    test(
      'TC02 - Login form field validations',
      { tag: ['@regression'] },
      async ({ loginPage, registeredUser }) => {
        await loginPage.goToLogin();

        await test.step('Empty email validation', async () => {
          await loginPage.fillEmail('');
          await loginPage.fillPassword(registeredUser.password);
          await loginPage.clickLoginButton();

          const isOnLoginPage = loginPage.getUrl().includes('/login');

          expect(isOnLoginPage).toBe(true);
        });

        await test.step('Empty password validation', async () => {
          await loginPage.fillEmail(registeredUser.email);
          await loginPage.fillPassword('');
          await loginPage.clickLoginButton();

          const isOnLoginPage = loginPage.getUrl().includes('/login');

          expect(isOnLoginPage).toBe(true);
        });

        await test.step('Invalid email format validation', async () => {
          await loginPage.fillEmail(invalidData.invalidEmailFormat);
          await loginPage.fillPassword(registeredUser.password);
          await loginPage.clickLoginButton();

          const isOnLoginPage = loginPage.getUrl().includes('/login');

          expect(isOnLoginPage).toBe(true);
        });
      },
    );

    test(
      'TC03 - Login with wrong email',
      { tag: ['@regression'] },
      async ({ loginPage, registeredUser }) => {
        const nonExistentUser = generateUserData();

        await loginPage.goToLogin();
        await loginPage.login(nonExistentUser.email, registeredUser.password);

        const errorMessage = await loginPage.getLoginErrorMessage();

        expect(errorMessage).toBe(loginErrorMessage);
      },
    );

    test(
      'TC04 - Login with wrong password',
      { tag: ['@regression'] },
      async ({ loginPage, registeredUser }) => {
        await loginPage.goToLogin();
        await loginPage.login(registeredUser.email, invalidData.password);

        const errorMessage = await loginPage.getLoginErrorMessage();

        expect(errorMessage).toBe(loginErrorMessage);
      },
    );

    test(
      'TC05 - Login with valid credentials',
      { tag: ['@smoke'] },
      async ({ loginPage, registeredUser }) => {
        await loginPage.goToLogin();
        await loginPage.login(registeredUser.email, registeredUser.password);

        const isLoggedIn = await loginPage.isLoggedIn();
        expect(isLoggedIn).toBe(true);

        const loggedInText = await loginPage.getLoggedInAsText();

        expect(loggedInText).toContain(registeredUser.name);
      },
    );

    test('TC06 - Logout after login', { tag: ['@smoke'] }, async ({ loginPage, registeredUser }) => {
      await loginPage.goToLogin();
      await loginPage.login(registeredUser.email, registeredUser.password);
      await loginPage.logout();

      const isOnLoginPage = loginPage.getUrl().includes('/login');

      expect(isOnLoginPage).toBe(true);
    });
  });
});
