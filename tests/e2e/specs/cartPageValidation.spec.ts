import { test, expect } from '../fixtures';
import { emptyCartNotification } from '../helpers/data.helper';

test.describe('Automation Exercise - Cart page validation', () => {
  const desiredQuantity = '3';
  let productValues: { title: string | null; price: string | null };

  test.beforeEach(async ({ productDetailsPage }) => {
    await productDetailsPage.openFirstProduct();

    const getProductValues = await productDetailsPage.productDetailsElementsValidation();
    await productDetailsPage.setQuantity(desiredQuantity);

    productValues = {
      title: getProductValues.productTitle.value ?? null,
      price: getProductValues.productPrice.value ?? null,
    };

    const cartPageUrl = await productDetailsPage.goToCartPage(desiredQuantity);

    expect(cartPageUrl).toContain('view_cart');
  });

  test(
    'TC-01: Validate that the added product is displayed correctly in the cart',
    { tag: ['@smoke'] },
    async ({ cartPage }) => {
      const cartValues = await cartPage.cartItemsValidation();

      expect(cartValues.image).toBe(true);
      expect(cartValues.title).toBe(productValues.title);
      expect(cartValues.price).toBe(productValues.price);
      expect(cartValues.quantity).toBe(desiredQuantity);
    },
  );

  test(
    'TC-02: Validate that removing an item clears the cart',
    { tag: ['@regression'] },
    async ({ cartPage }) => {
      const emptyCartText = await cartPage.removeItemFromCart();
      const getCartItemsCount = await cartPage.getCartItemsCount();

      expect(emptyCartText).toEqual(emptyCartNotification);
      expect(getCartItemsCount).toEqual(0);
    },
  );
});
