import { expect, type Locator, type Page } from '@playwright/test';
import BasePage from '../helpers/BasePage';

export interface CartItemValues {
  image: boolean;
  title: string | null;
  price: string | null;
  quantity: string;
}

export default class CartPage extends BasePage {
  private readonly cartInfoTable: Locator;
  private readonly cartProductTitle: Locator;
  private readonly cartProductPrice: Locator;
  private readonly cartProductQuantity: Locator;
  private readonly cartProductImage: Locator;
  private readonly removeItem: Locator;
  private readonly cartRows: Locator;
  private readonly emptyCart: Locator;

  constructor(page: Page) {
    super(page);

    this.cartInfoTable = page.locator('#cart_info');
    this.cartProductTitle = page.locator('.cart_description h4 a');
    this.cartProductPrice = page.locator('.cart_price p');
    this.cartProductQuantity = page.locator('.disabled');
    this.cartProductImage = page.locator('.cart_product img');
    this.removeItem = page.locator('.cart_quantity_delete');
    this.cartRows = page.locator('#cart_info_table tbody tr');
    this.emptyCart = page.locator('#empty_cart');
  }

  async cartItemsValidation(): Promise<CartItemValues> {
    await this.cartInfoTable.waitFor({ state: 'visible' });
    await this.cartProductQuantity.waitFor({ state: 'visible' });

    return {
      image: await this.cartProductImage.isVisible(),
      title: await this.cartProductTitle.textContent(),
      price: await this.cartProductPrice.textContent(),
      quantity: await this.cartProductQuantity.innerText(),
    };
  }

  async removeItemFromCart(): Promise<string> {
    const count = await this.removeItem.count();

    for (let i = count; i > 0; i--) {
      await this.removeItem.first().click();
      // Wait for the item to be removed from DOM
      await this.page.waitForTimeout(500);
      await expect(this.removeItem).toHaveCount(i - 1);
    }

    await this.emptyCart.waitFor({ state: 'visible' });

    return ((await this.emptyCart.textContent()) ?? '').trim();
  }

  async getCartItemsCount(): Promise<number> {
    return await this.cartRows.count();
  }
}
