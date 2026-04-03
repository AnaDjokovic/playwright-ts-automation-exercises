import { type Page } from '@playwright/test';

export default class BasePage {
  protected page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  /**
   * Navigate to a path. If no path is provided, navigates to home page
   */
  async goto(path: string = ''): Promise<string> {
    const fullPath = path === '' ? '/' : `/${path}`;
    await this.page.goto(fullPath);
    return this.page.url();
  }

  // Added the method to block adds to prevent interference with tests
  async blockAds(): Promise<void> {
    await this.page.route('**/*doubleclick*', (route) => route.abort());
    await this.page.route('**/*googlesyndication*', (route) => route.abort());
    await this.page.route('**/*googletagmanager*', (route) => route.abort());
  }
}
