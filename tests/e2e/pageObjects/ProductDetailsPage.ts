import { type Locator, type Page } from '@playwright/test';
import BasePage from '../helpers/BasePage';

export interface ProductDetailElement {
  visible: boolean;
  value?: string | null;
}

export interface ProductDetailsValidation {
  productImage: ProductDetailElement;
  productTitle: ProductDetailElement;
  productCategory: ProductDetailElement;
  productPrice: ProductDetailElement;
  productAvailability: ProductDetailElement;
  productCondition: ProductDetailElement;
  productBrand: ProductDetailElement;
  quantityInput: { visible: boolean; value: string };
  addToCartBtn: ProductDetailElement;
}

export default class ProductDetailsPage extends BasePage {
  private readonly allItemsWrapper: Locator;
  private readonly productWrapper: Locator;
  private readonly viewProductButton: Locator;
  private readonly productDetails: Locator;
  private readonly productImage: Locator;
  private readonly productTitle: Locator;
  private readonly productCategory: Locator;
  private readonly productPrice: Locator;
  private readonly productAvailability: Locator;
  private readonly productCondition: Locator;
  private readonly productBrand: Locator;
  private readonly quantityInput: Locator;
  private readonly addToCartBtn: Locator;
  private readonly modal: Locator;
  private readonly modalText: Locator;
  private readonly viewCartBtn: Locator;
  private readonly continueShoppingBtn: Locator;

  constructor(page: Page) {
    super(page);

    this.allItemsWrapper = page.locator('.features_items');
    this.productWrapper = page.locator('.product-image-wrapper');
    this.viewProductButton = page.locator('a:has-text("View Product")');
    this.productDetails = page.locator('.product-details');
    this.productImage = page.locator('.view-product');
    this.productTitle = page.locator('.product-information h2');
    this.productCategory = page.locator('.product-information p:has-text("Category")');
    this.productPrice = page.locator('.product-information span span');
    this.productAvailability = page.locator('.product-information p:has-text("Availability")');
    this.productCondition = page.locator('.product-information p:has-text("Condition")');
    this.productBrand = page.locator('.product-information p:has-text("Brand")');
    this.quantityInput = page.locator('#quantity');
    this.addToCartBtn = page.locator('button:has-text("Add to cart")');
    this.modal = page.locator('#cartModal');
    this.modalText = page.locator('#cartModal .modal-body p').first();
    this.viewCartBtn = page.locator('a:has-text("View Cart")');
    this.continueShoppingBtn = page.locator('button:has-text("Continue Shopping")');
  }

  async goToProducts(): Promise<string> {
    return await this.goto('products');
  }

  async openFirstProduct(): Promise<string> {
    await this.goToProducts();
    await this.allItemsWrapper.waitFor({ state: 'visible' });

    await this.allItemsWrapper
      .locator(this.productWrapper)
      .first()
      .locator(this.viewProductButton)
      .click();

    // Wait for navigation to product details page
    await this.page.waitForURL('**/product_details/**');
    await this.productDetails.waitFor({ state: 'visible' });

    return this.page.url();
  }

  async productDetailsElementsValidation(): Promise<ProductDetailsValidation> {
    await this.productDetails.waitFor({ state: 'visible' });

    return {
      productImage: {
        visible: await this.productImage.isVisible(),
      },
      productTitle: {
        visible: await this.productTitle.isVisible(),
        value: await this.productTitle.textContent(),
      },
      productCategory: {
        visible: await this.productCategory.isVisible(),
        value: await this.productCategory.textContent(),
      },
      productPrice: {
        visible: await this.productPrice.isVisible(),
        value: await this.productPrice.textContent(),
      },
      productAvailability: {
        visible: await this.productAvailability.isVisible(),
      },
      productCondition: {
        visible: await this.productCondition.isVisible(),
      },
      productBrand: {
        visible: await this.productBrand.isVisible(),
        value: await this.productBrand.textContent(),
      },
      quantityInput: {
        visible: await this.quantityInput.isVisible(),
        value: await this.quantityInput.inputValue(),
      },
      addToCartBtn: {
        visible: await this.addToCartBtn.isVisible(),
      },
    };
  }

  /**
   * Sets the product quantity.
   */
  async setQuantity(quantity: string = '1'): Promise<string> {
    await this.quantityInput.waitFor({ state: 'visible' });
    await this.quantityInput.fill(quantity);

    return await this.quantityInput.inputValue();
  }

  /**
   * Adds the product to cart (clicks Add to Cart button).
   */
  async addToCart(): Promise<void> {
    await this.addToCartBtn.click();
  }

  /**
   * Waits for the cart modal to appear and its elements to be visible.
   */
  async waitForCartModal(): Promise<void> {
    await this.modal.waitFor({ state: 'visible' });
    await this.viewCartBtn.waitFor({ state: 'visible' });
    await this.continueShoppingBtn.waitFor({ state: 'visible' });
  }

  /**
   * Clicks the View Cart button in the modal.
   */
  async viewCart(): Promise<string> {
    await this.viewCartBtn.click();
    return this.page.url();
  }

  /**
   * Complete cart flow: set quantity, add to cart, and navigate to cart page.
   */
  async goToCartPage(quantity: string = '1'): Promise<string> {
    await this.setQuantity(quantity);
    await this.addToCart();
    await this.waitForCartModal();

    return await this.viewCart();
  }
}
