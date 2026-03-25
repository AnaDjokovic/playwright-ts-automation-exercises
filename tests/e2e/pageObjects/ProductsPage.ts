import { type Locator, type Page } from '@playwright/test';
import BasePage from '../helpers/BasePage';

export default class ProductsPage extends BasePage {
  private readonly allItemsWrapper: Locator;
  private readonly productWrapper: Locator;
  private readonly addToCart: Locator;
  private readonly continueShoppingBtn: Locator;
  readonly viewCartBtn: Locator;

  constructor(page: Page) {
    super(page);

    this.allItemsWrapper = page.locator('.features_items');
    this.productWrapper = page.locator('.product-image-wrapper');
    this.addToCart = page.locator('a').filter({ hasText: 'Add to cart' });
    this.continueShoppingBtn = page.locator('button:has-text("Continue Shopping")');
    this.viewCartBtn = page.locator('a:has-text("View Cart")');
  }

  async goToProducts(): Promise<string> {
    return await this.goto('products');
  }

  async addToCartRandomProduct(): Promise<number> {
    await this.allItemsWrapper.waitFor({ state: 'visible' });

    const products = this.allItemsWrapper.locator(this.productWrapper);
    const productsCount = await products.count();
    const randomIndex = Math.floor(Math.random() * productsCount);

    await products.nth(randomIndex).locator(this.addToCart).first().click();

    return randomIndex;
  }

  async multipleProducts(numberOfProductsToAdd: number): Promise<string> {
    await this.goToProducts();

    for (let i = 0; i < numberOfProductsToAdd; i++) {
      await this.addToCartRandomProduct();
      // Wait for modal to appear after add to cart
      await this.page.waitForLoadState('load');
      // Wait for continue shopping button to be visible
      await this.continueShoppingBtn.waitFor({ state: 'visible' });
      await this.continueShoppingBtn.click();
      // Wait for modal to close and page to return to products
      await this.allItemsWrapper.waitFor({ state: 'visible' });
    }

    // Navigate to cart and wait for the page to load
    const cartUrl = await this.goto('view_cart');
    await this.page.waitForURL('**/view_cart', { timeout: 5000 });
    return cartUrl;
  }
}
