import { type Locator, type Page } from '@playwright/test';
import BasePage from '../helpers/BasePage';

export default class LoginPage extends BasePage {
  private readonly emailInput: Locator;
  private readonly passwordInput: Locator;
  private readonly loginButton: Locator;
  private readonly loginErrorMessage: Locator;
  private readonly loggedInAsText: Locator;
  private readonly logoutLink: Locator;

  constructor(page: Page) {
    super(page);

    this.emailInput = page
      .locator('form')
      .filter({ hasText: 'Login' })
      .getByPlaceholder('Email Address');
    this.passwordInput = page.getByRole('textbox', { name: 'Password' });
    this.loginButton = page
      .locator('form')
      .filter({ hasText: 'Login' })
      .getByRole('button', { name: 'Login' });
    this.loginErrorMessage = page.locator('form').filter({ hasText: 'Login' }).locator('p');
    this.loggedInAsText = page.locator('li a').filter({ hasText: 'Logged in as' });
    this.logoutLink = page.getByRole('link', { name: 'Logout' });
  }

  async goToLogin(): Promise<void> {
    await this.page.goto('/login');
  }

  getUrl(): string {
    return this.page.url();
  }

  async fillEmail(email: string): Promise<void> {
    await this.emailInput.fill(email);
  }

  async fillPassword(password: string): Promise<void> {
    await this.passwordInput.fill(password);
  }

  async clickLoginButton(): Promise<void> {
    await this.loginButton.click();
  }

  async login(email: string, password: string): Promise<void> {
    await this.fillEmail(email);
    await this.fillPassword(password);
    await this.clickLoginButton();
  }

  async getLoginErrorMessage(): Promise<string> {
    await this.loginErrorMessage.waitFor({ state: 'visible' });
    return (await this.loginErrorMessage.textContent()) ?? '';
  }

  async getLoggedInAsText(): Promise<string> {
    await this.loggedInAsText.waitFor({ state: 'visible' });
    return (await this.loggedInAsText.textContent()) ?? '';
  }

  async isLoggedIn(): Promise<boolean> {
    return (await this.loggedInAsText.count()) > 0;
  }

  async logout(): Promise<void> {
    await this.logoutLink.click();
  }
}
